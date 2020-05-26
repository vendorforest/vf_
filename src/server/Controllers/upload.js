import * as multer from 'multer';
import getEnv, { constants } from "@Config/index";
const env = getEnv();

export default () => {

    const controllers = {};

    controllers.fileUpload = multer({

        storage: multer.diskStorage({
    
            destination: (req, file, cb) => {

                cb(null, `${env.DOC_ROOT}/upload`);
            },

            filename: (req, file, cb) => {

                const filename = file.originalname;
                
                cb(null, filename);
            }
        }),
    
        limits: {
    
            fileSize: 4096 * 4096, files: 1,
        }
    
    }).single('file');
    
    return controllers
}