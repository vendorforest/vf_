// @ts-nocheck
import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Circle } from "react-google-maps";

const MyMapComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap defaultZoom={7} defaultCenter={props.center}>
      <Marker position={props.center} />
      <Circle center={props.center} radius={props.radius} />
    </GoogleMap>
  )),
);

class GeoRangeMap extends React.Component {
  render() {
    return (
      <MyMapComponent
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places,geometry,drawing&key=AIzaSyB7XtSfuHtmsmPBIYW4WzGS_QrwJ7DrX54"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `300px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        center={this.props.center}
        radius={this.props.radius}
      />
    );
  }
}
export default GeoRangeMap;
