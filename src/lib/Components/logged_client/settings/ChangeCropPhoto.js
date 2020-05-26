import React from "react";
import { connect } from "react-redux";
import { Button, message } from "antd";
import { updateUser, fetchUploadPhoto } from "./essential";
import {updateLoginUser} from '@Components/login/essential'
import ReactCrop from 'react-image-crop';
import { constants} from '@Shared/constants'


class ChangeCropPhoto extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            pending: false,

            file: null,

            src: null,

            crop: {

                unit: '%',

                width: 100,

                aspect: 1 / 1,
            },
        };

        this.photoRef = React.createRef()
    }

    componentDidMount() {

        this.setState({src: this.props.src})
    }

    componentDidUpdate(prevProps, prevState){

        if (prevProps.src !== this.props.src) this.setState({src: this.props.src})
    }

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

                    return;
                }

                resolve(blob);
                
            }, "image/jpeg");
        });
    }
    
    
    uploadImage = () => {

        if (this.state.loading || this.state.src === constants.DEFAULT_PROFILE_PHOTO) return;

        if (!this.state.file) return message.error('Please choose image file')
        
        this.setState({loading: true})

		fetchUploadPhoto({file: this.state.file}).then(data => {

            this.setState({loading: false})

            const newUser = {...this.props.user}

            console.log(this.props.user)

            newUser.profileImage = data.data

            this.props.toggle();

            this.props.updateUser(newUser)

            console.log(newUser)

            this.props.updateLoginUser(newUser)

		}).catch(error => { 

            this.setState({loading: false});
            
            message.error(error.message);
        })
    }
    
    cancel = () => {

        this.setState({ crop: {unit: '%', width: 100, aspect: 1 / 1}})

        this.props.toggle()
    }

    changePhoto = (e) => {

        if (e.target.files && e.target.files.length > 0) {

			const reader = new FileReader();

			reader.addEventListener("load", () => {

                this.setState({ src: reader.result });
			});

			reader.readAsDataURL(e.target.files[0]);

			e.target.value = null;
		}
    }


    render() {

        return (
            <div className="crop-photo">
                    <div className="row">
                        <div className="col-12 mb-3 d-flex justify-content-center">
                            <ReactCrop
                                className="crop"
                                src={this.state.src}
                                crop={this.state.crop}
                                ruleOfThirds
                                locked={this.state.src === constants.DEFAULT_PROFILE_PHOTO}
                                crossorigin='anonymous'
                                onImageLoaded={this.onImageLoaded}
                                onComplete={this.onCropComplete}
                                onChange={this.onCropChange}
                            />
                        </div>
                        <div className="col-12 d-flex justify-content-end mb-5">
                            <input type="file" id="file" name="file" hidden ref={this.photoRef} onChange={this.changePhoto}/>
                            <Button onClick={this.cancel} className="mr-3" size="large">Cancel</Button>
                            <Button type="primary" onClick={()=>{this.photoRef.current.click()}} className="mr-3" size="large">Change Photo</Button>
                            <Button type="primary" onClick={this.uploadImage} htmlType="submit" loading={this.state.loading} size="large">Crop & Upload</Button>
                        </div>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = ({ clientSettingsReducer }) => {

	const { error, user} = clientSettingsReducer;

	return { error, user };
};


export default connect(mapStateToProps, {updateUser, updateLoginUser})(ChangeCropPhoto);
