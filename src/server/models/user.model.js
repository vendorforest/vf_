// @ts-nocheck
import mongoose from "mongoose";
import bcrypt from "mongoose-bcrypt";
import uniqueValidator from "mongoose-unique-validator";
import {constants} from '@Config/constants'

const UserSchema = new mongoose.Schema({
    
    firstName: {

        type: String,
    },

    lastName: {

        type: String,
    },

    username: {

        type: String,

        lowercase: true,

        required: [true, "can't be blank"],

        match: [/^[a-zA-Z0-9]+$/, "is invalid"],

        index: true,

        trim: true,

        unique: true,
    },

    email: {

        type: String,

        lowercase: true,

        required: [true, "can't be blank"],

        match: [/\S+@\S+\.\S+/, "is invalid"],

        index: true,

        trim: true,

        unique: true,
    },

    password: {

        type: String,

        required: true,

        bcrypt: true,
    },

    accountType: {

        type: Number,

        required: true,
    },

    isVerified: {

        type: Boolean,

        default: false,
    },

    isConfirmed: {

        type: Boolean,

        default: false,
    },

    rememberToken: {

        type: String,
    },

    profilePercent: {

        type: Number,

        default: 0,
    },

    subscriptionId: {

        type: String,
    },

    countryDialCode: {
        
        type: String,
    },

    phonePrefix: {
        
        type: String,
    },

    localPhoneNumber: {
        
        type: String,
    },

    phone: {
        
        type: String,
    },

    isRental: {

        type: Number,

        default: 0,
    },

    isTourguide: {

        type: Number,

        default: 0,
    },

    addressId: {
        
        type: Number,
    },

    profileImage: {
        
        type: String,

        default: constants.DEFAULT_PROFILE_PHOTO
    }, 

    deletedAt: {
        
        type: String,
    },

    addressDataId: {
        
        type: Number,
    },

    bsLocation: {

        country: {
            
            type: String,
        },

        state: {

            type: String,
        }, 

        city: {
            
            type: String,
        },

        fullAddress: {

            type: String,
        },

        lat: {
            
            type: Number,
        },

        lng: {
            
            type: Number,
        },

        placeId: {

            type: String,
        }
    },

    timeZone: {

        type: String,
    },

    client: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "client",
    },

    vendor: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "vendor",
    },

    currentLocation: {

        ipAddress: {

            type: String,
        },

        country: {
            
            type: String,
        },

        state: {
            
            type: String,
        },

        city: {
            
            type: String,
        },

        lat: {
            
            type: Number,
        },

        lng: {
            
            type: Number,
        }
    },
}, {

    timestamps: true,
}, );

UserSchema.pre("findOneAndUpdate", function (next) {

    if (!this._update.recoveryCode) return next();
});

UserSchema.plugin(bcrypt, {

    rounds: 8,
});

UserSchema.plugin(uniqueValidator, {

    message: "is already taken.",
});

UserSchema.index({

    email: 1,
    
    username: 1,
}); // compound index on email + username

export default mongoose.model("user", UserSchema);