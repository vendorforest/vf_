import React from "react";
import { connect } from "react-redux";
import { Form, message, Button, Input } from "antd";
import { fetchUploadVideoPortfolio } from "../essential";



class AddVideo extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            pending: false,
        };
    }

    componentDidMount() {}

    uploadVideo = (e) => {

        e.preventDefault();

        this.props.form.validateFieldsAndScroll((error, value) => {

            if (!error) {

                if (this.state.loading) return;

                this.setState({loading: true})

                const params = {url: value.url}
        
                fetchUploadVideoPortfolio(params).then(data => {

                    this.setState({loading: false})

                    this.props.addPortfolio(data.data)
                    
                    this.props.toggle();

                    this.props.form.setFieldsValue({ url: '' });
        
                }).catch(error => { 

                    console.log(error)
        
                    this.setState({loading: false});
                    
                    message.error(error.message);
                })
                
            }
        });
    }
    
    render() {

        const { getFieldDecorator } = this.props.form;

        return (
            <div className="addemployee-stepone">
                <Form layout="vertical" onSubmit={this.uploadVideo}>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <Form.Item label="Youtube or Vimeo Video Url">
                                {
                                    getFieldDecorator("url", {

                                        initialValue: '', //solution

                                        rules: [{ required: true, message: "Please input video url.", type:'url' }],

                                    })(<Input placeholder="https://www.youtube.com/watch?v=xxxxxxx" name="url" size={"large"} />)

                                }
                            </Form.Item>
                        </div>
                        <div className="col-12 d-flex justify-content-end mb-5">
                            <Button onClick={this.props.toggle} className="mr-3" size="large">Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={this.state.loading} size="large">Upload</Button>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}


const AddVideoForm = Form.create({ name: "vendor_addportfolio_form" })(AddVideo);

export default connect(null, {})(AddVideoForm);
