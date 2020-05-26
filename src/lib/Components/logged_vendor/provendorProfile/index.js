import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/withStyles";
import {Header, Footer} from "@Components/inc";
import VendorStatus from "./Status";
import VendorPortfolios from "./portfolios";
import VendorAbout from "./about";
import VendorTeams from "./teams";
import VendorEmployees from "./employees";
import VendorServices from "./services";
import VendorPayment from "./Payment";
import { fetchGetUserData } from "./essential";

import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { Select, Icon } from "antd";
const { Option } = Select;

const contents = [
  <div className="w-100">
    <VendorAbout />
  </div>,
  <div className="w-100">
    <VendorPortfolios />
  </div>,
  <div className="w-100">
    <VendorTeams />
  </div>,
  <div className="w-100">
    <VendorEmployees />
  </div>,
  <div className="w-100">
    <VendorServices />
  </div>,
  <div className="w-100">
    <VendorPayment />
  </div>,
  <div className="w-100">
    <VendorStatus />
  </div>,
];

class VendorProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMenu: 0,
    };
    this.selectMenu = this.selectMenu.bind(this);
  }

  componentDidMount() {
    this.props.fetchGetUserData();
  }

  selectMenu(index) {
    this.setState({
      selectedMenu: index,
    });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="vendorprofile">
                {!this.props.user && this.props.pending && (
                  <div className="text-center loading">
                    <Icon type="sync" spin />
                  </div>
                )}
                {this.props.user && (
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
                            Employees
                          </li>
                          <li
                            onClick={() => {
                              this.selectMenu(4);
                            }}
                            className={this.state.selectedMenu === 4 ? "active" : ""}
                          >
                            Services
                          </li>
                          <li
                            onClick={() => {
                              this.selectMenu(5);
                            }}
                            className={this.state.selectedMenu === 5 ? "active" : ""}
                          >
                            Payment
                          </li>
                          <li
                            onClick={() => {
                              this.selectMenu(6);
                            }}
                            className={this.state.selectedMenu === 6 ? "active" : ""}
                          >
                            Status
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
                            <Option value="3">Employees</Option>
                            <Option value="4">Services</Option>
                            <Option value="5">Payment</Option>
                            <Option value="6">Status</Option>
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

// export default withStyles(globalStyle, localStyle)(VendorProfile);

const mapStateToProps = ({ vendorProfileReducer }) => {
  const { error, user, pending } = vendorProfileReducer;

  return { error, user, pending };
};

export default connect(mapStateToProps, {
  fetchGetUserData,
})(withStyles(globalStyle, localStyle)(VendorProfile));
