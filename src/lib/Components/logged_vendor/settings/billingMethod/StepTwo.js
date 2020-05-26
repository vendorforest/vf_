import React from "react";
import { Form, Button, Input, Select } from "antd";
import { connect } from "react-redux";
import RejectAlert from './RejectAlert'
import countryData from "@Shared/countries_states.json";


class StepTwo extends React.Component {

	constructor(props) {

		super(props);
		
		this.state = {

            stateList: countryData.filter(country => country.iso2 === "US")[0].states,

            rejectReasons: [],
		};
	}


	componentDidMount() {

        if (this.props.billingData){

            this.initData(this.props.billingData)
        }
    }
    
    componentDidUpdate(prevProps, prevState){

        if (this.props.billingData && !prevProps.billingData){

            this.initData(this.props.billingData)
        }
    }

    initData = (data) => {

        if (data.requirements.errors.length > 0){

            const rejectReasons = data.requirements.errors.forEach(error => {
                
                if (error.requirement.includes('individual.address')){

                    return error.reason
                }
            })

            this.setState({rejectReasons: rejectReasons})
        }
        
        if (data.individual && data.individual.address){

            this.props.form.setFieldsValue({

                state: data.individual.address.state,
                
                line1: data.individual.address.line1, 
                
                line2: data.individual.address.line2, 

                city: data.individual.address.city,

                postal_code: data.individual.address.postal_code,
            })
        }
    }

    back = () => {

        this.props.back();
    }

    update = (e) => {

        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {

            if (err) return;

            const updateData = {

                individual: {
                    
                    address: {

                        state: values.state,
                        
                        line1: values.line1, 
                        
                        line2: values.line2, 

                        city: values.city,

                        postal_code: values.postal_code,
                    },
                }
            }

            this.setState({rejectReasons: []})

            this.props.update(updateData)
        });
	}

	  
	render() {

		const {getFieldDecorator } = this.props.form;

		if (!this.props.user) return null;

		const generateStateOptions = () => {

			return this.state.stateList.map((state, index) => {

                return <Select.Option value={state.state_code} key={index}>{state.name}</Select.Option>
            });
        };


		return (
			<div className="vendor-billingmethod_steptwo">	
                <RejectAlert message="" reasons={this.state.rejectReasons}/>			
                <Form onSubmit={this.update} >
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <Form.Item label="Address line 1">
                                {
                                    getFieldDecorator("line1", {

                                        rules: [{ required: true, message: "Please inut address line1"}],

                                    })(<Input placeholder="Address line1" size={"large"}/>)
                                }
                            </Form.Item>
                            <Form.Item label="Address line 2">
                                {
                                    getFieldDecorator("line2", {

                                        rules: [{ required: true, message: "Please input address line2"}],

                                    })(<Input placeholder="Address line2" size={"large"}/>)
                                }
                            </Form.Item>
                            <Form.Item label="City">
                                {
                                    getFieldDecorator("city", {

                                        rules: [{ required: true, message: "Please input city"}],

                                    })(<Input placeholder="City" size={"large"}/>)
                                }
                            </Form.Item>
                            <Form.Item label="State">
                                {
                                    getFieldDecorator("state", {

                                        rules: [{ required: true, message: "Please choose state"}],

                                    })(<Select showSearch placeholder="Select state" size={"large"}>{generateStateOptions()}</Select>)
                                }
                            </Form.Item>
                            <Form.Item label="Zip">
                                {
                                    getFieldDecorator("postal_code", {

                                        rules: [{ required: true, message: "Please inpute zipcode"}],

                                    })(<Input placeholder="Zipcode" size={"large"}/>)
                                }
                            </Form.Item>
                            <div className="d-flex justify-content-center mt-5">
                                <Button type="primary" size="large" style={{minWidth: '150px'}} className="mr-2" onClick={this.back}>Back</Button>
                                <Button type="primary" htmlType="submit" size="large" style={{minWidth: '150px'}} loading={this.props.loading}>Next</Button>
                            </div>
                        </div>
                    </div>
                </Form>
			</div>
		);
	}
}

const mapStateToProps = ({ vendorSettingsReducer }) => {

	const { error, user, pending } = vendorSettingsReducer;

	return { error, user, pending };
};

const StepTwoForm = Form.create({ name: "vendor_setting_billingmethod_steptwo" })( StepTwo );


export default connect(mapStateToProps, {

})(StepTwoForm);
