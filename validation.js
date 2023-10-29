import { body } from 'express-validator';

const registerValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('fullName', 'Enter your name').isLength({ min: 3 }),
    body('avatarUrl', 'Invalid link to avatar').optional().isURL(),
];

const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
    body('tags', 'Неверный формат тэгов').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

export {
    registerValidation,
    loginValidation,
    postCreateValidation
}