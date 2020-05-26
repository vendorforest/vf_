import React from "react";
import { connect } from "react-redux";
import { Select, Icon, message } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import VendorPortfolios from "./portfolios";
import VendorAbout from "./about/index";
import VendorTeams from "./teams";
import VendorServices from "./services";

import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";

import { clientFetchVendorProfileByUsername } from "./essential";
const { Option } = Select;

class VendorProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMenu: 0,
    };
    this.selectMenu = this.selectMenu.bind(this);
  }

  componentDidMount() {
    const { username } = this.props.match.params;
    this.props.clientFetchVendorProfileByUsername({ username: username });
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.success && props.success) {
      message.success(props.success);
    }
    if (state.error && props.error) {
      message.error(props.error);
    }
    return {
      pending: props.pending,
      success: props.success,
      error: props.error,
      user: props.user,
    };
  }

  selectMenu(index) {
    this.setState({
      selectedMenu: index,
    });
  }

  render() {
    const selectedUser = this.props.selectedVendor;
    let user = selectedUser ? selectedUser.user : undefined;
    let portfolios = selectedUser ? selectedUser.portfolios : undefined;
    let teams = selectedUser ? selectedUser.teams : undefined;
    const contents = [
      <div className="w-100">
        <VendorAbout selectedVendor={user} />
      </div>,
      <div className="w-100">
        {portfolios && <VendorPortfolios selectedVendor={selectedUser} />}
      </div>,
      <div className="w-100">{teams && <VendorTeams selectedVendor={selectedUser} />}</div>,
      <div className="w-100">
        <VendorServices selectedVendor={selectedUser} />
      </div>,
    ];
    return (
      <div className="App">
        <Header />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="vendorprofile">
                {!selectedUser && this.props.pending && (
                  <div className="text-center loading">
                    <Icon type="sync" spin />
                  </div>
                )}
                {selectedUser && (
                  <div className="d-xl-flex d-block wrap">
                    <div className="side-section">
                      <div className="content">
                        <ul>
                          <li
                            onClick={() => {
                              this.selectMenu(0);
                            }}
                            className={this.state.selectedMenu === 0 ? "active" : ""}
                          >
                            About
                          </li>
                          <li
                            onClick={() => {
                              this.selectMenu(1);
                            }}
                            className={this.state.selectedMenu === 1 ? "active" : ""}
                          >
                            Portfolio
                          </li>
                          <li
                            onClick={() => {
                              this.selectMenu(2);
                            }}
                            className={this.state.selectedMenu === 2 ? "active" : ""}
                          >
                            Teams
                          </li>
                          <li
                            onClick={() => {
                              this.selectMenu(3);
                            }}
                            className={this.state.selectedMenu === 3 ? "active" : ""}
                          >
                            Services
                          </li>
                        </ul>
                        <div className="w-100 select-menu">
                          <Select
                            value={String(this.state.selectedMenu)}
                            style={{ width: "100%" }}
                            size={"large"}
                            onChange={(value) => {
                              this.selectMenu(Number(value));
                            }}
                          >
                            <Option value="0">About</Option>
                            <Option value="1">Portfolio</Option>
                            <Option value="2">Teams</Option>
                            <Option value="3">Services</Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="detail-section">
                      <div className="row">
                        <div className="col-12">{contents[this.state.selectedMenu]}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ vendorProfileReducer }) => {
  const { error, success, user, pending, selectedVendor } = vendorProfileReducer;
  return {
    error,
    success,
    user,
    pending,
    selectedVendor,
  };
};

export const VendorPublicProfile = connect(mapStateToProps, {
  clientFetchVendorProfileByUsername,
})(withStyles(globalStyle, localStyle)(VendorProfile));
