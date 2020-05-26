import React from "react";
import { Icon } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";

import { apiUrl } from "@Shared/constants";
import {Header, Footer} from "@Components/inc";

import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class EmailConfirmRequire extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPending: false,
      errorMsg: "",
    };
    this.resendEmail = this.resendEmail.bind(this);
  }

  async resendEmail() {
    if (this.props.match.params.id && !this.state.isPending) {
      this.setState({
        isPending: true,
        errorMsg: undefined,
      });
      return await fetch(`${apiUrl.EMAILSENT}/${this.props.match.params.id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((result) => {
          this.setState({ isPending: false });
          if (result.status >= 400) {
            this.setState({
              errorMsg: result.message,
            });
          }
          if (result.status === 401) {
            setTimeout(() => {
              return <Redirect to={"/register"} />;
            }, 3000);
          }
          if (result.status === 402) {
            setTimeout(() => {
              return <Redirect to={"/login"} />;
            }, 3000);
          }
        })
        .catch((err) => {
          this.setState({
            errorMsg: err.message,
          });
        });
    }
  }

  render() {
    const { user } = this.props;
    const msg = user ? user.msg : undefined;
    return (
      <div className="emailconfirmrequire-section">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="shadow alert-content">
                  <div className="icon mb-3 text-center text-color">
                    <Icon type="exclamation-circle" />
                  </div>
                  <div className="text-center text-grey">
                  {msg} {/*  with instructions for resetting your account password. If you don’t
                    see an email, be sure to check your spam folder. */}
                    {/* <span
                      className={`ml-4 inline-block text-color pointer d-inline-block ${
                        this.state.isPending ? "text-grey" : ""
                      }`}
                      onClick={this.resendEmail}
                    >
                      Resend email
                    </span> */}
                  </div>
                  <div className="mt-2 text-center text-danger">
                    {this.state.errorMsg ? <span>{this.state.errorMsg}</span> : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* !email && <Redirect to={"/404"} /> */}
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.registerReducer;
  return { user };
};

export default connect(
  mapStateToProps,
  {},
)(withStyles(globalStyle, localStyle)(EmailConfirmRequire));
