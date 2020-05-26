import React from "react";
import Button from "antd/lib/button";
import withStyles from "isomorphic-style-loader/withStyles";
import { connect } from "react-redux";

import { Header, Footer } from "@Components/inc";

import styles from "./index.scss";

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Header />
        <div className="container content-container">
          <div className="row title">
            <div className="col-sm-12">
              <h2 className="title-font">About Us</h2>
            </div>
            <div className="col-sm-12">
              <h6 className="subtitle-font">We don't give you what we think you want, but we give you what we know you need</h6>
              <p className="title-explain">Your satisfaction is our reward</p>
            </div>
          </div>
          <hr />
          <div className="row content">
            <h3 className="content_title">This is our story</h3>
            <p className="content_letter">
              VendoForest story begins over few years ago, I wanted to create a platform that
              allowed people to find everything that they needed for their events and more in
              one place.{" "}
            </p>
          </div>
          <div className="row content">
            <h3 className="content_title">A better and fair way of working is now here</h3>
            <p className="content_letter">
              I decided to redesign the wheel, I wanted to create a platform of transparacy,
              where vendors and clients can freerly interact without having to worry about fees.
              VendorForest is the only platform that makes it easier for vendors and clients to
              interact free of charge.
            </p>
          </div>
          <div className="row content">
            <h3 className="content_title">We are creating a place of opportunities</h3>
            <p className="content_letter">
              Through VendoForest clients get more done, connecting with both vendors and pro
              vendors to work on events from Home improvement, Weddings, Events, and Wellness.
              VendorForest makes it fast, simple, and cost-effective to find, hire, work with,
              and pay the best vendors and pro vendors.
            </p>
          </div>
          <div className="row content">
            <h3 className="content_title">VendorForest's vision</h3>
            <p className="content_letter">
              We want to create a platform of transparency between our clients and our vendors
              to work freerly and fairly.
            </p>
          </div>
          <div className="row content">
            <h3 className="content_title">VendorForest's mission</h3>
            <p className="content_letter">
              We want vendors to use our platform without having the fear of spending money
              without being hired, and clients to use our platform because we have vendors who
              do what they love to do.
            </p>
          </div>
          <div className="row content">
            <div className="col-sm-12 padding-0">
              <h3 className="content_title">More about our company</h3>
            </div>
            <div className="col-sm-12 padding-0">
              <p className="content_letter">
                <a href="/howitworks">
                  <Button size={"large"}>How it works</Button>
                </a>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ homeReducer, loginReducer }) => {
  const { error, homedata, success, pending } = homeReducer;

  const { user } = loginReducer;

  return { error, homedata, success, pending, user };
};

export default connect(mapStateToProps, {})(withStyles(styles)(About));
