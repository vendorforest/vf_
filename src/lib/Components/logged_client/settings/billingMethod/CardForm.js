import React, { Component } from 'react'
import { Form, Button, Input } from "antd";
import { 
    CardNumberElement, 
    CardExpiryElement, 
    CardCVCElement, 
    injectStripe
} from 'react-stripe-elements'


class CardForm extends Component {


    constructor(props){

        super(props);

        this.state = {
            
        }
    }

    submit = (e) => {

        e.preventDefault();

        if (this.props.stripe) {

            this.props.form.validateFieldsAndScroll((err, values) => {

                if (!err){

                    this.props.stripe.createToken({type: 'card', currency: 'usd', name: values.name}).then((payload) => {

                        if (!payload.error) this.props.update(payload.token)
                    });
                }
            });
        }
    }

    render() {

        return (
            <Form onSubmit={this.submit} className="w-100">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <Form.Item label="Card Holder Name">
                            {
                                this.props.form.getFieldDecorator("name", {

                                    rules: [{ required: true, message: "Please input holder name"}],

                                })(<Input placeholder="John Dou" size={"large"}/>)
                            }
                        </Form.Item>
                        <Form.Item label={<span><sup style={{color: 'red', fontSize: '10px'}}>*&nbsp;</sup>Card Number</span>}>
                            <CardNumberElement />
                        </Form.Item>
                        <Form.Item label={<span><sup style={{color: 'red', fontSize: '10px'}}>*&nbsp;</sup>Expiration Date</span>}>
                           <CardExpiryElement />
                        </Form.Item>
                        <Form.Item label={<span><sup style={{color: 'red', fontSize: '10px'}}>*&nbsp;</sup>CVC</span>}>
                            <CardCVCElement />
                        </Form.Item>
                        <div className="d-flex justify-content-center mt-5">
                            {
                                this.props.billingData &&
                                <Button type="primary" size="large" style={{minWidth: '150px'}} className="mr-2" onClick={this.props.toggleNewCard}>Cancel</Button>
                            }
                            <Button type="primary" size="large" style={{minWidth: '150px'}} htmlType="submit" loading={this.props.loading} onClick={this.submit}>Submit</Button>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

const BillingCardForm = Form.create({ name: "billing-cardform" })( injectStripe(CardForm) );

export default BillingCardForm