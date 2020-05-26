import React from "react";
import { Select } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import {Header, Footer} from "@Components/inc";
import VenueCompanyInfo from "./CompanyInfo";
import VenueInfo from "./VenueInfo";
import VenueSecurity from "./Security";
import VenueBillingMethod from "./BillingMethod";
import VenueNotification from "./Notification";

import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
const { Option } = Select;

const contents = [
  <div className="w-100">
    <VenueCompanyInfo />
  </div>,
  <div className="w-100">
    <VenueInfo />
  </div>,
  <div className="w-100">
    <VenueSecurity />
  </div>,
  <div className="w-100">
    <VenueBillingMethod />
  </div>,
  <div className="w-100">
    <VenueNotification />
  </div>,
];

class VenueSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMenu: 0,
    };
    this.selectMenu = this.selectMenu.bind(this);
  }

  selectMenu(index) {
    this.setState({
      selectedMenu: index,
    });
  }

  render() {
    return (
      <div id="venue-settings">
        <Header />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="venue-settings">
                <div className="side-section">
                  <div className="content">
                    <ul>
                      <li
                        onClick={() => {
                          this.selectMenu(0);
                        }}
                        className={this.state.selectedMenu === 0 ? "active" : ""}
                      >
                        Company Info
                      </li>
                      <li
                        onClick={() => {
                          this.selectMenu(1);
                        }}
                        className={this.state.selectedMenu === 1 ? "active" : ""}
                      >
                        Venue Info
                      </li>
                      <li
                        onClick={() => {
                          this.selectMenu(2);
                        }}
                        className={this.state.selectedMenu === 2 ? "active" : ""}
                      >
                        Password & Security
                      </li>
                      <li
                        onClick={() => {
                          this.selectMenu(3);
                        }}
                        className={this.state.selectedMenu === 3 ? "active" : ""}
                      >
                        Billing Methods
                      </li>
                      <li
                        onClick={() => {
                          this.selectMenu(4);
                        }}
                        className={this.state.selectedMenu === 4 ? "active" : ""}
                      >
                        Notiffication Settings
                      </li>
                    </ul>
                    <div className="w-100 select-menu">
                      <Select
                        value={String(this.state.selectedMenu)}
                        style={{ width: "100%" }}
                        onChange={(value) => {
                          this.selectMenu(Number(value));
                        }}
                      >
                        <Option value="0">Company Info</Option>
                        <Option value="1">Venue Info</Option>
                        <Option value="2">Password & Security</Option>
                        <Option value="3">Billing Methods</Option>
                        <Option value="4">Notiffication Settings</Option>
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
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(globalStyle, localStyle)(VenueSettings);
