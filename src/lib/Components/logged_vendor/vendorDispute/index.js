import React from "react";

import withStyles from "isomorphic-style-loader/withStyles";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { Icon, Select, Rate, Radio, Input } from "antd";
import {Header, Footer} from "@Components/inc";
const { Option } = Select;
const { TextArea } = Input;

const jobs = [
  "Retrieval of CDC survey data",
  "Moving designed Semplice site to domain",
  "Instantaneous consultation with profess",
];

class VendorDispute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedJob: 0,
      subject: "",
      message: "",
    };
  }

  render() {
    const generateJobOptions = () => {
      return jobs.map((job, index) => {
        return (
          <Option value={String(index)} key={index}>
            {job}
          </Option>
        );
      });
    };

    return (
      <div className="send-invite">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="invite-details shadow">
                  <h5 className="mb-4">Dispute</h5>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <Select
                          value={String(this.state.selectedJob)}
                          onChange={(value) => {
                            this.setState({
                              selectedJob: Number(value),
                            });
                          }}
                        >
                          {generateJobOptions()}
                        </Select>
                      </div>
                      <div className="mb-3">
                        <Input
                          value={this.state.subject}
                          onChange={(e) => {
                            this.setState({
                              subject: e.target.value,
                            });
                          }}
                          placeholder="Subject"
                        />
                      </div>
                      <div className="message mb-4">
                        <TextArea
                          value={this.state.message}
                          onChange={(e) => {
                            this.setState({
                              message: e.target.value,
                            });
                          }}
                          rows={5}
                          placeholder="Message"
                        />
                      </div>
                      <button className="button-primary mr-2">Send</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(globalStyle, localStyle)(VendorDispute);
