import React from "react";
import { List, Icon } from "antd";
import { connect } from "react-redux";
import NewQuestionItems from "./NewQuestionItems";
import { getNewQuestion } from "./essential";
import { constants } from "@Shared/constants";

class AllNotification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: undefined,
    };
  }
  componentDidMount() {
    this.props.getNewQuestion({
      status: 0,
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
          dataSource={this.props.newQuestions}
          footer={<div></div>}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <NewQuestionItems newQuestion={item} />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ questionReducer, loginReducer }) => {
  const { user } = loginReducer;
  const { newQuestions, error, pending, success } = questionReducer;
  return { error, newQuestions, success, pending, user };
};

export default connect(mapStateToProps, {
  getNewQuestion,
})(AllNotification);
