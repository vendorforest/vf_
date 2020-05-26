import React from "react";
import { connect } from "react-redux";
import { Select, Icon, message } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import VendorPortfolios from "./portfolios";
import VendorAbout from "./about/index";
import VendorTeams from "./teams";
import VendorServices from "./services";
import VendorPayment from "./Payment";

import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";

import { fetchGetUserData } from "./essential";
const { Option } = Select;

const contents = [
	<div className="w-100">
		<VendorAbout />
	</div>,
	<div className="w-100">
		<VendorPortfolios />
	</div>,
	<div className="w-100">
		<VendorTeams />
	</div>,
	<div className="w-100">
		<VendorServices />
	</div>,
	<div className="w-100">
		<VendorPayment />
	</div>,
];

class VendorProfile extends React.Component {

	constructor(props) {

		super(props);

		this.state = {

			selectedMenu: 0,
		};

		this.selectMenu = this.selectMenu.bind(this);
	}

	async componentDidMount() {

		await this.props.fetchGetUserData();
	}

	static getDerivedStateFromProps(props, state) {

		if (!state.success && props.success) {

			message.success(props.success);
		}

		if (state.error && props.error) {

			message.error(props.error);
		}

		return { pending: props.pending, success: props.success, error: props.error, user: props.user };
	}

	selectMenu(index) {

		this.setState({ selectedMenu: index });
	}

	render() {
		return (
			<div className="vendor-profile">
				<Header />
				<div className="container">
					<div className="row">
						<div className="col-12">
							<div className="vendorprofile">
								{
									!this.props.user && this.props.pending && 
									<div className="text-center loading">
										<Icon type="sync" spin />
									</div>
								}
								{
									this.props.user && 
									<div className="d-xl-flex d-block wrap">
										<div className="side-section">
											<div className="content">
												<ul>
													<li onClick={() => { this.selectMenu(0); }} className={this.state.selectedMenu === 0 ? "active" : ""}>About</li>
													<li onClick={() => { this.selectMenu(1); }} className={this.state.selectedMenu === 1 ? "active" : ""}>Portfolio</li>
													<li onClick={() => { this.selectMenu(2); }} className={this.state.selectedMenu === 2 ? "active" : ""}>Teams</li>
													<li onClick={() => { this.selectMenu(3); }} className={this.state.selectedMenu === 3 ? "active" : ""}>Services</li>
													<li onClick={() => { this.selectMenu(4); }} className={this.state.selectedMenu === 4 ? "active" : ""}>Payment</li>
												</ul>
												<div className="w-100 select-menu">
													<Select value={String(this.state.selectedMenu)}
														style={{ width: "100%" }}
														size={"large"}
														onChange={(value) => {
															this.selectMenu(Number(value));
														}}>
														<Option value="0">About</Option>
														<Option value="1">Portfolio</Option>
														<Option value="2">Teams</Option>
														<Option value="3">Services</Option>
														<Option value="4">Payment</Option>
													</Select>
												</div>
											</div>
										</div>
										<div className="detail-section">
											<div className="row">
												<div className="col-12">{contents[this.state.selectedMenu]}</div>
											</div>
										</div>
									</div>
								}
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

const mapStateToProps = ({ vendorProfileReducer }) => {

	const { error, success, user, pending } = vendorProfileReducer;

	return { error, success, user, pending };
};

export default connect(mapStateToProps, {

	fetchGetUserData,

})(withStyles(globalStyle, localStyle)(VendorProfile));
 