// @ts-nocheck
import React from "react";
import { Icon, Alert } from "antd";

class Warning extends React.Component {

	constructor(props) {

		super(props);

		this.state = {

			account: undefined,

			company: undefined,

			bill: undefined,

			service: undefined,
		};
	}

	componentDidMount() {

		if (this.props.data) {

			const account = this.props.data.bsLocation ? true : undefined;

			const billingMethod = this.props.data.vendor.connectedAccountId ? true : undefined;

			const company = this.props.data.vendor.company ? true : undefined;

			const service = this.props.data.vendor.service ? true : undefined;

			this.setState({ account: account, company: company, bill: billingMethod, service: service});
		}
	}

	render() {
		return (
			<div>
				{
					this.state.account === true && this.state.company === true && this.state.bill === true && this.state.service === true ? "" : 
					<Alert className="warning-text"
						message="The next thing that you need to do after loging in is to:"
						description={
							<ol>
								<li> Complete your{" "} <span> <a href="/vendor/settings">Settings</a></span>
									<ul>
										<li>My account{" "}
											{this.state.account === true ? <span><Icon type="check" className="check" /></span>: ""}
										</li>
										<li>Company Info{" "}
											{this.state.company === true ? <span><Icon type="check" className="check" /></span> : ""}
										</li>
										<li>Billing Method{" "}
											{this.state.bill === true ? <span><Icon type="check" className="check" /></span> : ""}
										</li>
									</ul>
								</li>
								<li> Complete your{" "}<span><a href="/vendor/profile">Profile</a></span>
									<ul>
										<li> Services{" "}
											{this.state.service === true ? <span><Icon type="check" className="check" /></span> : "" }
										</li>
									</ul>
								</li>
							</ol>
						}
						type="warning"
						showIcon
					/>
				}
			</div>
		);
	}
}

export default Warning;
