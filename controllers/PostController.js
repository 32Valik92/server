import {Post} from "../models/Post.js";

const getLastTags = async (req, res) => {
    try {
        const posts = await Post.find().limit(5).exec();

        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить тэги',
        });
    }
};

const getAll = async (req, res) => {
    try {
        const posts = await Post.find().populate('user').exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await Post.findOneAndUpdate(
            {_id: postId},
            {$inc: {viewsCount: 1}},
            {returnDocument: 'after'}
        ).populate('user');

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью',
        });
    }
};

const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await Post.findOneAndDelete({_id: postId});

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

const create = async (req, res) => {
    try {
        const doc = new Post({
            title: req.body.title,
            text: req.body.text,
            imageURL: req.body.imageURL,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await Post.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};

export {
    getLastTags,
    getAll,
    getOne,
    remove,
    create,
    update
}