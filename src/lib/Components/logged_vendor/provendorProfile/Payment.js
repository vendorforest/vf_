import React from "react";
import { Card } from "antd";

const text = (
  <p style={{ paddingLeft: 24 }}>
    A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be
    found as a welcome guest in many households across the world.
  </p>
);

class VendorPayment extends React.Component {
  render() {
    return (
      <div className="vendor-payment">
        <Card title="Payment" style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)" }}>
          <div className="row">
            <div className="col-md-12 ">Payment: Paypal</div>
          </div>
        </Card>
      </div>
    );
  }
}

export default VendorPayment;
