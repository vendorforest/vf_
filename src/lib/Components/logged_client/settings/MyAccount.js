// @ts-nocheck
import React from "react";
import { connect } from "react-redux";
import { Input, Form, Upload, Icon, message, Card, Button, Select, Modal } from "antd";
import { fetchUpdateAccount, fetchSendCodeEmail } from "./essential";
import ChangeCropPhoto from './ChangeCropPhoto';
import { constants } from "@Shared/constants";
import GoogleMapLoader from "react-google-maps-loader";
import GooglePlacesSuggest from "react-google-places-suggest";
import countryData from "@Shared/countries_states.json";
import { timeZone } from "@Shared/timezone.json";


class ClientMyAccount extends React.Component {

    _btnIndex = 0;

    constructor(props) {
        
        super(props);

        this.state = {

            search: "",

            country: undefined,

            state: undefined,

            city: "",

            fullAddress: "",

            lat: undefined,

            lng: undefined,

            placeId: undefined,

            countryList: countryData.map((item) => item.name),

            stateLists: [],

            isVisiblePhotoDlg: false,

            loading: false,
        };
    }


    componentDidMount() {

        const country = this.props.user.bsLocation ? this.props.user.bsLocation.country : undefined;

        const state = this.props.user.bsLocation ? this.props.user.bsLocation.state : undefined;

        let stateLists = [];

        if (country) {

            stateLists = countryData.filter(item => item.name === country)[0].states
        }

        this.setState({

            country: country,

            state: state,

            stateLists: stateLists,

            city: (this.props.user.bsLocation || {}).city || "",

            fullAddress: (this.props.user.bsLocation || {}).fullAddress || "",

            lat: (this.props.user.bsLocation || {}).lat,

            lng: (this.props.user.bsLocation || {}).lng,

            placeId: (this.props.user.bsLocation || {}).placeId,
        });
    }

    static getDerivedStateFromProps(props, state) {

        if (!state.success && props.success) message.success(props.success);

        if (!state.error && props.error) message.error(props.error);

        return { success: props.success, error: props.error };
    }

    
    saveAccount = async (e) => {

        e.preventDefault();

        this._btnIndex = 0;

        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err && !this.props.pending) {

                if (!this.state.lat) return message.error("Invalid full address");

                const params = {

                    firstName: values.firstName,

                    lastName: values.lastName,

                    username: values.username,

                    email: values.email,

                    verifyCode: values.verifyCode,

                    bsLocation: {

                        country: values.country,

                        state: values.state,

                        city: values.city,

                        fullAddress: values.fullAddress,

                        lat: this.state.lat,

                        lng: this.state.lng,

                        placeId: this.state.placeId,
                    },

                    timeZone: values.timeZone,

                    phonePrefix: values.prefix,

                    localPhoneNumber: values.phone,

                    phone: values.prefix + values.phone,
                };
                
                this.props.fetchUpdateAccount(params);
            }
        });
    };


    sendVeryfyCode = () => {

        this._btnIndex = 1;

        this.props.form.validateFields(["email"], (error, values) => {

            if (!error && !this.props.pending) this.props.fetchSendCodeEmail(values);
        });
    }


    handleInputChange = (e) => {

        this.setState({ search: e.target.value });
    };


    handleSelectSuggest = (geocodedPrediction, originalPrediction) => {

        this.props.form.setFieldsValue({

            fullAddress: geocodedPrediction.formatted_address,
        });

        this.setState({

            search: "",

            lat: geocodedPrediction.geometry.location.lat(),

            lng: geocodedPrediction.geometry.location.lng(),

            placeId: geocodedPrediction.place_id,
        });
    };


    handleNoResult = () => {

        process.env.NODE_ENV === "development" && console.log("No results for ", this.state.search);
    };


    handleStatusUpdate = (status) => {

        process.env.NODE_ENV === "development" && console.log("handleStatusUpdate", status);
    };

    toggleCropDlg = () =>{

        this.setState({isVisiblePhotoDlg: !this.state.isVisiblePhotoDlg})
    }

    render() {

        if (!this.props.user) return null;

        const { getFieldDecorator } = this.props.form;

        const generateCountryOptions = () => {

            return this.state.countryList.map((country, index) => {

                return <Select.Option value={country} key={index}>{country}</Select.Option>
            });
        };

        const generateStateOptions = () => {

            return this.state.stateLists.map((state, index) => {

                return <Select.Option value={state.name} key={index}>{state.name}</Select.Option>
            });
        };

        const generateTimeZoneOptions = () => {

            return timeZone.map((tz, index) => {

                return <Select.Option value={tz} key={index}>{tz}</Select.Option>
            });
        };

        const generatePhoneCountryCodeOptions = () => {

            let codes = countryData.filter(country => country.phone_code && Number(country.phone_code)).map(country => `+${country.phone_code}`).sort((a, b) => a > b ? 1 : a < b ? -1 : 0);

            codes = codes.filter((code, index, self) => self.indexOf(code) === index)

            return codes.map((code, index) => {

                return <Select.Option value={code} key={index}>{code}</Select.Option>
            });
        };
        const prefixSelector = getFieldDecorator("prefix", {
            
            initialValue: this.props.user.phonePrefix || "+1"

        })( <Select size={"large"} style={{ width: "100px" }}>{generatePhoneCountryCodeOptions()}</Select>);

        return (
            <div className="client-myaccount">
                <Card title={<span className="h5 font-weight-bold">My Account</span>} style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)", marginBottom: "50px" }}>
                    <Form layout="vertical">
                        <div className="row">
                        <div className="col-12 mb-3">
                            <div className="photo" onClick={this.toggleCropDlg}>
                                <img src={this.props.user.profileImage} alt="profile-photo"/>
                                <div className="mask">
                                    <Icon type="edit" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <Form.Item label="First Name">
                            {
                                getFieldDecorator("firstName", {

                                    initialValue: this.props.user.firstName, //solution

                                    rules: [{ required: true, message: "Please input First Name", whitespace: true }],

                                })(<Input placeholder="First Name" size={"large"} />)
                            }
                            </Form.Item>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <Form.Item label="Last Name">
                            {
                                getFieldDecorator("lastName", {

                                    initialValue: this.props.user.lastName, //solution

                                    rules: [{ required: true, message: "Please input Last Name" }],

                                })(<Input placeholder="Last Name" size={"large"} />)
                            }
                            </Form.Item>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <Form.Item label="User Name">
                            {
                                getFieldDecorator("username", {

                                    initialValue: this.props.user.username, //solution

                                    rules: [{ required: true, message: "Please input user name" }],

                                })(<Input placeholder="User Name" size={"large"} />)
                            }
                            </Form.Item>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <Form.Item label="Phone Number">
                            {
                                getFieldDecorator("phone", {

                                    initialValue: this.props.user.localPhoneNumber,

                                    rules: [{ required: true, message: "Please input your phone number!" }],

                                })(<Input addonBefore={prefixSelector} size={"large"} />)
                            }
                            </Form.Item>
                        </div>
                        <div className="col-12">
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Item label="Email Address">
                                    {
                                        getFieldDecorator("email", {

                                            initialValue: this.props.user.email, //solution

                                            rules: [{ required: true, message: "Please input Email Address" }],

                                        })(<Input placeholder="Email Address" size={"large"} />)
                                    }
                                    </Form.Item>
                                </div>
                                {
                                    this.props.form.getFieldsValue(["email"]).email !== this.props.user.email && 
                                    <div className="col-md-2 mt-md-1 mt-0">
                                        <Button className={`w-100 mt-md-4 mt-0 mb-3`} loading={this._btnIndex === 1 && this.props.pending} size={"large"} onClick={this.sendVeryfyCode}> Verify</Button>
                                    </div>
                                }
                                {
                                    this.props.form.getFieldsValue(["email"]).email !== this.props.user.email && 
                                    <div className="col-md-4">
                                        <Form.Item label="Verify Code">
                                            {
                                                getFieldDecorator("verifyCode", {

                                                    initialValue: this.state.verifyCode, //solution

                                                    rules: [{ required: true, message: "Please input Verify Code" }],

                                                })(<Input placeholder="Verify Code" size={"large"} />)
                                            }
                                        </Form.Item>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="col-md-4">
                            <Form.Item label="Country">
                            {
                                getFieldDecorator("country", {

                                    initialValue: this.state.country,

                                    rules: [{ required: true, message: "Please select country." }],
                                })(
                                    <Select showSearch placeholder="Select Country" optionFilterProp="children" size={"large"}

                                        onChange={(value) => {

                                            this.setState({ stateLists: (countryData.filter((item) => item.name === value))[0].states });

                                            this.props.form.setFieldsValue({ state: undefined });

                                    }}>{generateCountryOptions()}</Select>
                                )
                            }
                            </Form.Item>
                        </div>
                        <div className="col-md-4">
                            <Form.Item label="State">
                            {
                                getFieldDecorator("state", {

                                    initialValue: this.state.state,

                                    rules: [{ required: true, message: "Please select state." }],
                                })(
                                    <Select showSearch placeholder="Select state" optionFilterProp="children" size={"large"}> 
                                        {generateStateOptions()}
                                    </Select>,
                                )
                            }
                            </Form.Item>
                        </div>
                        <div className="col-md-4">
                            <Form.Item label="City">
                            {
                                getFieldDecorator("city", {

                                    initialValue: this.state.city, //solution

                                    rules: [{ required: true, message: "Please input city" }],

                                })(<Input placeholder="City" size={"large"} />)
                            }
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <GoogleMapLoader params={{ key: constants.GOOGLEMAP_API, libraries: "places, geocode"}} 
                                render={(googleMaps) => googleMaps && (
                                    <GooglePlacesSuggest googleMaps={googleMaps}
                                        autocompletionRequest={{
                                            input: this.state.search,
                                            // Optional options
                                            // https://developers.google.com/maps/documentation/javascript/reference?hl=fr#AutocompletionRequest
                                        }}
                                        // Optional props
                                        onNoResult={this.handleNoResult}
                                        onSelectSuggest={this.handleSelectSuggest}
                                        onStatusUpdate={this.handleStatusUpdate}
                                        textNoResults="No Result" // null or "" if you want to disable the no results item
                                        customRender={(prediction) => <div className="p-1"> {prediction ? prediction.description : "No Result"}</div>}
                                    >
                                        <Form.Item label="Full Address">
                                        {
                                            getFieldDecorator("fullAddress", {

                                                initialValue: this.state.fullAddress, //solution

                                                rules: [{ required: true, message: "Please input full address" }],

                                            })(<Input placeholder="Full Address" size={"large"} onChange={this.handleInputChange} />)
                                        }
                                        </Form.Item>
                                    </GooglePlacesSuggest>
                                )
                            }
                            />
                        </div>
                        <div className="col-md-6">
                            <Form.Item label="Time Zone">
                            {
                                getFieldDecorator("timeZone", {

                                    initialValue: this.props.user.timeZone,

                                    rules: [{ required: true, message: "Please select timezone." }],
                                })(
                                    <Select showSearch placeholder="Select timezone" optionFilterProp="children" size={"large"}

                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}

                                    >{generateTimeZoneOptions()}</Select>
                                )
                            }
                            </Form.Item>
                        </div>
                        </div>
                    </Form>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <Button type="primary" size="large" onClick={this.saveAccount} loading={this._btnIndex === 0 && this.props.pending} style={{width: '150px'}}>Save</Button>
                        </div>
                    </div>
                </Card>
                <Modal title="Crop & Change Photo" visible={this.state.isVisiblePhotoDlg} onCancel={this.toggleCropDlg} width={"800px"} footer={null}>
                    <ChangeCropPhoto src={this.props.user.profileImage} toggle={this.toggleCropDlg}/>
                </Modal>
            </div>
        );
    }
}


const mapStateToProps = ({ clientSettingsReducer }) => {

    const { error, user,success, pending } = clientSettingsReducer;

    return { error, user, success, pending };
};


const ClientMyAccountForm = Form.create({ name: "vendor_setting_myaccount" })(ClientMyAccount);

export default connect(mapStateToProps, {

    fetchUpdateAccount,

    fetchSendCodeEmail,

})(ClientMyAccountForm);
