import mongoose from "mongoose";
import {constants} from '@Config/constants'

const PortfolioSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "user",

        required: true,
    },

    title: {
            
        type: String,
    },

    caption: {

        type: String,
    },

    public_id: {

        type: String,
        
        required: true,
    },

    version: {
        
        type: String,
    },

    url: {

        type: String,
    },

    video_type: {
        
        type: String,
    },

    type: {

        type: Number,

        default: constants.PORTFOLIO_TYPE.IMAGE
    }
}, {

    versionKey: false,

    timestamps: true,
});

PortfolioSchema.post("init", function(doc) {

  // env.MODE === "development" && console.log("init hook", doc)
});


export default mongoose.model("portfolio", PortfolioSchema);
