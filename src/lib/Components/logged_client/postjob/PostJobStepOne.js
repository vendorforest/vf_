import React from "react";
import { connect } from "react-redux";
import { Input, Form, Select, DatePicker, Upload, Icon, message, Button } from "antd";
import moment from "moment";
import { updateJob, updateStep } from "./essential";
const Dragger = Upload.Dragger;
const { Option } = Select;
const { TextArea } = Input;

class PostJobStepOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stDateTime: moment(),
      endDateTime: moment().add(7, "days"),
      currentQuestion: "",
      attachFiles: [],
      questions: [],
    };
    this.selectStDateTime = this.selectStDateTime.bind(this);
    this.selectEndDateTime = this.selectEndDateTime.bind(this);
    this.next = this.next.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
  }

  componentDidMount() {
    this.setState({
      stDateTime: this.props.job.stDateTime ? moment(this.props.job.stDateTime) : moment(),
      endDateTime: this.props.job.endDateTime
        ? moment(this.props.job.endDateTime)
        : moment().add(7, "days"),
      attachFiles: this.props.job.attachFiles
        ? this.props.job.attachFiles.map((file, index) => {
            return {
              uid: `-${index}`,
              name: file.name,
              status: "done",
              url: file.url,
              thumbUrl: file.url,
            };
          })
        : [],
      questions: this.props.job.questions || [],
    });
  }

  selectStDateTime(value, dateString) {
    this.setState({
      stDateTime: value,
    });
  }

  selectEndDateTime(value, dateString) {
    this.setState({
      endDateTime: value,
    });
  }

  selectQuestion(value) {
    this.setState({
      selectedQuestion: value,
    });
  }

  next = async (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.job.service === "") {
          message.error("Please select service");
          return;
        }
        if (this.props.job.category === "") {
          message.error("Please select category");
          return;
        }
        if (this.props.job.subCategory === "") {
          message.error("Please select subcategory");
          return;
        }
        const data = values;
        delete data.currentQuestion;
        data.stDateTime = this.state.stDateTime.toDate();
        data.endDateTime = this.state.endDateTime.toDate();
        data.attachFiles = this.state.attachFiles.map((file) => {
          return {
            name: file.name,
            url: file.url || file.response.url,
          };
        });
        data.questions = this.state.questions;
        this.props.updateJob({ ...this.props.job, ...data });
        this.props.updateStep(this.props.currentStep + 1);
      }
    });
  };

  uploadProps(self) {
    return {
      name: "file",
      multiple: true,
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      defaultFileList: [...this.state.attachFiles],
      onChange(info) {
        const status = info.file.status;
        if (status !== "uploading") {
        }
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
        self.setState({ attachFiles: info.fileList });
      },
      onRemove(info) {
        const attachFiles = info.fileList.map((file) => {
          return file.response.url;
        });
        self.setState({ attachFiles });
      },
    };
  }

  addQuestion = async (e) => {
    this.props.form.validateFields(["currentQuestion"], (err, values) => {
      if (!err && values.currentQuestion !== "") {
        if (this.state.questions.indexOf(values.currentQuestion) === -1) {
          const questions = [...this.state.questions];
          questions.push(values.currentQuestion);
          this.setState({
            questions: questions,
          });
          this.props.form.setFields({
            currentQuestion: "",
          });
        }
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    const generateQuestions = () => {
      return this.state.questions.map((question, index) => {
        return (
          <div className="d-flex mb-2" key={index}>
            <p className="col">
              {index + 1}: {question}
            </p>
            <Icon
              type="close"
              className="text-danger pointer"
              onClick={() => {
                const questions = [...this.state.questions];
                questions.splice(index, 1);
                this.setState({
                  questions: questions,
                });
              }}
            />
          </div>
        );
      });
    };

    return (
      <div className="postjob-stepone">
        <Form layout="vertical" onSubmit={this.next}>
          <div className="row">
            <div className="col-md-8 offset-md-2 col-sm-12 offset-sm-0">
              <div className="row">
                <div className="col-md-12">
                  <Form.Item label="Title">
                    {getFieldDecorator("title", {
                      initialValue: this.props.job.title, //solution
                      rules: [{ required: true, message: "Please input Job title" }],
                    })(<Input placeholder="Job Title" name="title" size={"large"} />)}
                  </Form.Item>
                  <Form.Item label="Job Description">
                    {getFieldDecorator("description", {
                      initialValue: this.props.job.description, //solution
                      rules: [{ required: true, message: "Please input Job Detail" }],
                    })(<TextArea placeholder="Job Detail" name="description" rows={10} />)}
                  </Form.Item>
                </div>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Item label="Start Time">
                        <DatePicker
                          showTime
                          placeholder="Start Time"
                          value={this.state.stDateTime}
                          onChange={this.selectStDateTime}
                          size={"large"}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Item label="End Time">
                        <DatePicker
                          showTime
                          placeholder="End Time"
                          value={this.state.endDateTime}
                          onChange={this.selectEndDateTime}
                          size={"large"}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 additional-file mb-4">
                  <Dragger {...this.uploadProps(this)}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">Please upload additional files</p>
                  </Dragger>
                </div>
                <div className="col-md-12">
                  <div className="add-question">
                    <Form.Item label="Additional Question">
                      {getFieldDecorator("currentQuestion", {
                        initialValue: this.state.currentQuestion, //solution
                        rules: [{ message: "Please input Additaionl Question." }],
                      })(
                        <Input
                          placeholder="Additional Question"
                          name="currentQuestion"
                          size={"large"}
                        />,
                      )}
                    </Form.Item>
                    <div
                      onClick={this.addQuestion}
                      style={{ marginTop: "32px", cursor: "pointer" }}
                      className="text-color"
                    >
                      <Icon type="plus-circle" style={{ fontSize: "32px" }} />
                    </div>
                  </div>
                  <div className="questions">{generateQuestions()}</div>
                </div>
              </div>
            </div>
            <div className="col-md-12 text-right controls mt-5">
              <button className="button-primary" type="submit">
                Next
              </button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ clientPostjobReducer }) => {
  const {
    error,
    success,
    currentStep,
    user,
    services,
    vendors,
    job,
    pending,
  } = clientPostjobReducer;
  return {
    error,
    success,
    currentStep,
    user,
    services,
    vendors,
    job,
    pending,
  };
};
const ClientPostJobStepOneForm = Form.create({ name: "client_postjob_stepone" })(
  PostJobStepOne,
);
export default connect(mapStateToProps, {
  updateJob,
  updateStep,
})(ClientPostJobStepOneForm);
