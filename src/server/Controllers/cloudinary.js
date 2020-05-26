
import cloudinary from 'cloudinary'

cloudinary.v2.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    api_key: process.env.CLOUDINARY_API_KEY,

    api_secret: process.env.CLOUDINARY_SECRET_KEY,

})



export default () => {

    const controller = {};

    controller.upload = async (file, public_id, next) => {

        try {

            return await cloudinary.v2.uploader.upload(file.path, { resource_type: 'auto', public_id:  public_id})
    
        } catch (error) {
    
            return next(error)
        }
    
    }
    
    return controller
}