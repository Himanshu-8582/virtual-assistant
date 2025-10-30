import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    assistantName: {
        type: String,
    },
    assistantImage: {
        type: String,
    },
    history: [
        { type: String }
    ]

}, { timestamps: true });


const User = mongoose.model("User", userSchema);    // We create a model (Table) named "User" using the userSchema defined above.

export default User;  