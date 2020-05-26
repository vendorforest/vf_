import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import Warning from "./warning";
import { connect } from "react-redux";

import PostedJobs from "./PostedJobs";
import PendingContracts from "./PendingContracts";
import PastContracts from "./PastContracts";

import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { fetchClient } from "./essential";

class ClientDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postedJobs: [],
      pendingContracts: [],
      pastContracts: [],
    };
  }
  componentDidMount() {
    this.props.fetchClient();
  }

  render() {
    return (
      <div className="client-dashboard">
        <Header />
        <div className="content">
          <div className="container">
            {this.props.clientInfo !== undefined ? (
              <Warning data={this.props.clientInfo} />
            ) : null}
            <div className="row">
              <div className="col-12 mb-md-4 mb-3">
                <PostedJobs />
              </div>
              <div className="col-12 mb-md-4 mb-3">
                <PendingContracts />
              </div>
              <div className="col-12 mb-md-4 mb-3">
                <PastContracts />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ loginReducer, clientDashboardReducer }) => {
  const { user } = loginReducer;
  const { clientInfo } = clientDashboardReducer;
  return {
    user,
    clientInfo,
  };
};

export default connect(mapStateToProps, {
  fetchClient,
})(withStyles(globalStyle, localStyle)(ClientDashboard));
