import express from "express";
import session from "express-session";
import { connection, connect } from "mongoose";
import connectMongo from "connect-mongo";
import uuidv4 from "uuid/v4";
import passport from "passport";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import path from "path";
import ReactDOMServer from "react-dom/server";
import serialize from "serialize-javascript";
import config, { passportConfig } from "./Config";

// local config store, App and routes
import configureStore from "@Shared/configureStore";
import createApp from "./jsxReactApp";
import routes from "./routes";

// const reload = require("reload");
const app = express();

const env = config();

const MongoStore = connectMongo(session);

const PORT = env.PORT;

app.use(cors());

app.use(helmet());

connect(env.DATABASE_CONNECTION, {

	useFindAndModify: false,

	useNewUrlParser: true,
	
	useUnifiedTopology: true,

}).then(() => env.MODE === "production" && console.log("Connected"))

.catch((error) => { env.MODE === "production" && console.log("Connection failed with - ", error) });

//DB connection
const DB_CONNECTION = connection;

const MAXAGE = 14 * 24 * 60 * 60;

const sess = {

	genid: () => { return uuidv4() },

	secret: `${env.SECRET}`,

	proxy: true,

	saveUninitialized: true, // don't create session until something stored

	resave: false, //don't save session if unmodified

	store: new MongoStore({

		mongooseConnection: DB_CONNECTION,

		ttl: MAXAGE, // = 14 days. Default

		autoRemove: "interval",

		autoRemoveInterval: 10, // In minutes. Default
	}),

	cookie: {

		SameSite: "Strict",

		HttpOnly: true,
	},
};

if (env.MODE === "production") {

	app.set("trust proxy", true); // trust first proxy

	sess.cookie.Domain = env.API_URL;

	sess.cookie.Secure = true; // serve secure cookies

	sess.cookie.MaxAge = MAXAGE;
}

app.use(cors());

app.use(bodyParser.json({

	limit: "50mb"
}));

app.use(

	bodyParser.urlencoded({

		extended: true,

		limit: "50mb",

		parameterLimit: 50000,
	}),
);

app.use(session(sess));

app.use("/static", express.static("dist/static"));

app.use(express.static(path.join(__dirname, env.DOC_ROOT)));

// app.set("views", path.resolve("public"));

app.set("views", path.resolve("dist/static"));

app.set("view engine", "ejs");

app.use(express.static("public"));

passportConfig(passport);

app.use(passport.initialize());

app.use(passport.session());

app.get('/api/hello', (req, res) => {

	res.send({ express: 'Hello From Express' });
});

app.use("/", routes(app, passport));


app.get("*", (req, res, next) => {

	//res.send('<p>hello deb1</p>');
	//file request are not processed here
	if (/[.]/.exec(req.url)) return next();

	const { store } = configureStore();

	let context;

	const css = new Set(); // CSS for all rendered React components

	const insertCss = (...styles) =>

		styles.forEach((style) => {

			css.add(style._getCss());
		});

	context = {};

	const markup = ReactDOMServer.renderToString(createApp(req.url, store, context, insertCss));

	res.render("index", {

		MARKUP: markup,

		CSS: [...css].join(""),

		// preloadedState: serialize(context, { isJSON: true }),
		INITIAL_STATE: `<script>
				// WARNING: See the following for security issues around embedding JSON in HTML:
				// http://redux.js.org/recipes/ServerRendering.html#security-considerations
				window.__PRELOADED_STATE__ = ${JSON.stringify(serialize(context)).replace(/</g, "\\u003c")}
			</script>`,

		HOT_RELOAD: env.MODE === "development" ? "/reload/reload.js" : "",
	});
});

env.MODE === "development" &&
	// reload(app)
	require("reload")(app).then(() => {

		// reloadReturned object see returns documentation below for what is returned
		// Reload started
		app.listen(PORT, (data) => {

			env.MODE === "development" && console.log(`App listening on port ${PORT}!`);

		}).on("error", (error) => {

			if (error.syscall !== "listen") throw error;

			let bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

			// handle specific listen errors with friendly messages

			switch (error.code) {

				case "EACCES":

					console.error(bind + " requires elevated privileges");

					env.exit(1);

					break;
				case "EADDRINUSE":

					console.error(bind + " is already in use");

					env.exit(1);

					break;
				default:
					throw error;
			}
		});
	}).catch(function () {

		// Reload did not start correctly, handle error
		env.MODE === "development" && console.log("Reload error!");
	});

env.MODE === "production" &&

	app.listen(PORT, () => {

		console.log('prod');

		env.MODE === "development" && console.log(`App listening on port ${PORT}!`);

	}).on("error", (error) => {

		if (error.syscall !== "listen") throw error;

		let bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

		// handle specific listen errors with friendly messages
		switch (error.code) {

			case "EACCES":

				console.error(bind + " requires elevated privileges");

				env.exit(1);

				break;
			case "EADDRINUSE":

				console.error(bind + " is already in use");

				env.exit(1);

				break;
			default:
				throw error;
		}
	});

export default app;