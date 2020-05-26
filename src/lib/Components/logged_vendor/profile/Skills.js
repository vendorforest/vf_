import React from "react";
import { Card } from "antd";

class VendorSkills extends React.Component {
  render() {
    return (
      <div className="vendor-skills">
        <Card title={<span className="h5 font-weight-bold">Skills</span>}>
          <div className="skill-content">
            <div className="button-primary mr-2">Portray Artist</div>
            <div className="button-primary mr-2">Artist</div>
            <div className="button-primary mr-2">Singer</div>
          </div>
        </Card>
      </div>
    );
  }
}

export default VendorSkills;
