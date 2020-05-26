// @ts-nocheck
import React from "react";
import { compose, withProps, withHandlers, lifecycle, withState } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Circle } from "react-google-maps";

// const CircleMap = compose(
//     withProps({
//         googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places,geometry,drawing&key=AIzaSyB7XtSfuHtmsmPBIYW4WzGS_QrwJ7DrX54",
//         loadingElement: <div style={{ height: `100%` }} />,
//         containerElement:<div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             justifyContent: 'flex-end',
//             alignItems: 'center'
//         }} />,
//         mapElement:<div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//         }} />
//     }),
//     withScriptjs,
//     withGoogleMap,
//     withHandlers((props) => {
//         const refs = {
//             map: undefined,
//         }
//         return {
//             onMapMounted: () => ref => {
//                 refs.map = ref
//             },
//             drawCircle: (props) => () => {
//                 process.env.NODE_ENV === "development" && console.log(props.radius)
//                 return <div>
//                     <Marker
//                         map={refs.map}
//                         position={{lat: 37.688865, lng: -122.464807}}>
//                     </Marker>
//                     <Circle center={{lat: 37.688865, lng: -122.464807}}
//                         radius={props.radius}/>
//                 </div>
//             },
//         }
//     }),
//     lifecycle({}),
// )((props) => {
//     const OPTIONS = {
//         minZoom: 6,
//         maxZoom: 20,
//     }
//     return (
//         <GoogleMap
//             ref={props.onMapMounted}
//             defaultZoom={14}
//             options = {OPTIONS}>
//             {
//                 props.drawCircle()
//             }
//         </GoogleMap>
//     )
// })

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
        containerElement={<div style={{ height: `300px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}
export default GeoRangeMap;
