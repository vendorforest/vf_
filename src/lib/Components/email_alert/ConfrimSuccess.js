import React from "react";
import { Icon } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";

import { apiUrl } from "@Shared/constants";
import {Header, Footer} from "@Components/inc";

import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { withRouter } from "react-router";

class EmailConfirmRequire extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPending: true,
      errorMsg: undefined,
    };
  }

  async componentDidMount() {
    if (this.props.match.params.token) {
      await fetch(`${apiUrl.EMAILCONFIRM}/${this.props.match.params.token}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((result) => {
          process.env.NODE_ENV === "development" && console.log(result);
          this.setState({ isPending: false });
          if (result.status >= 400) {
            this.setState({
              errorMsg: result.message,
            });
          }
          if (result.status === 401) {
            let that = this;
            setTimeout(() => {
              that.props.history.push("/register");
            }, 3000);
          }
          if (result.status === 402) {
            let that = this;
            setTimeout(() => {
              that.props.history.push("/login");
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
    return (
      <div className="emailconfirmrequire-section">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="shadow alert-content">
                  <div className="icon mb-3 text-center text-color">
                    {this.state.isPending ? (
                      <Icon type="sync" spin />
                    ) : this.state.errorMsg ? (
                      <span className="text-danger">
                        <Icon type="close-circle" />
                      </span>
                    ) : (
                      <Icon type="check-circle" />
                    )}
                  </div>
                  {!this.state.isPending && (
                    <div className="text-center text-grey">
                      {!this.state.errorMsg ? (
                        <span>
                          Your Email has beenConfirmed, please proceed to login
                          <a className="ml-4 inline-block text-color pointer" href="/login">
                            login
                          </a>
                        </span>
                      ) : (
                        <span className="text-danger">{this.state.errorMsg}</span>
                      )}
                    </div>
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

export default withStyles(globalStyle, localStyle)(withRouter(EmailConfirmRequire));
