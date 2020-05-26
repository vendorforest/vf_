import React from "react";
import { connect } from "react-redux";
import { Form, message, Button } from "antd";
import { fetchUploadImagePortfolio } from "../essential";
import ReactCrop from 'react-image-crop';



class AddImage extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            pending: false,

            file: null,

            crop: {

                unit: '%',

                width: 100,

                aspect: 1 / 1,
            },
        };
    }

    componentDidMount() {}


    onImageLoaded = image => {

        this.imageRef = image;
    };
    

    onCropComplete = crop => {

        this.makeClientCrop(crop);
    };

    
    onCropChange = (crop, percentCrop) => {

        this.setState({ crop });
    };

    async makeClientCrop(crop) {

        if (this.imageRef && crop.width && crop.height) {

            const imageBlob = await this.getCroppedImg( this.imageRef, crop, "newFile.jpeg" );

            const file = new File([imageBlob], `${new Date().getTime()}`)

            this.setState({file: file})
        }
    }
    
    getCroppedImg(image, crop, fileName) {

        const canvas = document.createElement("canvas");

        const scaleX = image.naturalWidth / image.width;

        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width;

        canvas.height = crop.height;

        const ctx = canvas.getContext("2d");
    
        ctx.drawImage(

            image,

            crop.x * scaleX,

            crop.y * scaleY,

            crop.width * scaleX,

            crop.height * scaleY,

            0,

            0,

            crop.width,

            crop.height
        );
    
        return new Promise((resolve, reject) => {

            canvas.toBlob(blob => {

                if (!blob) {

                    //reject(new Error('Canvas is empty'));
                    console.error("Canvas is empty");

                    return;
                }

                resolve(blob);
                
            }, "image/jpeg");
        });
    }
    
    
    uploadImage = (e) => {

        e.preventDefault();

		if (this.state.loading) return;

        if (!this.state.file) return message.error('Please choose image file')
        
        this.setState({loading: true})

		fetchUploadImagePortfolio({file: this.state.file}).then(data => {

            this.setState({loading: false})

            this.props.addPortfolio(data.data)
            
            this.props.toggle();

		}).catch(error => { 

            this.setState({loading: false});
            
            message.error(error.message);
        })
    }
    
    cancel = () => {

        this.setState({ crop: {unit: '%', width: 100, aspect: 1 / 1}})

        this.props.toggle()
    }


    render() {

        return (
            <div className="add-portfolio-image">
                <Form layout="vertical" onSubmit={this.uploadImage}>
                    <div className="row">
                        <div className="col-12 mb-3 d-flex justify-content-center">
                            <ReactCrop
                                className="crop"
                                src={this.props.src}
                                crop={this.state.crop}
                                ruleOfThirds
                                onImageLoaded={this.onImageLoaded}
                                onComplete={this.onCropComplete}
                                onChange={this.onCropChange}
                            />
                        </div>
                        <div className="col-12 d-flex justify-content-end mb-5">
                            <Button onClick={this.cancel} className="mr-3" size="large">Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={this.state.loading} size="large">Upload</Button>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}


const AddImageForm = Form.create({ name: "vendor_addportfolio_form" })(AddImage);

export default connect(null, {})(AddImageForm);
