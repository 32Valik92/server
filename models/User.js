import {model, Schema} from "mongoose";

const UserSchema = new Schema({
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Only one example email for DB
        },
        password: {
            type: String,
            required: true,
        },
        avatarURL: {
            type: String,
            default: "",
        }

    },
    {
        timestamps: true,
    });

export const User = model("User", UserSchema);
