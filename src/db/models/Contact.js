import { Schema, model } from "mongoose";

import { typeList } from "../../constants/contacts.js";
import { handleSaveError, setUpdateOptions } from "./hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      required: true,
      default: "personal",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    photo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateOptions);

contactSchema.post("findOneAndUpdate", handleSaveError);

const ContactCollection = model("contact", contactSchema);

export const sortFields = [
  "name",
  "phoneNumber",
  "email",
  "isFavourite",
  "contactType",
  "createdAt",
  "updatedAt",
];

export default ContactCollection;
