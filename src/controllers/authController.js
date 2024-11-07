import { Sequelize } from "sequelize"
import db from '../models'
import * as authServices from "../services/auth.js"

const AuthControler = {
    handleRegsiter: async (req, res) => {
        try {
            const { full_nameRegister, emailRegister, phoneRegister, passwordRegister } = req.body
            if (!full_nameRegister || !emailRegister || !phoneRegister || !passwordRegister) {
                return res.status(400).json({ message: "Thiếu tham số bắt buộc!" })
            }

            if (passwordRegister.length < 3) {
                return res.status(400).json({ message: "Mật khẩu phải trên 3 ký tự!" })
            }

            const data = await authServices.registerServies(req.body)
            return res.status(200).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            return res.status(500).json({
                message: "Lỗi ở Server!", //error massage
                EC: -1
            })
        }
    },

    handleLogin: async (req, res) => {
        try {
            const { valueLogin, passwordLogin } = req.body
            if (!valueLogin || !passwordLogin) {
                return res.status(400).json({ message: "Thiếu tham số bắt buộc!" })
            }

            const data = await authServices.loginService(req.body)

            return res.status(200).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                message: "Lỗi ở Server!", //error massage
                EC: -6
            })
        }
    }
}

module.exports = AuthControler