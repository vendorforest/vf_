import React from "react";
import { List, Icon } from "antd";
import { connect } from "react-redux";
import ProposalItem from "./ProposalItem";
import { constants } from "@Shared/constants";

class Hired extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    const hiredProposales = this.props.proposales.filter(
      (proposal) => proposal.status === constants.PROPOSAL_STATUS.HIRED,
    );

    return (
      <div className="proposals py-md-4 py-2">
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              process.env.NODE_ENV === "development" && console.log(page);
            },
            pageSize: 5,
          }}
          dataSource={hiredProposales}
          footer={<div></div>}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <ProposalItem proposal={item} />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ clientJobDetailsReducer, loginReducer }) => {
  const { error, job, success, proposales, pending } = clientJobDetailsReducer;

  const { user } = loginReducer;

  return { error, job, success, proposales, pending, user };
};

export default connect(mapStateToProps, {})(Hired);
