import React from "react";
import { Form, Button, Input, Select } from "antd";
import { connect } from "react-redux";
import RejectAlert from './RejectAlert'
import countryData from "@Shared/countries_states.json";
import mccData from "@Shared/mcc_codes.json";

class StepOne extends React.Component {

	constructor(props) {

		super(props);
		
		this.state = {

            rejectReasons: []
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
                
                if (error.requirement.includes('individual.phone')){

                    return error.reason
                }
            })

            this.setState({rejectReasons: rejectReasons})
        }
        
        if (data.individual){

            this.props.form.setFieldsValue({

                email: data.individual.email,

                first_name: data.individual.first_name,

                last_name: data.individual.last_name,

                phone: data.individual.phone,

                country: data.individual.address ? data.individual.address.country : ''
            })

            if (data.individual.phone && data.individual.address.country){

                const phoneCode = this.getPhoneCode(data.individual.address.country)

                const phone = data.individual.phone.replace(phoneCode, '')

                this.props.form.setFieldsValue({phone: phone, country_code: phoneCode})
    
            }
        }

        if (data.business_profile){

            this.props.form.setFieldsValue({

                mcc: data.business_profile.mcc,

                url: data.business_profile.url
            })
        }
    }

    getPhoneCode = (country_code) => {

        const countries = countryData.filter(country => country.iso2 === country_code);

        if (countries.length > 0) return `+${countries[0].phone_code}`

        return 
    }

	update = (e) => {

        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {

            if (err) return;

            const updateData = {

                email: values.email,

                business_type: 'individual',

                individual: {
                    
                    email: values.email,

                    first_name: values.first_name,

                    last_name: values.last_name,

                    phone: `${values.country_code}${values.phone}`,

                    address: {

                        country: values.country, 
                    },
                },

                business_profile: {

                    mcc: values.mcc, 
                    
                    url: values.business_url || 'vendorforest.com'
                }
            }

            this.setState({rejectReasons: []})

            this.props.update(updateData)
        });
	}
	  
	render() {

		const {getFieldDecorator } = this.props.form;

        if (!this.props.user) return null;
        
        const generateMccOptions = () => {

            return mccData.map((mcc, index) => {

                return <Select.Option value={mcc.mcc} key={index}>{`${mcc.edited_description}${mcc.edited_description.length < 30 ? `(${mcc.mcc})` : ''}`}</Select.Option>
            });
        }

        const generateCountryOptions = () => {

			return countryData.map((country, index) => {

                return <Select.Option value={country.iso2} key={index}>{country.name}</Select.Option>
            });
		};
        
        const generatePhoneCountryCodeOptions = () => {

            let phoneCodes = countryData.filter(country => country.phone_code && Number(country.phone_code)).map(country => `+${country.phone_code}`).sort((a, b) => a > b ? 1 : a < b ? -1 : 0);

            phoneCodes = phoneCodes.filter((pcode, index, self) => self.indexOf(pcode) === index);

            return phoneCodes.map((pc, index) => {

                return <Select.Option value={pc} key={index}>{pc}</Select.Option>
            });
        };

        const countryCodeSelector = getFieldDecorator("country_code")( 

            <Select size={"large"} style={{ width: "90px" }}>{generatePhoneCountryCodeOptions()}</Select>
        );

		return (
			<div className="vendor-billingmethod_stepone">
                <RejectAlert message="" reasons={this.state.rejectReasons}/>
                <Form onSubmit={this.update} >
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <Form.Item label="Country">
                                {
                                    getFieldDecorator("country", {

                                        rules: [{ required: true, message: "Please choose country"}],

                                    })(<Select showSearch placeholder="Select Country" size={"large"}>{generateCountryOptions()}</Select>)
                                }
                            </Form.Item>
                            <Form.Item label="First Name">
                                {
                                    getFieldDecorator("first_name", {

                                        rules: [{ required: true, message: "Please input first name"}],

                                    })(<Input placeholder="John" size={"large"} />)
                                }
                            </Form.Item>
                            <Form.Item label="Last Name">
                                {
                                    getFieldDecorator("last_name", {

                                        rules: [{ required: true, message: "Please input last name"}],

                                    })(<Input placeholder="Micheal" size={"large"} />)
                                }
                            </Form.Item>
                            <Form.Item label="Email">
                                {
                                    getFieldDecorator("email", {

                                        initialValue:this.props.user.email,

                                        rules: [{ 
                                            required: true,

                                            // pattern: new RegExp('^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),

                                            type: 'email',

                                            message: "Wrong email"}],

                                    })(<Input placeholder="example@mail.com" size={"large"} />)
                                }
                            </Form.Item>
                            <Form.Item label="Phone Number">
                                {
                                    getFieldDecorator("phone", {

                                        initialValue: this.props.user.localPhoneNumber,

                                        rules: [{ required: true, message: "Please input phone number" }],

                                    })(<Input addonBefore={countryCodeSelector} size={"large"} />)
                                }
                            </Form.Item>
                            <Form.Item label="MCC(Merchant Category Code">
                                {
                                    getFieldDecorator("mcc", {

                                        rules: [{ required: true, message: "Please choose mcc"}],

                                    })(<Select showSearch placeholder="Select mcc" size={"large"} >{generateMccOptions()}</Select>)
                                }
                            </Form.Item>
                            <Form.Item label="Business Website">
                                {
                                    getFieldDecorator("business_url", {

                                        rules: [{type: 'url', message: 'Invalid Url'}],

                                    })(<Input placeholder="vendorforest.com" size={"large"} />)
                                }
                            </Form.Item>
                            <div className="d-flex justify-content-center mt-5">
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

const StepOneForm = Form.create({ name: "vendor_setting_billingmethod_stepone" })( StepOne );


export default connect(mapStateToProps, {

})(StepOneForm);
