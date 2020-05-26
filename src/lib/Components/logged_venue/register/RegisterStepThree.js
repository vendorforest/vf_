import React from "react";
import { Icon, Upload, Checkbox, TimePicker, Form, Select, message } from "antd";
import moment from "moment";
const format = "HH:mm";

const timezones = ["timezone1", "timezone2", "timezone3", "timezone4", "timezone5"];

class RegisterVenueStepThree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      venueImageUrls: [],
      timezone: 0,
    };
    this.beforeUpload = this.beforeUpload.bind(this);
    this.changePhoto = this.changePhoto.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(checked) {}

  componentDidMount() {}

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload(file) {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJPG) {
      message.error("You can only upload JPG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJPG && isLt2M;
  }

  changePhoto(info, index) {
    if (info.file.status === "uploading" && index >= this.state.venueImageUrls.length) {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (url) => {
        const urls = [...this.state.venueImageUrls];
        if (urls.length > index) {
          urls[index] = url;
        } else {
          urls.push(url);
        }
        this.setState({
          venueImageUrls: urls,
          loading: false,
        });
      });
    }
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "upload"} className="h4" />
        <div className="ant-upload-text">Business Logo or Your photo</div>
      </div>
    );

    const generateTimeZoneOptions = () => {
      return timezones.map((timezone, index) => {
        return (
          <Select.Option value={index} key={index}>
            {timezone}
          </Select.Option>
        );
      });
    };

    const displayPhoto = () => {
      return this.state.venueImageUrls.map((url, index) => {
        return (
          <div className="col-md-2" key={index}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={this.beforeUpload}
              onChange={(info) => {
                this.changePhoto(info, index);
              }}
            >
              {url ? <img src={url} alt="avatar" /> : uploadButton}
            </Upload>
          </div>
        );
      });
    };

    return (
      <div className="register-venue-stepthree">
        <div className="row">
          <div className="col-md-12 mb-5">
            <p className="mb-3">Upload at least 5 clear image of the venue</p>
            <div className="row">
              {displayPhoto()}
              {this.state.venueImageUrls.length < 5 && (
                <div className="col-md-2">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={this.beforeUpload}
                    onChange={(info) => {
                      this.changePhoto(info, this.state.venueImageUrls.length);
                    }}
                  >
                    {uploadButton}
                  </Upload>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-8">
            <h6 className=" text-grey mb-3">Venue Open Hours</h6>
            <div className="row">
              <div className="col-md-12 col-sm-6 col-12 mb-2">
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
              <div className="col-md-12 col-sm-6 col-12 mb-2">
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
              <div className="col-md-12 col-sm-6 col-12 mb-2">
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
              <div className="col-md-12 col-sm-6 col-12 mb-2">
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
              <div className="col-md-12 col-sm-6 col-12 mb-2">
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
              <div className="col-md-12 col-sm-6 col-12 mb-2">
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
              <div className="col-md-12 col-sm-6 col-12 mb-5">
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
        </div>
      </div>
    );
  }
}

export default RegisterVenueStepThree;
