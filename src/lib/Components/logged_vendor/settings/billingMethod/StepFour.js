import React from "react";
import { Radio, Button, Icon, message } from "antd";
import RejectAlert from './RejectAlert'
import { connect } from "react-redux";
import CardForm from './CardForm'
import BankForm from './BankForm'
import { 
    StripeProvider, 
    Elements,
} from 'react-stripe-elements'


class StepFour extends React.Component {

	constructor(props) {

		super(props);
		
		this.state = {

            stripe: null,

            billingMethod: 1, 

            rejectReasons: [],
        };
	}


    componentDidMount() {

        // @ts-ignore
        this.setState({stripe: window.Stripe(process.env.STRIPE_PUBLISHABLE_KEY)});

        if (this.props.billingData){

            // this.initData(this.props.billingData)
        }
    }
    
    
    componentDidUpdate(prevProps, prevState){

        if (this.props.billingData && !prevProps.billingData){

            // this.initData(this.props.billingData)
        }
    }

    initData = (data) => {

        // console.log(data.requirements.errors)

        // if (data.requirements.errors.length > 0){

        //     let rejectReasons = [];
            
        //     data.requirements.errors.forEach(error => {

        //         if (error.requirement.includes('individual.verification')){

        //             rejectReasons.push(error.reason);
        //         }
        //     })

        //     this.setState({rejectReasons: rejectReasons})
        // }
        
        // if (data.individual && data.individual.dob){

        //     this.props.form.setFieldsValue({

        //         dob: moment(`${data.individual.dob.year}-${data.individual.dob.month}-${data.individual.dob.day}`, 'YYYY-MM-DD')
        //     })
        // }
    }

    onChangeBillingMethod = (e) => {
        
        this.setState({billingMethod: e.target.value})
    }

    update = (token) => {

        const updateData = { external_account: token.id}
        
        this.props.update(updateData)
    }

    render() {

        if (!this.props.user || !this.state.stripe || !this.props.billingData) return null;

        return (
			<div className="vendor-billingmethod_steptfour">
				<RejectAlert message="" reasons={this.state.rejectReasons}/>
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-center my-5">
                        <Radio.Group onChange={this.onChangeBillingMethod} value={this.state.billingMethod}>
                            <Radio value={1}>Debit Card</Radio>
                            <Radio value={2}>Bank</Radio>
                        </Radio.Group>
                    </div>
                    <div className="col-md-12">
                        {
                            this.state.billingMethod === 1 && 
                            <StripeProvider stripe={this.state.stripe}>
                                <Elements>
                                    <CardForm 
                                    // @ts-ignore
                                    stripe={this.state.stripe}
                                        billingData={this.props.billingData}
                                        back={this.props.back}
                                        update={this.update}
                                        loading={this.props.loading}
                                    />
                                </Elements>
                            </StripeProvider>
                        }
                        {
                            this.state.billingMethod === 2 && 
                            <StripeProvider stripe={this.state.stripe}>
                                <Elements>
                                    <BankForm 
                                    // @ts-ignore
                                    stripe={this.state.stripe}
                                        billingData={this.props.billingData}
                                        back={this.props.back}
                                        update={this.update}
                                        loading={this.props.loading}
                                    />
                                </Elements>
                            </StripeProvider>
                        }
                    </div>
                </div>
            </div>
		);
	}
}

const mapStateToProps = ({ vendorSettingsReducer }) => {

	const { error, user, pending } = vendorSettingsReducer;

	return { error, user, pending };
};

export default connect(mapStateToProps, {})(StepFour);


