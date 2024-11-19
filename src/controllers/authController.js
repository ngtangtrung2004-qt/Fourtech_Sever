import { Sequelize, where } from "sequelize"
const bcrypt = require('bcrypt');
import db from '../models'
import * as authServices from "../services/auth.js"
import { token } from "morgan";
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Đảm bảo đường dẫn đúng
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

            if (data && data.data && data.data.access_token) {
                res.cookie('jwt', data.data.access_token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
            }

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
