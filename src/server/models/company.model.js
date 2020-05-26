import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    foundedYear: {
      type: String,
    },
    employeeCount: {
      type: Number,
    },
    overview: {
      type: String,
    },
    canTravel: {
      type: Number,
    },
    geoRange: {
      type: Number,
    },
    vatId: {
      type: String,
    },
    timeZone: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    address: {
      type: String,
    },
    isPubAddress: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

CompanySchema.post("init", function(doc) {
  // env.MODE === "development" && console.log("init hook", doc)
});

export default mongoose.model("company", CompanySchema);
