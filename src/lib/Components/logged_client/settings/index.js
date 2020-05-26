import React from "react";
import { Select, Icon, message } from "antd";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import ClientMyAccount from "./MyAccount";
import ClientSecurity from "./Security";
import ClientBillingMethod from "./billingMethod";
import ClientNotification from "./Notification";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { fetchClient } from "./essential";

const { Option } = Select;

const contents = [
	<div className="w-100">
		<ClientMyAccount />
	</div>,
	<div className="w-100">
		<ClientSecurity />
	</div>,
	<div className="w-100">
		<ClientBillingMethod />
	</div>,
	<div className="w-100">
		<ClientNotification />
	</div>,
];

class ClientSettings extends React.Component {

	constructor(props) {

		super(props);

		this.state = {

			selectedMenu: 0,
		};

		this.selectMenu = this.selectMenu.bind(this);
	}


	componentDidMount() {

		this.props.fetchClient();
	}


	static getDerivedStateFromProps(props, state) {

		if (!state.success && props.success) {

			message.success(props.success);
		}

		if (!state.error && props.error) {

			message.error(props.error);
		}

		return { success: props.success, error: props.error };
	}


	selectMenu(index) {

		this.setState({ selectedMenu: index });
	}


	render() {
		return (
			<div id="client-settings">
				<Header />
				<div className="container">
					<div className="row">
						<div className="col-12">
							<div className="client-settings">
								<div className="content-wrap">
									<div className="side-section">
										<div className="content">
											<ul>
												<li onClick={() => { this.selectMenu(0); }} className={this.state.selectedMenu === 0 ? "active" : ""}>My Account</li>
												<li onClick={() => { this.selectMenu(1); }} className={this.state.selectedMenu === 1 ? "active" : ""}>Password & Security</li>
												<li onClick={() => { this.selectMenu(2); }} className={this.state.selectedMenu === 2 ? "active" : ""}>Billing Methods</li>
												<li onClick={() => { this.selectMenu(3); }} className={this.state.selectedMenu === 3 ? "active" : ""}>Notiffication Settings</li>
											</ul>
											<div className="w-100 select-menu">
												<Select value={String(this.state.selectedMenu)} style={{ width: "100%" }} size={"large"} onChange={(value) => {
														this.selectMenu(Number(value));
												}}>
													<Option value="0">My Account</Option>
													<Option value="1">Password & Security</Option>
													<Option value="2">Billing Methods</Option>
													<Option value="3">Notiffication Settings</Option>
												</Select>
											</div>
										</div>
									</div>
									<div className="detail-section">
										<div className="row">
											<div className="col-12">
												{
													!this.props.user && !this.props.error && 
													<div className="text-center loading">
														<Icon type="sync" spin />
													</div>
												}
												{
													this.props.user && 
													<div>{contents[this.state.selectedMenu]}</div>
												}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

const mapStateToProps = ({ clientSettingsReducer }) => {

	const { error, user,success, pending } = clientSettingsReducer;

	return { error, user, success, pending };
};

export default connect(mapStateToProps, {

	fetchClient,

})(withStyles(globalStyle, localStyle)(ClientSettings));
