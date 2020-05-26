import React from "react";
import { Card } from "antd";

class VendorStatus extends React.Component {
  render() {
    return (
      <div className="vendor-personinfo">
        <Card
          title="Account"
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)", marginBottom: "50px" }}
        >
          <div className="person-info">
            <div className="photo mr-3">
              <img alt="photo" src="https://via.placeholder.com/150" />
            </div>
            <div className="content">
              <h5 className="mb-2">
                Jeremy Rose{" "}
                <span>
                  <img src="https://img.icons8.com/ios-glyphs/20/999999/marker.png" />{" "}
                  Brooklyne, New York, USA
                </span>
              </h5>
              <h6 className="mb-3">Photographer</h6>
              <div className="h6 score">
                5.0
                <img src="https://img.icons8.com/ios-glyphs/25/07b107/star.png" />
                <img src="https://img.icons8.com/ios-glyphs/25/07b107/star.png" />
                <img src="https://img.icons8.com/ios-glyphs/25/07b107/star.png" />
                <img src="https://img.icons8.com/ios-glyphs/25/07b107/star.png" />
                <img src="https://img.icons8.com/ios-glyphs/25/07b107/star.png" />
              </div>
            </div>
          </div>
        </Card>
        <Card title="Experiences" style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)" }}>
          <div className="exp-info pl-md-3 pl-sm-0">
            <p className="mb-2">
              Hourly Rate:&nbsp;<span className="button-primary">$20</span>
            </p>
            <p className="mb-2">
              Fixed Rate:&nbsp;<span className="button-primary">$500</span>
            </p>
            <p className="mb-2">
              Hired Rate:&nbsp;<span className="button-primary">$100</span>
            </p>
            <p className="mb-2">
              Jobs Hired:&nbsp;<span className="button-primary">14</span>
            </p>
          </div>
        </Card>
      </div>
    );
  }
}

export default VendorStatus;
