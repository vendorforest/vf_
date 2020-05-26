import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import { connect } from "react-redux";
import moment from "moment";
import VendorMemberItem from "./MemberItem";
import localStyle from "./index.scss";
import VendorMemberList from "./MemberList";
import VendorOffers from "./Offers";
import VendorPendingContracts from "./PendingContracts";
import VendorPastContracts from "./PastContracts";

import { fetchTeamData } from "./essential";
import { message, Icon } from "antd";
import {Header, Footer} from "@Components/inc";
import globalStyle from "@Sass/index.scss";

class VendorViewTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.fetchTeamData({
        _id: this.props.match.params.id,
      });
    }
  }

  UNSAFE__componentWillReceiveProps(newProps) {
    if (!this.props.success && newProps.success) {
      message.success(newProps.success);
    }
    if (!this.props.error && newProps.error) {
      message.error(newProps.error);
    }
  }

  render() {
    return (
      <div id="vendor-viewteam">
        <Header />
        <div className="container">
          <div className="row">
            <div className="col-12 content-wrap">
              {!this.props.team && this.props.pending && (
                <div className="w-100 p-5 text-center loading mb-5">
                  <Icon type="sync" spin />
                </div>
              )}
              {this.props.team && (
                <div className="content">
                  <VendorMemberList team={this.props.team} />
                  {this.props.team.invitedUsers.findIndex(
                    (user) => user._id === this.props.user.userObj._id,
                  ) === -1 && (
                    <div>
                      <VendorOffers />
                      <VendorPendingContracts />
                      <VendorPastContracts />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ vendorViewTeamReducer, loginReducer }) => {
  const { error, team, success, pending } = vendorViewTeamReducer;

  const { user } = loginReducer;

  return {
    error,
    team,
    success,
    pending,
    user,
  };
};

export default connect(mapStateToProps, {
  fetchTeamData,
})(withStyles(globalStyle, localStyle)(VendorViewTeam));
