// @ts-nocheck
import React from "react";
import { Icon, Alert } from "antd";

class Warning extends React.Component {

	constructor(props) {

		super(props);
		
		this.state = {

			account: undefined,

			bill: undefined,
		};
	}

	componentDidMount() {

		if (this.props.data) {

			const account = this.props.data.bsLocation ? true : undefined;

			const billingMethod = this.props.data.client.customerId ? true : undefined;

			this.setState({ account: account, bill: billingMethod });
		}
	}

	render() {

		return (

			<div>
				{
					this.state.account === true && this.state.bill === true ?  "" : 
					<Alert className="warning-text" 
						message="The next thing that you need to do after loging in is to:"
						description={
							<ul style={{ listStyleType: "none" }}>
								<li>Complete your{" "}<span><a href="/client/settings">Settings</a></span>
									<ul>
										<li>My account{" "}
											{ this.state.account === true ? <span><Icon type="check" className="check" /></span> : ""}
										</li>
										<li>Billing Method{" "}
											{this.state.bill === true ? <span><Icon type="check" className="check" /></span> : ""}
										</li>
									</ul>
								</li>
							</ul>
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
