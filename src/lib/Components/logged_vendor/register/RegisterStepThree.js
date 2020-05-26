import React from "react";
import { Slider } from "antd";
import GeoRangeMap from "./GeoRangeMap";

class RegisterVendorStepThree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      geoRange: 50,
    };
    this.changeRange = this.changeRange.bind(this);
    this.afterChangeRange = this.afterChangeRange.bind(this);
  }

  componentDidMount() {}

  changeRange(value) {
    this.setState({
      geoRange: value,
    });
  }

  afterChangeRange(value) {
    this.setState({
      geoRange: value,
    });
  }

  render() {
    return (
      <div className="register-vendor-steptwo">
        <div className="row">
          <div className="col-md-8 mb-3">
            <h5 className="text-grey mb-md-5 mb-3">Where do you want to work?</h5>
            <Slider
              value={this.state.geoRange}
              onChange={this.changeRange}
              onAfterChange={this.afterChangeRange}
            />
            <p className="w-100 text-center">
              Promote yourself for jobs within {this.state.geoRange} miles.
            </p>
          </div>
          <div className="col-12">
            <div
              className="map-content w-100"
              style={{ height: "300px", position: "relative" }}
            >
              <GeoRangeMap radius={this.state.geoRange} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterVendorStepThree;
