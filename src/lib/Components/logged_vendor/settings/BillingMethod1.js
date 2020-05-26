import React from "react";
import { Form, Card, Row } from "antd";
import stripeLinkButton from "@Components/images/stripe/str_link_button.png";
import { signupStripe } from "./essential";
import { connect } from "react-redux";

const _process = process ? process : null;

class VendorBillingMethod extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      paymentMethod: 0,
      cardNumber: "",
      firstName: "",
      lastName: "",
      expireMonth: "01",
      expireYear: "2019",
      securityCode: "",
    };
  }

  goToStripe = () => {
    // alert("stripe");
    // const userEmail = this.props.user.email;
    this.props.signupStripe();
    // process.env.NODE_ENV === "development" && console.log("userEmail is " + userEmail);
  };

  render() {
    const API_URL = process.env.API_URL;
    const STRIPE_CLIENT = process.env.STRIPE_CLIENT;

    const { getFieldError, isFieldTouched } = this.props.form;

    return (
      <div className="vendor-billingmethod">
        <Card
          title={<span className="h5 font-weight-bold">Add New Billing Method</span>}
          style={{ marginBottom: "50px" }}
        >
          {this.props.user && (
            <div>
              {!this.props.user.connectedAccountId ? (
                <Row style={{ textAlign: "center" }}>
                  <button className="disable" disabled>
                    <a
                      href={`https://connect.stripe.com/express/oauth/authorize?redirect_uri=${API_URL}/apis/payment/stripe_web_hook&client_id=${STRIPE_CLIENT}`}
                    >
                      <img src={stripeLinkButton} alt="" />
                    </a>
                  </button>
                </Row>
              ) : (
                <Row style={{ textAlign: "center" }}>
                  You have already registered your stripe account.
                </Row>
              )}
            </div>
          )}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = ({ vendorSettingsReducer }) => {
  const { error, user, pending } = vendorSettingsReducer;
  return {
    error,
    user,
    pending,
  };
};

const VendorBillingMethodForm = Form.create({ name: "vendor_setting_billingmethod" })(
  VendorBillingMethod,
);

// export default VendorBillingMethodForm;

// const VendorMyAccountForm = Form.create({ name: "vendor_setting_myaccount" })(VendorMyAccount);

export default connect(mapStateToProps, {
  signupStripe,
})(VendorBillingMethodForm);
