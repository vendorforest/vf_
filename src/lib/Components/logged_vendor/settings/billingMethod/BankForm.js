import React, { Component } from 'react'
import { Form, Input, Button } from "antd";
import NumericInput from '@Components/NumericInput'


class BankForm extends Component {


    constructor(props){

        super(props);

        this.state = {
            
        }
    }

    submit = (e) => {

        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {

            if (err) return;

            if (this.props.stripe && this.props.billingData) {

                this.props.stripe.createToken( 'bank_account', {

                    country: this.props.billingData.country,

                    currency: 'usd',

                    routing_number: values.routing_number,

                    account_number: values.account_number,

                    account_holder_name: values.account_holder_name,

                    account_holder_type: 'individual',

                }).then((payload) => {
    
                    if (!payload.error) this.props.update(payload.token)
                });
            }
        });
    }

    render() {

        const {getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.submit} className="w-100">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <Form.Item label="Account Hold Name">
                            {
                                getFieldDecorator("account_holder_name", {

                                    rules: [{ required: true, message: "Please input account holder name"}],

                                })(<Input placeholder="Jane Doe" size={"large"}/>)
                            }
                        </Form.Item>
                        <Form.Item label="Account Number">
                            {
                                getFieldDecorator("account_number", {

                                    rules: [{ required: true, message: "Please input account number"}],

                                })(<NumericInput placeholder="000123456789" size={"large"}/>)
                            }
                        </Form.Item>
                        <Form.Item label="Bank Routing Number">
                            {
                                getFieldDecorator("routing_number", {

                                    rules: [{ required: true, message: "Please input bank routing number"}],

                                })(<NumericInput placeholder="110000000" size={"large"}/>)
                            }
                        </Form.Item>
                        <div className="d-flex justify-content-center mt-5">
                        <Button type="primary" size="large" style={{minWidth: '150px'}} className="mr-2" onClick={()=>{this.props.back(false)}}>Back</Button>
                            <Button type="primary" size="large" style={{minWidth: '150px'}} htmlType="submit" loading={this.props.loading} onClick={this.submit}>Submit</Button>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}


const BillingBankForm = Form.create({ name: "billing-bankform" })( BankForm );

export default BillingBankForm