import React from "react";
import { List, Icon } from "antd";
import { connect } from "react-redux";
import AllNotificationItems from "./AllNotificationItems";
import { getNotification } from "./essential";
import { constants } from "@Shared/constants";

class AllNotification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: undefined,
    };
  }
  componentDidMount() {
    this.props.getNotification({
      status: constants.NOTIFICATION_STATUS.CREATED,
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
          dataSource={this.props.notification}
          footer={<div></div>}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <AllNotificationItems notification={item} />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ notificationReducer, loginReducer }) => {
  const { user } = loginReducer;
  const { notification, error, pending, success } = notificationReducer;
  return { error, notification, success, pending, user };
};

export default connect(mapStateToProps, {
  getNotification,
})(AllNotification);
