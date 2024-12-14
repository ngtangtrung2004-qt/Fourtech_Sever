const bcrypt = require('bcrypt');
import * as authServices from "../services/auth.js"
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const { Op } = require('sequelize');

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

    handleLogout: (req, res) => {
        try {
            res.clearCookie('jwt')
            return res.status(200).json({
                message: "Đăng xuất thành công.",
                EC: 0,
                data: ''
            })
        } catch (error) {
            console.log('CÓ LỖI TRONG SERVER >>>', error);

            return res.status(500).json({
                message: "Lỗi ở Server!",
                EC: -1
            })
        }
    },

    getAccount: (req, res) => {
        console.log('check req.user>>>>> ', req.user);
        console.log('check req.token>>>>', req.token);
        if (!req.user) {
            return res.status(401).json({
                EC: 1,
                message: "Unauthorized access. Please log in."
            });
        }
        return res.status(200).json({
            EC: 0,
            data: {
                token: req.token,
                full_name: req.user.full_name,
                email: req.user.email,
                avatar: req.user.avatar,
                role: req.user.role
            }
        })
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

    getOneUser: async (req, res) => {
        try {
            const idUser = req.params.id
            const data = await authServices.getOneUser(idUser)

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

    putUser: async (req, res) => {
        try {
            const idUser = req.params.id
            const { gender, address } = req.body
            const avatar = req.file ? req.file.filename : null

            const data = await authServices.putUser({ idUser, avatar, gender, address })

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

    putUserRole: async (req, res) => {
        try {
            const idUser = req.params.id
            const { role } = req.body

            const data = await authServices.putUserRole({ idUser, role })

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
