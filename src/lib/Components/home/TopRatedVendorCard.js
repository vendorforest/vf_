import React from "react";
import { Rate, Avatar, message } from "antd";
import { constants } from "@Shared/constants";
import defaultProfileImage from "@Components/images/profileplace.png";
import { connect } from "react-redux";

class TopRatedVendorCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const username = this.props.user;
    this.handleClick = () => {
      if (!username) {
        window.location.href = "/login";
      } else {
        const userStatus = username.userObj.accountType;
        if (userStatus === 0) {
          window.location.href = `/findvendors?vendor=${this.props.vendor.username}`;
        } else {
          message.warning("You are not a employer.");
        }
      }
    };
  }

  render() {
    return (
      <div className="toprate-card">
        <div className="text-center">
          <Avatar src={this.props.vendor.profileImage || defaultProfileImage} size={100} />
        </div>
        <h6 className=" font-weight-bold mt-3">
          {this.props.vendor.firstName && this.props.vendor.lastName
            ? `${this.props.vendor.firstName} ${this.props.vendor.lastName}`
            : this.props.vendor.username}
        </h6>
        <div className=" font-weight-light">
          {this.props.vendor.vendor.service
            ? `${this.props.vendor.vendor.service.name} / ${this.props.vendor.vendor.category.name}`
            : "NONE"}
        </div>
        <div className=" font-weight-light">
          {this.props.vendor.bsLocation
            ? `${this.props.vendor.bsLocation.city}/${this.props.vendor.bsLocation.country}`
            : "NONE"}
        </div>
        <div className="mb-3">
          <Rate
            value={this.props.vendor.vendor.rate}
            allowHalf
            disabled
          />
          <span>
            {this.props.vendor.vendor.rate}
          </span>
        </div>
        <button
          type="button"
          name="button"
          onClick={
            // window.location.href = "/findvendors?vendor='Gerard Kasemba'";
            this.handleClick
          }
        >
          Hire Vendor
        </button>
      </div>
    );
  }
}

const mapStateToProps = ({ loginReducer }) => {
  const { user } = loginReducer;
  return { user };
};

export default connect(mapStateToProps, {})(TopRatedVendorCard);
