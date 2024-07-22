import { check } from "express-validator"

export const validatePhoneNumber = () => {
    return [check("phoneNumber").notEmpty().withMessage("phone_number_is_required")]
}

export const logInValidator = () => {
    return [check("email").isEmail(), check("password").notEmpty()]
}

export const registerValidator = () => {
    return [
        check("first_name").notEmpty(),
        check("last_name").notEmpty(),
        check("email").isEmail(),
        check("phone").notEmpty(),
        check("password").notEmpty(),
    ]
}

export const createPresignedUrlValidator = () => {
    return [check("filename").notEmpty()]
}
