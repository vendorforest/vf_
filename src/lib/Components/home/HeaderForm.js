import React from "react";
import { Button } from 'antd'


class HeaderForm extends React.Component {

	constructor(props) {

		super(props);

		this.state = {

			top: 0,

			bottom: 0,
		};
	}

	render() {
		return (
			<div className="header-form">
				<div className="container h-100">
					<div className="row h-100">
						<div className="col-12 d-flex align-items-center h-100">
							<div className="w-100">
								<h1 className="mb-5">The one place to hire the right vendor for anything.</h1>
								<h3 className="mb-4">Find local vendors specialized with the right skills ready to work because your satisfaction is our reward.</h3>
								<Button type="primary" style={{minWidth: '150px'}} size="large">Post a Job</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
  }
}

export default HeaderForm;
