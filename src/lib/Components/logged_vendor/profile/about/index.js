// @ts-nocheck
import React from "react";
import { connect } from "react-redux";
import { List, Rate, Card, Icon, Progress, message, Modal} from "antd";
import { fetchReviewsData } from "../essential";
import ReviewItem from "./ReviewItem";
import EditHourlyRate from "./EditHourlyRate";
import defaultProfileImage from "@Components/images/profileplace.png";
import { withRouter } from "react-router";

class VendorAbout extends React.Component {

	constructor(props) {

		super(props);

		this.state = {

			isModal: false,

		};
	}

	componentDidMount() {

		this.props.fetchReviewsData();
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

	toggle = () => {

		this.setState({isModal: !this.state.isModal});
	}

	render() {

		let user = this.props.user && this.props.user.accountType === 1 ? this.props.user : this.props.selectedVendor;

		const vendor = user ? user : undefined;

		const isPublic = this.props.user ? false : true;

		if (!vendor) return null;

		return (
			<div className="vendor-about">
				<Card title={<span className="h5 font-weight-bold">About</span>} className="shadow" style={{ marginBottom: "50px" }}>
					<div className="row">
						<div className="col-12 mb-4">
							<div className="d-flex flex-md-row flex-column justify-content-between">
								<div className="account-info d-flex mb-3">
									<div className="photo-wrap">
										<img src={user.profileImage || defaultProfileImage} alt={"profile"} />
									</div>
									<div className="ml-3">
										<h3>{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}</h3>
										{
											user.bsLocation && 
											<p> 
												<Icon type="global"/>
												<span className="ml-1"> {user.bsLocation ? `${user.bsLocation.city},  ${user.bsLocation.state} ${user.bsLocation.country}` : ""}</span>
											</p>
										}
										<Rate value={ vendor.vendor.rate} disabled allowHalf/>
										<span className="h6"> {vendor.vendor.rate.toFixed(1)}</span>
									</div>
								</div>
								<div className="status">
									<p>Job Complated Rate</p>
									<Progress size="small" status="active"
										percent={ vendor.vendor.jobCompletedRate ? vendor.vendor.jobCompletedRate : 0 }
									/>
									<p>Profile Status</p>
									<Progress percent={user.profilePercent} size="small" status="active" />
								</div>
							</div>
						</div>
						<div className="col-md-12">
							<div className="row">
								<div className="col-md-3 text-center">
									<div className="d-flex justify-content-center align-items-center">
										<h3>${vendor.vendor ? vendor.vendor.hourlyRate || 30 : 30}</h3>
										{
											!isPublic &&  
											<div className="h4 text-color ml-2 mb-0 pointer price-edit editable" onClick={() => { this.toggle(); }}>
												<Icon type="edit" />
											</div>
										}
									</div>
									<h6>Hourly Rate</h6>
								</div>
								{
									!isPublic && 
									<div className="col-md-3 text-center">
										<h3>${vendor.vendor ? vendor.vendor.totalEarning : 0}</h3>
										<h6>Total Earning</h6>
									</div>
								}
								<div className="col-md-3 text-center">
									<h3>{vendor.vendor ? vendor.vendor.jobs : 0}</h3>
									<h6>jobs</h6>
								</div>
								<div className="col-md-3 text-center">
									<h3>{vendor.vendor ? vendor.vendor.hoursWorked : 0}</h3>
									<h6>Hours Worked</h6>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<Card title={<span className="h5 font-weight-bold">Work History & Reviews</span>} className="shadow" style={{ marginBottom: "50px" }}>
					<div className="row">
						<div className="col-12 mb-4">
							{
								!this.props.reviews && this.props.pending && 
								<div className="w-100 p-5 text-center loading-small">
									<Icon type="sync" spin />
								</div>
							}
							{
								this.props.reviews && Array.isArray(this.props.reviews) &&
								<List itemLayout="vertical" size="large" 
									className="review-list" dataSource={this.props.reviews || []}
									pagination={{ 
										onChange: (page) => {},
										pageSize: 5,
									}}
									footer={<div></div>}
									renderItem={(item, index) => 
										<List.Item key={index} style={{ cursor: "pointer" }}>
											<ReviewItem review={item} />
										</List.Item>
									}
								/>
							}
						</div>
					</div>
				</Card>
				{
					!isPublic && 
					<Modal title="Edit Hourly Rate" visible={this.state.isModal} onOk={this.toggle} onCancel={this.toggle} width={"500px"} footer={null}>
						<EditHourlyRate rate={vendor ? vendor.hourlyRate || 30 : 30} toggle={this.toggle} />
					</Modal>
				}
			</div>
		)
	}
}

const mapStateToProps = ({ vendorProfileReducer }) => {

	const { error, user, reviews, pending } = vendorProfileReducer;

	return { error, user, reviews, pending };
};

export default connect(mapStateToProps, {

	fetchReviewsData,

})(withRouter(VendorAbout));