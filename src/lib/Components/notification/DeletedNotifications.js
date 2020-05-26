import React from "react";
import { List, Icon } from "antd";
import { connect } from "react-redux";
import DeletedNotificationItems from "./DeletedNotificationItems";
import { getDeletedNotification } from "./essential";
import { constants } from "@Shared/constants";

class AllNotification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentDidMount() {
    this.props.getDeletedNotification({
      status: constants.NOTIFICATION_STATUS.DELETED,
    });
  }

  render() {
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
          dataSource={this.props.deletedNotification}
          footer={<div></div>}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <DeletedNotificationItems notification={item} index={index} />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ notificationReducer, loginReducer }) => {
  const { user } = loginReducer;
  const { deletedNotification, error, pending, success } = notificationReducer;
  return { error, deletedNotification, success, pending, user };
};

export default connect(mapStateToProps, {
  getDeletedNotification,
})(AllNotification);
