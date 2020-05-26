import React from "react";
import { Form, Button, Input, DatePicker, Icon, Tooltip, message, Upload } from "antd";
import RejectAlert from './RejectAlert'
import { connect } from "react-redux";
import NumerialInput from '@Components/NumericInput'
import moment from 'moment'
import {apiUrl} from '@Shared/constants'


class StepThree extends React.Component {

	constructor(props) {

		super(props);
		
		this.state = {

            frontUploadLoading: false,

            backUploadLoading: false,

            frontFile: null,

            backFile: null,

            idProvide: false,

            idPhotoProvide: false,

            rejectReasons: [],
        };
        
        this.idPhotoDescription = 'Requirements for ID verification Acceptable documents vary by country, although a passport scan is always acceptable and preferred. Scans of both the front and back are usually required for government-issued IDs and driver’s licenses. Files need to be JPEGs or PNGs smaller than 10MB. We can’t verify PDFs. Files should be in color, be rotated with the image right-side up, and have all information clearly legible'
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

            let rejectReasons = [];
            
            data.requirements.errors.forEach(error => {

                if (error.requirement.includes('individual.verification')){

                    rejectReasons.push(error.reason);
                }
            })

            this.setState({rejectReasons: rejectReasons})
        }
        
        if (data.individual){

            if (data.individual.dob && data.individual.dob.year){

                this.props.form.setFieldsValue({

                    dob: moment(`${data.individual.dob.year}-${data.individual.dob.month}-${data.individual.dob.day}`, 'YYYY-MM-DD')
                })
            }

            if (data.individual.verification && data.individual.verification.status === 'verified'){

                this.setState({idPhotoProvide: true})
            }

            this.setState({ idProvide: data.individual.id_number_provided })
        }
    }

	update = (e) => {

        e.preventDefault();

        if (this.state.rejectReasons.length === 0 && this.state.idProvide && !this.state.frontFile && !this.state.backFile){
            
            return this.props.next();
        }

        this.props.form.validateFieldsAndScroll((err, values) => {

            if (err) return;

            if (!this.state.frontFile || !this.state.backFile) return message.warn('Please upload ID photos')

            const updateData = {

                individual: {
                    
                    dob: {

                        day: moment(values.dob).format('DD'),

                        month: moment(values.dob).format('MM'),

                        year: moment(values.dob).format('YYYY'),
                    },

                    id_number: !this.state.idProvide ? values.id_number : undefined,

                    ssn_last_4: !this.state.idProvide ? values.id_number.slice(-4) : undefined,

                    verification: { document: { front: this.state.frontFile.id, back: this.state.backFile.id }}
                },
            }

            this.setState({rejectReasons: []})

            this.props.update(updateData)
        });
    }
    
    back = () => {

        this.props.back();
    }

	uploadIDPhotoFront = (info) => {

        if (info.file.status === 'uploading') {
            
            this.setState({frontUploadLoading: true})
        }

        if (info.file.status === 'done') {

            this.setState({frontUploadLoading: false})

            if (info.file.response && info.file.response.status === 200){

                console.log(info.file.response.data)

                this.setState({frontFile: { name: info.file.name, id: info.file.response.data }})

                message.success(`${info.file.name} file uploaded successfully`);
            }
        } else if (info.file.status === 'error') {

            this.setState({frontUploadLoading: false})

            message.error(`${info.file.name} file upload failed.`);
        }
    }
    
    uploadIDPhotoBack = (info) => {

        if (info.file.status === 'uploading') {
            
            this.setState({backUploadLoading: true})
        }

        if (info.file.status === 'done') {

            this.setState({backUploadLoading: false})

            if (info.file.response && info.file.response.status === 200){

                this.setState({backFile: {name: info.file.name, id: info.file.response.data}})

                message.success(`${info.file.name} file uploaded successfully`);
            }
        } else if (info.file.status === 'error') {

            this.setState({backUploadLoading: false})

            message.error(`${info.file.name} file upload failed.`);
        }
    }
	
	  
	render() {

		const {getFieldDecorator } = this.props.form;

        if (!this.props.user) return null;

        return (
			<div className="vendor-billingmethod_stepthree">
				<RejectAlert message="" reasons={this.state.rejectReasons}/>
                <Form onSubmit={this.update} >
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <Form.Item label="Date of Birth">
                                {
                                    getFieldDecorator("dob", {

                                        rules: [{ required: true, message: "Please select date of birth"}],

                                    })(<DatePicker size={"large"} defaultPickerValue={moment().subtract(20, 'years')} className="w-100" format="MM/DD/YYYY"/>)
                                }
                            </Form.Item>                    
                            <Form.Item label="ID Number">
                                {
                                    getFieldDecorator("id_number", {

                                        rules: [{ required: !this.state.idProvide, message: "invalid id number"}],

                                    })(<NumerialInput placeholder="000000000" size={"large"} maxLength={9} disabled={this.state.idProvide} />)
                                }
                            </Form.Item>
                            <Form.Item label={<span>Photo ID-Front:&nbsp;<Tooltip title={this.idPhotoDescription}><Icon type="info-circle" /></Tooltip></span>}>
                                {
                                    getFieldDecorator("frontFile", {
                                        rules: [{ required: true }],
                                    })(
                                        <Upload name='file' className='w-100'
                                            action={apiUrl.UPLOAD_STRIPE_FILE} 
                                            onChange={this.uploadIDPhotoFront} disabled={this.state.idPhotoProvide ? true : this.state.frontFile ? true : false} showUploadList={false}>
                                            <Button className="w-100" size={'large'} loading={this.state.frontUploadLoading}
                                                disabled={this.state.idPhotoProvide ? true : this.state.frontFile ? true : false}>
                                                {!this.state.frontUploadLoading && <Icon type="upload" />} Upload a file
                                            </Button>
                                        </Upload>
                                    )
                                }
                                {
                                    this.state.frontFile &&
                                    <div className="d-flex justify-content-lg-between align-items-center">
                                        <div><Icon type="link" className="mr-2"/><span>{this.state.frontFile.name}</span></div>
                                        <div className="text-danger pointer" onClick={()=>{this.setState({frontFile: null})}}><Icon type="delete" /></div>
                                    </div>
                                }
                            </Form.Item>
                            <Form.Item label={<span>Photo ID-Back:&nbsp;<Tooltip title={this.idPhotoDescription}><Icon type="info-circle" /></Tooltip></span>}>
                                {
                                    getFieldDecorator("backFile", {
                                        rules: [{ required: true }],
                                    })(
                                        <Upload name='file' className="w-100"
                                            action={apiUrl.UPLOAD_STRIPE_FILE} 
                                            onChange={this.uploadIDPhotoBack} disabled={this.state.idPhotoProvide ? true : this.state.backFile ? true : false} showUploadList={false}>
                                            <Button className="w-100" size={'large'} loading={this.state.backUploadLoading}
                                                disabled={this.state.idPhotoProvide ? true : this.state.backFile ? true : false}>
                                                {!this.state.backUploadLoading && <Icon type="upload" />} Upload a file
                                            </Button>
                                        </Upload>
                                    )
                                }
                                {
                                    this.state.backFile &&
                                    <div className="d-flex justify-content-lg-between align-items-center">
                                        <div><Icon type="link" className="mr-2"/><span>{this.state.backFile.name}</span></div>
                                        <div className="text-danger pointer" onClick={()=>{this.setState({backFile: null})}}><Icon type="delete" /></div>
                                    </div>
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

const StepThreeForm = Form.create({ name: "vendor_setting_billingmethod_stepthree" })( StepThree );


export default connect(mapStateToProps, {

})(StepThreeForm);
