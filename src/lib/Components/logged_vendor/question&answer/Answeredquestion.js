import React from "react";
import { List, Icon } from "antd";
import { connect } from "react-redux";
import AnsweredQuestionItems from "./AnsweredQuestionItems";
import { getAnsweredQuestion } from "./essential";
import { constants } from "@Shared/constants";

class AllNotification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentDidMount() {
    this.props.getAnsweredQuestion({
      status: 1,
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
          dataSource={this.props.answeredQuestions}
          footer={<div></div>}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <AnsweredQuestionItems answeredQuestion={item} index={index} />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ questionReducer, loginReducer }) => {
  const { user } = loginReducer;
  const { answeredQuestions, error, pending, success } = questionReducer;
  return { error, answeredQuestions, success, pending, user };
};

export default connect(mapStateToProps, {
  getAnsweredQuestion,
})(AllNotification);
