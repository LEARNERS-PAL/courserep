import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    number: {
        type: String,
        required: [true, "Please add a phone number"],
    },
    email: {
        type: String,
    }
}, { timestamps: true})

export default mongoose.models.User || mongoose.model("User", UserSchema);