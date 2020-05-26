import React, { Component } from "react";
import demoImage from "@Components/images/icons/Beauty.png";
import portfolios from "@Components/images/NewIcons/browse-portfolios.svg";
import bids from "@Components/images/NewIcons/view-bids.svg";
import liveChat from "@Components/images/NewIcons/live-chat.svg";
import pay from "@Components/images/NewIcons/pay.svg";

const services = ["home", "events", "wedding", "wellness"];

class WhatIsGreat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="what-is-great">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="mb-5">What's great about vendorforest?</h1>
              <div className="tab-head">
                <div className="row">
                  <div className="col-md-5 col-sm-12">
                    <div className="row">
                      <div className="col-md-3 col-sm-3 d-flex">
                        <img src={portfolios} alt="" className="icon center" />
                      </div>
                      <div className="col-md-9 col-sm-9 d-flex align-items-center title text-center">
                        Browse portfolios
                      </div>
                    </div>
                    <div className="row content">
                      Find professionals you can trust by browsing their samples of previous
                      work and reading their profile reviews.
                    </div>
                  </div>
                  <div className="col-md-2"></div>
                  <div className="col-md-5 col-sm-12">
                    <div className="row">
                      <div className="col-md-3 col-sm-3 d-flex">
                        <img src={bids} alt="" className="icon center" />
                      </div>
                      <div className="col-md-9 col-sm-9 d-flex align-items-center title">
                        View Bids
                      </div>
                    </div>
                    <div className="row content">
                      Receive free bids from our talented vendors within seconds.
                    </div>
                  </div>
                </div>
                <div className="margin-bottom-20"></div>
                <div className="row">
                  <div className="col-md-5 col-sm-12">
                    <div className="row">
                      <div className="col-md-3 col-sm-3 d-flex">
                        <img src={liveChat} alt="" className="icon center" />
                      </div>
                      <div className="col-md-9 col-sm-9 d-flex align-items-center title">
                        Live Chat
                      </div>
                    </div>
                    <div className="row content">
                      You can live chat with your vendors to ask them any question you have and
                      ask for their artistic advice.
                    </div>
                  </div>
                  <div className="col-md-2"></div>
                  <div className="col-md-5 col-sm-12">
                    <div className="row">
                      <div className="col-md-3 col-sm-3 col-xs-2 d-flex">
                        <img src={pay} alt="" className="icon center" />
                      </div>
                      <div className="col-md-9 col-sm-9 col-xs-10 d-flex align-items-center title">
                        Pay for quality
                      </div>
                    </div>
                    <div className="row content">
                      Pay for work when it has been completed and you're 100% satisfied.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WhatIsGreat;
