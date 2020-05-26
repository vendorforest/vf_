import React from "react";
import {
  Input,
  Tabs,
  Button,
  Icon,
  Drawer,
  List,
  Avatar,
  Affix,
  Alert,
  Steps,
  message,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Cascader,
  InputNumber,
} from "antd";
import withStyles from "isomorphic-style-loader/withStyles";

import {Header, Footer} from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";

const { Option } = Select;
const { TextArea } = Input;

const Step = Steps.Step;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}
function onChange(value) {
  process.env.NODE_ENV === "development" && console.log("changed", value);
}

class RegisterEmployee extends React.Component {
  Categories = {
    home: ["home1", "home2"],
    events: ["events1", "events2"],
    wellness: ["Wellness1", "Wellness2"],
    weddings: ["weddings1", "weddings2"],
  };

  state = {
    firstName: "",
    lastName: "",
    category: this.Categories.home,
    current: 0,
  };

  handleServiceChange = (value) => {
    //if home then select
    const selectedCategory = this.getCategories(value);
    process.env.NODE_ENV === "development" && console.log("change ", value);
    this.setState({
      category: selectedCategory,
    });
  };

  getCategories = (value) => {
    switch (value) {
      case "events":
        return this.Categories.events;
      case "weddings":
        return this.Categories.weddings;
      case "wellness":
        return this.Categories.wellness;
      default:
        return this.Categories.home;
    }
  };
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        process.env.NODE_ENV === "development" &&
          console.log("Received values of form: ", values);
      }
    });
  };

  handleCategoryChange = (value) => {
    //step
    this.setState({});
  };

  onSecondCityChange = (value) => {
    this.setState({
      secondCity: value,
    });
  };

  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = [".com", ".org", ".net", ".co"].map((domain) => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
      isSelectOptGroup,
    } = this.props.form;

    const category = this.state.category.length !== 0 ? this.state.category : [];

    // Only show error after a field is touched.
    const firstNameError = isFieldTouched("firstName") && getFieldError("firstName");
    const lastNameError = isFieldTouched("lastName") && getFieldError("lastName");
    const serviceError = isFieldTouched("service") && getFieldError("service");
    const categoryError = isFieldTouched("category") && getFieldError("category");
    const subcategoryError = isFieldTouched("subcategory") && getFieldError("subcategory");
    const motoError = isFieldTouched("moto") && getFieldError("moto");

    const businesslocationError =
      isFieldTouched("businesslocation") && getFieldError("businesslocation");
    const fixrateError = isFieldTouched("fixrate") && getFieldError("fixrate");
    const websiteError = isFieldTouched("website") && getFieldError("website");

    const { current } = this.state;

    const steps = [
      {
        title: "About the Employee",
        content: (
          <div className="step-1">
            <Form layout="vertical" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Item
                    label="First Name"
                    validateStatus={firstNameError ? "error" : ""}
                    help={firstNameError || ""}
                  >
                    {getFieldDecorator("firstName", {
                      initialValue: this.state.firstName, //solution
                      rules: [{ required: true, message: "Please input first name!" }],
                    })(
                      <Input
                        placeholder="First Name"
                        name="firstName"
                        onChange={(value) => {
                          this.setState({
                            firstName: value.target.value,
                          });
                        }}
                      />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label="Last Name"
                    validateStatus={lastNameError ? "error" : ""}
                    help={lastNameError || ""}
                  >
                    {getFieldDecorator("lastName", {
                      initialValue: this.state.lastName, //solution
                      rules: [{ required: true, message: "Please input first name!" }],
                    })(
                      <Input
                        placeholder="Last Name"
                        name="lastName"
                        onChange={(value) => {
                          this.setState({
                            lastName: value.target.value,
                          });
                        }}
                      />,
                    )}
                  </Form.Item>
                </div>
              </div>
              <Form.Item
                label="Service"
                validateStatus={serviceError ? "error" : ""}
                help={serviceError || ""}
              >
                {getFieldDecorator("service", {
                  rules: [{ required: true, message: "Please select your gender!" }],
                })(
                  <Select placeholder="Select a service" onChange={this.handleServiceChange}>
                    <Option value="home">Home</Option>
                    <Option value="events">Events</Option>
                    <Option value="weddings">Weddings</Option>
                    <Option value="wellnes">Wellness</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item
                label="Category"
                validateStatus={categoryError ? "error" : ""}
                help={categoryError || ""}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 12px)",
                  margin: "0 19px 0 0",
                }}
              >
                {getFieldDecorator("category", {
                  rules: [{ required: true, message: "Please select your gender!" }],
                })(
                  <Select
                    placeholder={category[0]}
                    defaultValue={category[0]}
                    onChange={this.handleCategoryChange}
                  >
                    {category.map((item, k) => (
                      <Option key={k} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item
                label="Sub-Category"
                validateStatus={subcategoryError ? "error" : ""}
                help={subcategoryError || ""}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 12px)",
                  margin: "0 0 0 5px",
                }}
              >
                {getFieldDecorator("category", {
                  rules: [{ required: true, message: "Please select your gender!" }],
                })(
                  <Select value={""} onChange={this.onSecondCityChange}>
                    {/*this.state.cities.map(city => (
                                <Option key={city}>{city}</Option>
                                ))*/}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item
                label="Moto"
                validateStatus={motoError ? "error" : ""}
                help={motoError || ""}
              >
                {getFieldDecorator("moto", {
                  rules: [{ required: true, message: "Please select your gender!" }],
                })(
                  <TextArea
                    rows={4}
                    name="moto"
                    value="Value"
                    onChange={(value) => {
                      this.setState({
                        moto: value.target.value,
                      });
                    }}
                  />,
                )}
              </Form.Item>
              {/*<Form.Item>
                            <Button
                            type="primary"
                            htmlType="submit"
                            disabled={hasErrors(getFieldsError())}
                            >
                            Log in
                            </Button>
                        </Form.Item>*/}
            </Form>
          </div>
        ),
      },
      {
        title: "Business Schedule",
        content: (
          <div className="step2">
            <Form layout="vertical" onSubmit={this.handleSubmit}>
              <Form.Item
                label="Business Location"
                validateStatus={businesslocationError ? "error" : ""}
                help={businesslocationError || ""}
              >
                {getFieldDecorator("businesslocation", {
                  initialValue: this.state.companyName, //solution
                  rules: [{ required: true, message: "Please input your company name!" }],
                })(
                  <Input
                    placeholder="Business Location"
                    value="TEST"
                    name="businessLocation"
                    onChange={(value) => {
                      this.setState({
                        businessLocation: value.target.value,
                      });
                    }}
                  />,
                )}
              </Form.Item>
              <Form.Item
                label="Fix Rate"
                validateStatus={fixrateError ? "error" : ""}
                help={fixrateError || ""}
              >
                {getFieldDecorator("fixrate", {
                  initialValue: this.state.companyName, //solution
                  rules: [{ required: true, message: "Please input your company name!" }],
                })(
                  <InputNumber
                    defaultValue={0.0}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    style={{
                      height: "42px",
                      borderRadius: "1px",
                      lineHeight: "2em",
                      width: "50%",
                    }}
                    onChange={onChange}
                  />,
                )}
              </Form.Item>
              <Form.Item
                label="Website"
                validateStatus={websiteError ? "error" : ""}
                help={websiteError || ""}
              >
                {getFieldDecorator("website", {
                  rules: [{ required: true, message: "Please input website!" }],
                })(
                  <Input
                    placeholder="https://"
                    value="TEST"
                    name="wesite"
                    onChange={(value) => {
                      this.setState({
                        website: value.target.value,
                      });
                    }}
                  />,
                )}
              </Form.Item>
            </Form>
          </div>
        ),
      },
      {
        title: "Payments",
        content: "Last-content",
      },
    ];

    return (
      <div className="App">
        <Header />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="employee-register">
                <Steps size="default" current={current}>
                  {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                  ))}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action">
                  {current < steps.length - 1 && (
                    <Button
                      type="primary"
                      onClick={() => this.next()}
                      disabled={hasErrors(getFieldsError())}
                    >
                      Next
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <Button
                      type="primary"
                      disabled={hasErrors(getFieldsError())}
                      onClick={() => message.success("Your job has been posted!")}
                    >
                      Done
                    </Button>
                  )}
                  {current > 0 && (
                    <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                      Previous
                    </Button>
                  )}
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

const WrappedHorizontalLoginForm = Form.create({ name: "vendor_registration" })(
  RegisterEmployee,
);

export default withStyles(globalStyle, localStyle)(WrappedHorizontalLoginForm);
