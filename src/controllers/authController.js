import { Sequelize, where } from "sequelize"
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

            const data = await authServices.registerService(req.body)

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);
            return res.status(500).json({
                message: "Lỗi ở Server!",
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

            // res.cookie('jwt', data.data.access_token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
            //Khi httpOnly được đặt là true, cookie này sẽ chỉ có thể truy cập được bởi server thông qua HTTP và không thể truy cập từ JavaScript của client.
            //60 * 60 * 1000 bằng 3.600.000 mili giây, tức là cookie sẽ tồn tại trong 1 giờ kể từ khi được thiết lập.

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);

            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    },

    getAllUser: async (req, res) => {
        try {
            const data = await authServices.getAllUser()

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);
            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    },

    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id
            const data = await authServices.deleteService(userId)

            const statusCode = data.statusCode
            return res.status(statusCode).json({
                message: data.message,
                EC: data.EC,
                data: data.data
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);
            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    }
}

module.exports = AuthControler