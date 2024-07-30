const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const registrationSchema = new Schema(
  {
    registration_number: {
        type: Number,
        unique: true
    },
    name: {
      type: String,
    },
    contact_number: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    age: {
      type: Number,
    },
    aadhar_front: {
        type: String
    },
    aadhar_back: {
        type: String
    },
    number_of_person_associated: {
        type: Number
    },
    state: {
        type: String
    },
    district: {
        type: String
    },
    additional_persons_data: [
      {
          name: String,
          registration_number: String
      }
  ],
  registration_number: String
  },
  {
    timestamps: {
      created_at: "created_at",
      updated_at: "updated_at",
    },
  }
);

const registration = mongoose.model("registration", registrationSchema);

module.exports = { registration };
