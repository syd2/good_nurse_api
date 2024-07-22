import { ErrorFormatter } from "express-validator"

export const errorFormatter = ({ msg, param, value }: any) => {
    return {
        name: param,
        message: msg,
        value: value,
    }
}
