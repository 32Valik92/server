import express from 'express';
import mongoose from "mongoose";
import multer from 'multer'
import cors from 'cors'

import {loginValidation, postCreateValidation, registerValidation} from './validation.js'

import checkAuth from './utils/checkAuth.js'
import {getMe, login, register} from "./controllers/UserController.js";
import {create, getAll, getLastTags, getOne, remove, update} from "./controllers/PostController.js";
import * as fs from "fs";
import {handleValidationErrors} from "./utils/handleValidationErrors.js";

const DB_URL = 'mongodb+srv://node1:node1@node1.l876je4.mongodb.net/articleProject'
mongoose
    .connect(process.env.DB_URL || DB_URL)
    .then(() => {
        console.log("DB ok")
    }).catch((err) => {
    console.log('DB error', err)
});
const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json()); // We can read json format
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.post('/auth/login', loginValidation, handleValidationErrors, login)
app.post('/auth/register', registerValidation, handleValidationErrors, register)
app.get('/auth/me', checkAuth, getMe)

app.get('/tags', getLastTags)

app.get('/posts', getAll)
app.get('/posts/:id', getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, update)

const PORT = process.env.PORT || 4444;
app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Ok')
});