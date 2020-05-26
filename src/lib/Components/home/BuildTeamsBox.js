import React from "react";
import { Icon, Button } from "antd";

class BuildTeamsBox extends React.Component {
  render() {
    return (
      <div
      style={{
        color: "rgb(255, 255, 255)",
        backgroundColor: "rgb(7, 177, 7)",
        paddingTop: 80,
        paddingBottom: 80
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <h1
              style={{
                fontSize: 31,
                paddingBottom: 0,
                marginBottom: 0,
                fontWeight: "bolder"
              }}
            >
              Build a team of amazing vendors to get more done
            </h1>
            <button
              type="button"
              className="ant-btn"
              style={{
                marginTop: 26,
                color: "rgb(7, 177, 7)",
                border: "1px solid rgb(255, 255, 255)",
                paddingLeft: 40,
                paddingRight: 40,
                fontWeight: 600
              }}
            >
              <span>Get Started</span>
            </button>
          </div>
        </div>
      </div>
    </div>
      // <div className="build-team-box">
      //   <div className="container">
      //     <div className="row">
      //       <div className="col-12 text-center">
      //         <h1 className="mb-5">Build a team of vendors just like you online</h1>
      //         <Button
      //           type="primary"
      //           onClick={() => {
      //             window.location.href = "/register";
      //           }}
      //         >
      //           Get Started
      //         </Button>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  }
}

export default BuildTeamsBox;
