import React from "react";
import { Input, Form, Radio, Checkbox } from "antd";

const { TextArea } = Input;

class RegisterVenueStepTwo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
    };
  }

  componentDidMount() {}

  render() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      isSelectOptGroup,
    } = this.props.form;

    const venueNameError = isFieldTouched("venueName") && getFieldError("venueName");
    const locationError = isFieldTouched("location") && getFieldError("location");

    return (
      <div className="register-vendor-steptwo">
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
          </div>
        </Form>
      </div>
    );
  }
}

const RegisterVenueStepTwoForm = Form.create({ name: "venue_registration_steptwo" })(
  RegisterVenueStepTwo,
);

export default RegisterVenueStepTwoForm;
