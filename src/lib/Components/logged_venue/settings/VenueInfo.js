import React from "react";
import {
  Icon,
  Upload,
  Checkbox,
  TimePicker,
  Form,
  Select,
  Card,
  Input,
  Radio,
  message,
} from "antd";
import moment from "moment";
const format = "HH:mm";

const timezones = ["timezone1", "timezone2", "timezone3", "timezone4", "timezone5"];

class VenueInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      venueImageUrls: [],
      venueName: "",
      location: "",
      maxiumCapacity: 0,
      settings: 0,
      partCheck: false,
      diningCheck: false,
      meetingCheck: false,
      presentationCheck: false,
      kitchenCheck: false,
      parkingCheck: false,
      soundCheck: false,
      videoCheck: false,
      microphoneCheck: false,
      tableCheck: false,
      tablewareCheck: false,
      lightingCheck: false,
      valetCheck: false,
      cateringCheck: false,
      barCheck: false,
      cleanCheck: false,
      petCheck: false,
      wifiCheck: false,
      timezone: 0,
    };
    this.beforeUpload = this.beforeUpload.bind(this);
    this.changePhoto = this.changePhoto.bind(this);
  }

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
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      isSelectOptGroup,
    } = this.props.form;

    const venueNameError = isFieldTouched("venueName") && getFieldError("venueName");
    const locationError = isFieldTouched("location") && getFieldError("location");

    const generateTimeZoneOptions = () => {
      return timezones.map((timezone, index) => {
        return (
          <Select.Option value={index} key={index}>
            {timezone}
          </Select.Option>
        );
      });
    };

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "upload"} className="h4" />
        <div className="ant-upload-text">Business Logo or Your photo</div>
      </div>
    );

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
      <div className="venue-info">
        <Card
          title="Venue Image"
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)", marginBottom: "50px" }}
        >
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
        </Card>
        <Card
          title="Venue"
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)", marginBottom: "50px" }}
        >
          <Form layout="vertical">
            <div className="row">
              <div className="col-md-8">
                <Form.Item
                  label="Venue Name"
                  validateStatus={venueNameError ? "error" : ""}
                  help={venueNameError || ""}
                >
                  {getFieldDecorator("venueName", {
                    initialValue: this.state.venueName,
                    rules: [{ required: true, message: "Please input venue name" }],
                  })(
                    <Input
                      placeholder="Venue Name"
                      name="venueName"
                      onChange={(value) => {
                        this.setState({
                          venueName: value.target.value,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
                <Form.Item
                  label="Venue Name"
                  validateStatus={locationError ? "error" : ""}
                  help={locationError || ""}
                >
                  {getFieldDecorator("location", {
                    initialValue: this.state.location,
                    rules: [{ required: true, message: "Please input location" }],
                  })(
                    <Input
                      placeholder="Location"
                      name="location"
                      onChange={(value) => {
                        this.setState({
                          location: value.target.value,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item label="Maximum Capacity">
                  <Radio.Group
                    onChange={(e) => {
                      this.setState({
                        maxiumCapacity: e.target.value,
                      });
                    }}
                    value={this.state.maxiumCapacity}
                  >
                    <Radio value={0} className="d-block">
                      25 or fewer guests
                    </Radio>
                    <Radio value={1} className="d-block">
                      25 - 50 guests
                    </Radio>
                    <Radio value={2} className="d-block">
                      51 - 100 guests
                    </Radio>
                    <Radio value={3} className="d-block">
                      101 - 150 guests
                    </Radio>
                    <Radio value={4} className="d-block">
                      151 - 200 guests
                    </Radio>
                    <Radio value={5} className="d-block">
                      201 - 250 guests
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item label="Settings">
                  <Radio.Group
                    onChange={(e) => {
                      this.setState({
                        settings: e.target.value,
                      });
                    }}
                    value={this.state.settings}
                  >
                    <Radio value={0} className="d-block">
                      Indoor
                    </Radio>
                    <Radio value={1} className="d-block">
                      Covered Outdoor
                    </Radio>
                    <Radio value={2} className="d-block">
                      Uncovered Outdoor
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item label="Space that the venue offers">
                  <Checkbox
                    onChange={() => {
                      this.setState({ partCheck: !this.state.partCheck });
                    }}
                    className="d-block m-0"
                  >
                    Party / reception space
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ diningCheck: !this.state.diningCheck });
                    }}
                    className="d-block m-0"
                  >
                    Dining space
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ meetingCheck: !this.state.meetingCheck });
                    }}
                    className="d-block m-0"
                  >
                    Meeting space
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ presentationCheck: this.state.presentationCheck });
                    }}
                    className="d-block m-0"
                  >
                    Presentation space
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ kitchenCheck: this.state.kitchenCheck });
                    }}
                    className="d-block m-0"
                  >
                    Kitchen
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ parkingCheck: this.state.parkingCheck });
                    }}
                    className="d-block m-0"
                  >
                    Parking
                  </Checkbox>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item label="Space that the venue offers">
                  <Checkbox
                    onChange={() => {
                      this.setState({ soundCheck: !this.state.soundCheck });
                    }}
                    className="d-block m-0"
                  >
                    Sound equipment
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ videoCheck: !this.state.videoCheck });
                    }}
                    className="d-block m-0"
                  >
                    Video equipment
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ microphoneCheck: !this.state.microphoneCheck });
                    }}
                    className="d-block m-0"
                  >
                    Microphones
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ tableCheck: this.state.tableCheck });
                    }}
                    className="d-block m-0"
                  >
                    Tables & chairs
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ tablewareCheck: this.state.tablewareCheck });
                    }}
                    className="d-block m-0"
                  >
                    Tableware
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ lightingCheck: this.state.lightingCheck });
                    }}
                    className="d-block m-0"
                  >
                    Lighting
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ valetCheck: this.state.valetCheck });
                    }}
                    className="d-block m-0"
                  >
                    Valet parking
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ cateringCheck: this.state.cateringCheck });
                    }}
                    className="d-block m-0"
                  >
                    Catering Services
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ barCheck: this.state.barCheck });
                    }}
                    className="d-block m-0"
                  >
                    Bar Services
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ cleanCheck: this.state.cleanCheck });
                    }}
                    className="d-block m-0"
                  >
                    Clean Up
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ petCheck: this.state.petCheck });
                    }}
                    className="d-block m-0"
                  >
                    Pet Friendly
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ wifiCheck: this.state.wifiCheck });
                    }}
                    className="d-block m-0"
                  >
                    Wifi
                  </Checkbox>
                </Form.Item>
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
              <div className="col-12">
                <button className="button-primary">Save</button>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    );
  }
}

const VenueInfoForm = Form.create({ name: "venue_setting_info" })(VenueInfo);

export default VenueInfoForm;
