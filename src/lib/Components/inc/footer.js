import React from "react";
import rainbow from "@Components/images/header/pettran.jpg";
import logo from "@Components/images/logo.svg";
import footerlogo from "@Components/images/footerlogo.png";
import facebook from "@Components/images/social-media-icon/facebook.svg";
import instagram from "@Components/images/social-media-icon/instagram.svg";
import twitter from "@Components/images/social-media-icon/twitter.svg";

class VendorForestFooter extends React.Component {
  render() {
    return (
      <div className="footer" style={{background: '#222', paddingTop: 30}}>
      <div className="mb_m20">
        <div className="footer mb_m20">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                    SITE LINKS
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#fff",
                      marginBottom: 7,
                      marginTop: 10
                    }}
                  >
                    <a
                      href="/about"
                      style={{ color: "#fff", textDecoration: "none" }}
                    >
                      About Us
                    </a>
                  </div>
                  <div style={{ fontSize: 13, color: "#fff", marginBottom: 7 }}>
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Feedback
                    </a>
                  </div>
                  <div style={{ fontSize: 13, color: "#fff", marginBottom: 7 }}>
                    <a
                      href="/privacy"
                      style={{ color: "#fff", textDecoration: "none" }}
                    >
                      Term &amp; Privacy
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                    QUICK LINKS
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#fff",
                      marginBottom: 7,
                      marginTop: 10
                    }}
                  >
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Home
                    </a>
                  </div>
                  <div style={{ fontSize: 13, color: "#fff", marginBottom: 7 }}>
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Events
                    </a>
                  </div>
                  <div style={{ fontSize: 13, color: "#fff", marginBottom: 7 }}>
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Weddings
                    </a>
                  </div>
                  <div style={{ fontSize: 13, color: "#fff", marginBottom: 7 }}>
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Wellness
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                    CONTACT US
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#fff",
                      marginBottom: 7,
                      marginTop: 10
                    }}
                  >
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      contact@vendorforest.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                paddingLeft: 0,
                paddingTop: 20,
                marginTop: 20,
                borderTop: "1px solid #333",
                paddingBottom: 30
              }}
            >
              <div className="float-left">
                <span className="float-left">
                  <img
                    src={footerlogo}
                    alt="vendorforest.com"
                    height={30}
                    style={{ color: "#fff", marginTop: "-17px", marginRight: 19 }}
                  />
                </span>
                <span className="float-left"> © vendorforest.com 2020 </span>
              </div>
              <div className="float-right">
                <span style={{ display: "inline-block", marginRight: 10 }}>
                  <a
                    href="https://business.facebook.com/vendorforest-105440397674325/?business_id=560440534809340&ref=bookmarks"
                    target="_blank"
                  >
                    <img
                      src={facebook}
                      height="17"
                      alt="facebook"
                    />
                  </a>
                </span>
                <span
                  style={{ display: "inline-block", marginRight: 6, marginLeft: 6 }}
                >
                  <a href="https://twitter.com/vendorforest" target="_blank">
                    <img
                      src={twitter}
                      height="19"
                      alt="twitter"
                    />
                  </a>
                </span>
                <span>
                  <a href="https://www.instagram.com/vendorforest" target="_blank">
                    <img
                      src={instagram}
                      height="17"
                      alt="instagram"
                    />
                  </a>
                </span>
              </div>
              <div className="clearfix" />
            </div>
            <div className="clearfix" />
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default VendorForestFooter;
