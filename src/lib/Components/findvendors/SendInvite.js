import React from "react";
import { Select, Input, Checkbox, message } from "antd";
import { fetchMyJob } from "./essential";
const { Option } = Select;
const { TextArea } = Input;

class SendInvite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedJob: "---Select---",
      message: "",
      jobs: [],
      checkBoxStatus: false,
    };
    // this.handelCheckBox = this.handelCheckBox.bind(this);
  }

  componentDidMount() {
    fetchMyJob().then((result) => {
      if (!result) {
        message.warning("There is no posted job by you");
      } else {
        this.setState({
          jobs: result.data,
        });
      }
    });
  }

  // handelCheckBox() {
  //   this.setState({
  //     checkBoxStatus: !this.state.checkBoxStatus,
  //   });
  // }
  render() {
    const { user } = this.props;

    const generateJobOptions = () => {
      const jobs = this.state.jobs;
      return jobs.map((job, index) => {
        return (
          <Option value={String(index)} key={index}>
            {job.title}
          </Option>
        );
      });
    };

    return (
      <div className="send-invite">
        <div className="row">
          <div className="col-md-12">
            <h5 style={{ margin: "15px 0" }}>Please select job created</h5>
            <div className="mb-6">
              <Select
                value={String(this.state.selectedJob)}
                onChange={(value) => {
                  this.props.title(this.state.jobs[Number(value)]);
                  this.setState({
                    selectedJob: Number(value),
                  });
                }}
              >
                {generateJobOptions()}
              </Select>
            </div>
            <h5 style={{ margin: "25px 0px 15px" }}>More details (optional)</h5>
            <div className="message mb-6">
              <TextArea
                value={this.state.message}
                onChange={(e) => {
                  this.props.text(e.target.value);
                  this.setState({
                    message: e.target.value,
                  });
                  // console.log("In sending = ", this.state.message);
                }}
                rows={5}
                placeholder="Message"
              />
            </div>
            <div className="mb-6" style={{ margin: "25px 0px 15px" }}>
              You will be asked to deposit the chosen amount in our escrow account to complete
              this process of hiring. Please keep in mind that the vendor can choose to reject
              the offer or accept, either way vendorforest.com will take a 10% fee from the
              deposited amount, non refundable.
            </div>
            <div className="mb-6">
              <Checkbox
                onClick={() => {
                  this.props.check(!this.state.checkBoxStatus);
                  this.setState({
                    checkBoxStatus: !this.state.checkBoxStatus,
                  });
                }}
                checked={this.state.checkBoxStatus}
              >
                I agree
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SendInvite;
