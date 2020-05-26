import React from "react";
import { Card, Steps, Icon, message } from "antd";
import { connect } from "react-redux";
import { 
    StripeProvider, 
    Elements,
} from 'react-stripe-elements'
import BillingCardItem from './BillingCardItem'
import CardForm from './CardForm'
import {fetchGetBillingMethod, fetchUpdateBillingMethod } from "../essential";

const { Step } = Steps;

class ClientBillingMethod extends React.Component {

	constructor(props) {

		super(props);
		
		this.state = {

            isInit: true,

            loading: false,

            stripe: null,

            billingData: null,

            isNewCard: false,
		};
	}


	componentDidMount() {

        // @ts-ignore
        this.setState({stripe: window.Stripe(process.env.STRIPE_PUBLISHABLE_KEY)});

        this.setState({isInit: true})

        fetchGetBillingMethod().then(data => {

            this.setState({isInit: false})

            if (data.status === 200){

                if (data.data.sources && data.data.sources.total_count > 0 ) {

                    this.setState({billingData: data.data.sources.data[0]})
                }
            }
        }).catch(error => this.setState({isInit: false}))
    }

    
	update = (token) => {

        if (this.state.loading) return;

        this.setState({loading: true})

        fetchUpdateBillingMethod({cardToken: token.id}).then(data => {

            this.setState({loading: false});

            if (data.status === 200) {

                if (data.data.sources && data.data.sources.total_count > 0 ) {

                    this.setState({billingData: data.data.sources.data[0], isNewCard: false})
                }
            }
        }).catch(error => {

            this.setState({loading: false});
            
            message.error(error.message);
        })
    }

    
    toggleNewCard = () => {

        this.setState({isNewCard: !this.state.isNewCard})
    }

	render() {

        if (!this.props.user) return null;

        return (
            <div className="client-billingmethod">
				<Card title={<span className="h5 font-weight-bold">Add New Billing Method</span>} style={{ marginBottom: "50px" }} >
                    {
                        this.state.isInit ? 
                        <div></div>:
                        <React.Fragment>
                            {
                                !this.state.isNewCard && this.state.billingData ?
                                <BillingCardItem className="mb-5" 
                                    card={this.state.billingData}
                                    toggleNewCard={this.toggleNewCard}
                                /> :
                                <StripeProvider stripe={this.state.stripe}>
                                    <Elements>
                                        <CardForm 
                                        // @ts-ignore
                                        stripe={this.state.stripe}
                                            billingData={this.state.billingData}
                                            toggleNewCard={this.toggleNewCard}
                                            update={this.update}
                                            loading={this.state.loading}
                                        />
                                    </Elements>
                                </StripeProvider> 
                            }
                        </React.Fragment>
                    }
                </Card>
			</div>
		);
	}
}

const mapStateToProps = ({ clientSettingsReducer }) => {

    const { user, pending } = clientSettingsReducer;
    
    return {user, pending };
};

export default connect(mapStateToProps, {})(ClientBillingMethod);
