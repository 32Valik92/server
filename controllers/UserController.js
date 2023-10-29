import bcrypt from "bcrypt";
import {User} from "../models/User.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    try {
        const passwordBody = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(passwordBody, salt);

        const doc = new User({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            password: hash,
        });

        const user = await doc.save();

        const token = await jwt.sign({
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d'
            },
        );

        const {password, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'не зареєструватися',
        })
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'Нема такого користувача',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.password)

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Непавильний логін або пароль',
            });
        }

        const token = await jwt.sign({
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d'
            },
        );

        const {password, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'не авторизувався',
        })
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'нема такого користувача'
            })
        }
        const {password, ...userData} = user._doc

        res.json({
            ...userData
        })
    } catch (e) {

    }
}

export {
    register,
    login,
    getMe
}