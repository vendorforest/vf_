import React from "react";
import { Input, Form, message, Icon } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { sendEmail } from "./sendEmail";
import { connect } from "react-redux";
class ResetPass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      code: "",
      captcha:
        "H,1,y,D,F,C,6,0,I,6,1,K,a,M,O,p,Q,R,e,T,U,V,R,X,B,Z,a,T,c,t,5,r,G,8,j,9,0,P,m,T,o,L,8,r,s,T,u,V,w,x,9,z,0,1,c,L,4,0,3,P,v,l",
      captchaCode: "",
    };
    this.handleSendEmail = this.handleSendEmail.bind(this);
  }
  componentDidMount() {
    this.setState({
      captchaCode: this.state.captcha.split(",").splice(Math.floor(Math.random() * 53), 8),
    });
  }

  handleSendEmail = () => {
    const userEmail = this.state.email;
    const code = this.state.code;
    const captchaCodes = this.state.captchaCode;
    const captchaCode = captchaCodes.join("");
    if (code !== captchaCode) {
      message.warning("Please retype the captcha code");
    } else {
      this.props.sendEmail(userEmail);
    }
  };

  render() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      isSelectOptGroup,
    } = this.props.form;

    const emailError = isFieldTouched("email") && getFieldError("email");
    const codeError = isFieldTouched("code") && getFieldError("code");

    return (
      <div className="resetpass-section">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-xl-6 col-lg-8 col-md-10 col-12 offset-xl-3 offset-lg-3 offset-md-1  offset-0">
                <div className="shadow form-content">
                  {this.state.pending && <Icon type="sync" spin />}
                  <Form layout="vertical">
                    <h2 className="text-center mb-5">Reset your password</h2>
                    <Form.Item
                      label="Email"
                      validateStatus={emailError ? "error" : ""}
                      help={emailError || ""}
                    >
                      {getFieldDecorator("email", {
                        initialValue: this.state.email,
                        rules: [{ required: true, message: "Please input your email." }],
                      })(
                        <Input
                          placeholder="Email"
                          name="email"
                          onChange={(value) => {
                            this.setState({
                              email: value.target.value,
                            });
                          }}
                        />,
                      )}
                    </Form.Item>
                    <Form.Item
                      label="Validation Code"
                      validateStatus={codeError ? "error" : ""}
                      help={codeError || ""}
                    >
                      {getFieldDecorator("code", {
                        initialValue: this.state.code,
                        rules: [
                          { required: true, message: "Please enter the Code Shown Below." },
                        ],
                      })(
                        <Input
                          placeholder="Validation Code"
                          name="code"
                          onChange={(value) => {
                            this.setState({
                              code: value.target.value,
                            });
                          }}
                        />,
                      )}
                    </Form.Item>
                    <div className=" border w-100 h1 text-center font-italic bg-light">
                      {this.state.captchaCode}
                    </div>
                    <div className="d-flex justify-content-center mt-5">
                      <button className="button-primary" onClick={this.handleSendEmail}>
                        Send reset email
                      </button>
                    </div>
                  </Form>
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

const mapStateToProps = ({ loginReducer }) => {
  const { user } = loginReducer;
  return { user };
};

const mapDispatchActionToProps = (dispatch) => {
  return {
    sendEmail: (payload) => dispatch(sendEmail(payload)),
  };
};
const ResetPassForm = Form.create({ name: "forgot-pass-form" })(ResetPass);
export default connect(
  mapStateToProps,
  mapDispatchActionToProps,
)(withStyles(globalStyle, localStyle)(ResetPassForm));
