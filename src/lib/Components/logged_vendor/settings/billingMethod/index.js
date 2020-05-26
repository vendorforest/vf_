import React from "react";
import { Card, Steps, Icon, message } from "antd";
import { fetchGetBillingMethod } from "../essential";
import { connect } from "react-redux";
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'
import BillingAccountItem from './BillingAccountItem'
import { fetchUpdateBillingMethod } from "../essential";

const { Step } = Steps;

class VendorBillingMethod extends React.Component {

	constructor(props) {

		super(props);
		
		this.state = {

            loading: false,

            billingData: null,

            step: 1,

            isNewAccount: false,

            verified: false,
		};
	}


	componentDidMount() {

        fetchGetBillingMethod().then(data => {

            if (data.status === 200){

                const billingData = data.data;

                console.log(billingData)

                this.setState({billingData: billingData}, this.checkVerifyStatus)
            }
        })
    }

    checkVerifyStatus = () => {

        let verified = true;

        for (let key of Object.keys(this.state.billingData.requirements)) {

            if (this.state.billingData.requirements[key]){

                if (Array.isArray(this.state.billingData.requirements[key]) && this.state.billingData.requirements[key].length === 0) continue;

                verified = false; break;
            }
        }

        console.log(verified)

        this.setState({verified: verified, isNewAccount: verified ? false : this.state.isNewAccount})
    }
    
	update = (billingData) => {

        if (this.state.loading) return;

        this.setState({loading: true})

        fetchUpdateBillingMethod(billingData).then(data => {

            this.setState({loading: false});

            console.log(data)

            if (data.status === 200) {

                this.setState({billingData: data.data, step: this.state.step < 4 ? this.state.step + 1 : this.state.step}, this.checkVerifyStatus)
            }
        }).catch(error => {

            this.setState({loading: false});
            
            message.error(error.message);
        })
    }

    back = () =>{
        
        if(this.state.step > 1) this.setState({step: this.state.step - 1})
    }

    next = () => {

        if (this.state.step < 4) this.setState({step: this.state.step + 1});
    }
    
    getStepStatus = (step) => {

        if (this.state.step > step) return 'finish'

        if (this.state.step === step) {

            if (this.state.loading) return 'progress'

            return 'finish'
        }

        return 'wait'
    }


    newAccount = (flag) => {

        this.setState({isNewAccount: flag || false})
    }

	render() {

        if (!this.props.user || !this.state.billingData) return null;

        return (
            <div className="vendor-billingmethod">
				<Card title={<span className="h5 font-weight-bold">Add New Billing Method</span>} style={{ marginBottom: "50px" }} >
                    {
                        !this.state.verified &&
                        <React.Fragment>
                            <Steps className="mb-4">
                                <Step status={this.getStepStatus(1)} title="Billing Profile" icon={<Icon type="solution" />} />
                                <Step status={this.getStepStatus(2)} title="Billing Address" icon={<Icon type="contacts" />} />
                                <Step status={this.getStepStatus(3)} title="ID Verification" icon={<Icon type="idcard" />} />
                                <Step status={this.getStepStatus(4)} title="Payment Method" icon={<Icon type="credit-card" />} />                                
                            </Steps>
                            {
                                this.state.step === 1 && 
                                <StepOne 
                                    update={this.update} 
                                    loading={this.state.loading} 
                                    billingData={this.state.billingData}
                                />
                            }
                            {
                                this.state.step === 2 && 
                                <StepTwo 
                                    loading={this.state.loading}  
                                    billingData={this.state.billingData}
                                    update={this.update}
                                    back={this.back} 
                                    next={this.next}
                                />
                            }
                            {
                                this.state.step === 3 && 
                                <StepThree 
                                    loading={this.state.loading}  
                                    billingData={this.state.billingData}
                                    update={this.update} 
                                    back={this.back} 
                                    next={this.next}
                                />
                            }
                            {
                                this.state.step === 4 &&
                                <StepFour 
                                    loading={this.state.loading}  
                                    billingData={this.state.billingData}
                                    update={this.update} 
                                    back={this.back}
                                />
                            }
                        </React.Fragment>
                    }
                    {
                        this.state.verified && this.state.billingData &&
                        <React.Fragment>
                            {
                                this.state.isNewAccount ?
                                <StepFour 
                                    loading={this.state.loading}  
                                    billingData={this.state.billingData}
                                    update={this.update} 
                                    back={this.newAccount}
                                /> :
                                <BillingAccountItem className="mb-5" 
                                    account={this.state.billingData.external_accounts.data[0]}
                                    newAccount={this.newAccount}
                                />
                            }
                        </React.Fragment>
                    }
                </Card>
			</div>
		);
	}
}

const mapStateToProps = ({ vendorSettingsReducer }) => {

    const { user, pending } = vendorSettingsReducer;
    
    return {user, pending };
};

export default connect(mapStateToProps, {})(VendorBillingMethod);
