import {model, Schema} from "mongoose";

const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            unique: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        imageURL: String,
    },
    {
        timestamps: true,
    },
);

export const Post = model("Post", PostSchema);