// @ts-nocheck
import React from "react";
import { compose, withProps, withHandlers, lifecycle, withState } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Circle } from "react-google-maps";

const MyMapComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
      <Marker position={{ lat: -34.397, lng: 150.644 }} />
    </GoogleMap>
  )),
);

class GeoRangeMap extends React.Component {
  render() {
    return (
      <MyMapComponent
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places,geometry,drawing&key=AIzaSyB7XtSfuHtmsmPBIYW4WzGS_QrwJ7DrX54"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}
export default GeoRangeMap;
