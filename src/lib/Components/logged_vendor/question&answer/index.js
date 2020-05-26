import React from "react";
import { Icon, Tabs } from "antd";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import Newquestion from "./Newquestion";
import Answeredquestion from "./Answeredquestion";
import { getAnsweredQuestion, getNewQuestion } from "./essential";
const { TabPane } = Tabs;

class ClientJobDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.clickTab = this.clickTab.bind(this);
  }

  clickTab(key) {
    process.env.NODE_ENV === "development" && console.log(key);
  }

  componentDidMount() {
    this.props.getAnsweredQuestion({
      status: 1,
    });
    this.props.getNewQuestion({
      status: 0,
    });
  }

  render() {
    return (
      <div className="job-details">
        {/* {!this.props.notification && (
          <div className="text-center loading-small py-5">
            <Icon type="sync" spin />
          </div>
        )} */}
        {this.props.user && (
          <div>
            <Header/>
            <div className="content">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="shadow p-md-5 p-2">
                      <h3>Questions</h3>
                      <hr />
                      {/* {(!this.props.job || !this.props.proposales) && this.props.pending && (
                    <div className="text-center loading-small">
                      <Icon type="sync" spin />
                    </div>
                  )} */}
                      {/* {this.props.notification && ( */}
                      <Tabs defaultActiveKey="1" onChange={this.clickTab}>
                        <TabPane
                          tab={`New Questions (${
                            this.props.newQuestions ? this.props.newQuestions.length : 0
                          })`}
                          key="1"
                        >
                          <Newquestion />
                        </TabPane>
                        <TabPane
                          tab={`Answered Questions (${
                            this.props.answeredQuestions
                              ? this.props.answeredQuestions.length
                              : 0
                          })`}
                          key="2"
                        >
                          <Answeredquestion />
                        </TabPane>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ questionReducer, loginReducer }) => {
  const { user } = loginReducer;
  const { answeredQuestions, error, pending, success, newQuestions } = questionReducer;
  return { error, answeredQuestions, success, pending, user, newQuestions };
};

export default connect(mapStateToProps, { getAnsweredQuestion, getNewQuestion })(
  withStyles(globalStyle, localStyle)(ClientJobDetails),
);
