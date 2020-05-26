import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({

    _id: {
        
        type: mongoose.Schema.Types.ObjectId,
    },

    jobCompletedRate: {

        type: Number,

        default: 0,
    },

    rate: {

        type: Number,

        default: 0,
    },

    jobs: {

        type: Number,

        default: 0,
    },

    hoursWorked: {

        type: Number,

        default: 0,
    },

    totalEarning: {

        type: Number,

        default: 0,
    },

    hourlyRate: {

        type: Number,

        default: 30.0,
    },

    billingMethod: {

        type: Number,

        default: 0,
    },
    
    connectedAccountId: {

        type: String,
    },

    cardId: {

        type: String
    },

    notification: {

        _id: false,

        showNotification: {

            type: Number,

            default: 0,

        },

        increaseMsg: {

            type: Number,

            default: 0,
        },

        emailUnread: {

            type: Number,

            default: 0,
        },

        emailUnreadTime: {

            type: Number,

            default: 0,
        },

        offlineNoti: {

            type: Boolean,

            default: false,
        },

        pushNoties: [{

            type: Number,

        }],

        emailMe: [{

            type: Number,
        }],
    },

    successRate: {

        type: Number,

        default: 0,
    },

    reviewCount: {

        type: Number,

        default: 0,
    },

    company: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "company",
    },

    service: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "service",
    },

    category: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "category",
    },

    subCategories: [{

        type: String,
    }],
}, {

    versionKey: false,

    timestamps: true,
});

VendorSchema.post("init", function (doc) {
    // env.MODE === "development" && console.log("init hook", doc)
});

export default mongoose.model("vendor", VendorSchema);