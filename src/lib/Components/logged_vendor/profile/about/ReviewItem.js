import React from "react";
import { Rate } from "antd";
import moment from "moment";
import feedBackIconOnTime from "@Components/images/NewIcons/feedbackicon_1.png";
import feedBackIconSkillful from "@Components/images/NewIcons/feedbackicon_2.png";
import feedBackIconExcelent from "@Components/images/NewIcons/feedbackicon_3.png";
import feedBackIconBeyond from "@Components/images/NewIcons/feedbackicon_4.png";
import feedBackIconEntertaining from "@Components/images/NewIcons/feedbackicon_5.png";
import feedBackIconConversation from "@Components/images/NewIcons/feedbackicon_6.png";

class ReviewItem extends React.Component {

	constructor(props) {

		super(props);

		this.state = {};
	}

	getBadgeIcon(badge) {

		switch (badge) {

			case 0:

				return feedBackIconOnTime;

			case 1:

				return feedBackIconSkillful;

			case 2:

				return feedBackIconExcelent;

			case 3:

				return feedBackIconBeyond;

			case 4:

				return feedBackIconEntertaining;

			case 5:

				return feedBackIconConversation;
		}
	}

	render() {

		console.log(this.props.review)

		const generateBadges = () => {

			return this.props.review.vendorBadge.map((badge, index) => {

				return <img key={index} src={this.getBadgeIcon(badge)} alt="badge" style={{
					width: "25px",
					height: "25px",
				}}/>
			});
		};

		return (

			<div className="review-item">
				<div className="w-100 d-flex justify-content-between">
					<div className="mr-2">
						<h6 className="text-color pointer mb-2">{this.props.review.contract.job.title}</h6>
						<p className="text-grey">
							<span className=" font-weight-bold">
								{
									this.props.review.from.firstName && this.props.review.from.lastName ? 
									`${this.props.review.from.firstName} ${this.props.review.from.lastName}` : 
									this.props.review.from.username
								}
							</span>
							<span> on {moment(this.props.review.createdAt).format("MMM DD, YYYY")}</span>
						</p>
						<p className="text-grey font-italic">{this.props.review.feedback}</p>
					</div>
					<div>
						<Rate value={Number(this.props.review.rate)} disabled allowHalf />
						<span className="text-grey">{this.props.review.rate}</span>
						<div className="d-flex justify-content-between mt-2">{generateBadges()}</div>
					</div>
				</div>
			</div>
		);
	}
	}

	export default ReviewItem;
