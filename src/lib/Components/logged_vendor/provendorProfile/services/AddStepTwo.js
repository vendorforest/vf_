import React from "react";
import moment from "moment";
import { TimePicker, Checkbox, Select, Form } from "antd";
const format = "HH:mm";

const timezones = ["timezone1", "timezone2", "timezone3", "timezone4", "timezone5"];

class AddStepTwo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timezone: 0,
    };

    this.onChange = this.onChange();
  }

  onChange(checked) {}

  render() {
    const generateTimeZoneOptions = () => {
      return timezones.map((timezone, index) => {
        return (
          <Select.Option value={index} key={index}>
            {timezone}
          </Select.Option>
        );
      });
    };

    return (
      <div className="addservice-steptwo">
        <div className="row">
          <div className="col-md-12 col-sm-6 col-12 mb-4">
            <div className="row">
              <div className="col-md-4 d-flex align-items-center justify-content-start">
                <Checkbox onChange={this.onChange}>Monday</Checkbox>
              </div>
              <div className="col-md-4">
                <small className="time-label">From:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
              <div className="col-md-4">
                <small className="time-label">To:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
            </div>
          </div>
          <div className="col-md-12 col-sm-6 col-12 mb-4">
            <div className="row">
              <div className="col-md-4 d-flex align-items-center justify-content-start">
                <Checkbox onChange={this.onChange}>Tuesday</Checkbox>
              </div>
              <div className="col-md-4">
                <small className="time-label">From:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
              <div className="col-md-4">
                <small className="time-label">To:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
            </div>
          </div>
          <div className="col-md-12 col-sm-6 col-12 mb-4">
            <div className="row">
              <div className="col-md-4 d-flex align-items-center justify-content-start">
                <Checkbox onChange={this.onChange}>Wednsday</Checkbox>
              </div>
              <div className="col-md-4">
                <small className="time-label">From:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
              <div className="col-md-4">
                <small className="time-label">To:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
            </div>
          </div>
          <div className="col-md-12 col-sm-6 col-12 mb-4">
            <div className="row">
              <div className="col-md-4 d-flex align-items-center justify-content-start">
                <Checkbox onChange={this.onChange}>Thursday</Checkbox>
              </div>
              <div className="col-md-4">
                <small className="time-label">From:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
              <div className="col-md-4">
                <small className="time-label">To:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
            </div>
          </div>
          <div className="col-md-12 col-sm-6 col-12 mb-4">
            <div className="row">
              <div className="col-md-4 d-flex align-items-center justify-content-start">
                <Checkbox onChange={this.onChange}>Friday</Checkbox>
              </div>
              <div className="col-md-4">
                <small className="time-label">From:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
              <div className="col-md-4">
                <small className="time-label">To:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
            </div>
          </div>
          <div className="col-md-12 col-sm-6 col-12 mb-4">
            <div className="row">
              <div className="col-md-4 d-flex align-items-center justify-content-start">
                <Checkbox onChange={this.onChange}>Saturday</Checkbox>
              </div>
              <div className="col-md-4">
                <small className="time-label">From:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
              <div className="col-md-4">
                <small className="time-label">To:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
            </div>
          </div>
          <div className="col-md-12 col-sm-6 col-12 mb-4">
            <div className="row">
              <div className="col-md-4 d-flex align-items-center justify-content-start">
                <Checkbox onChange={this.onChange}>Sunday</Checkbox>
              </div>
              <div className="col-md-4">
                <small className="time-label">From:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
              <div className="col-md-4">
                <small className="time-label">To:</small>
                <TimePicker defaultValue={moment("12:08", format)} format={format} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <Form.Item label="TimeZone" required>
              <Select
                value={this.state.timezone}
                onChange={(value) => {
                  this.setState({
                    timezone: value,
                  });
                }}
              >
                {generateTimeZoneOptions()}
              </Select>
            </Form.Item>
          </div>
        </div>
      </div>
    );
  }
}

export default AddStepTwo;
