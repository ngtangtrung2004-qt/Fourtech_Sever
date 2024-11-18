import { Sequelize, where } from "sequelize"
const bcrypt = require('bcrypt');
import db from '../models'
import * as authServices from "../services/auth.js"
import { token } from "morgan";
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Đảm bảo đường dẫn đúng
const { Op } = require('sequelize');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

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

            // if (data && data.data && data.data.access_token) {
            //     // Lấy thời gian hiện tại
            //     const currentDate = new Date();
            //     // Cộng thêm 1 ngày vào thời gian hiện tại
            //     currentDate.setDate(currentDate.getDate() + 1);
            //     res.cookie('jwt', data.data.access_token, { httpOnly: true, expires: currentDate })
            // }

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
    },
    forgotPassword: async (req, res) => {
        const { email } = req.body;
        console.log(email)
        try {
            const user = await db.user.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'Email không tồn tại.' });
            }

            // Tạo token ngẫu nhiên và thời gian hết hạn
            const token = crypto.randomBytes(32).toString('hex');
            const expiration = new Date(Date.now() + 3600000);; // Hết hạn sau 1 giờ
            console.log('date:', expiration)

            user.reset_token = token;
            user.reset_token_expiration = expiration;
            await user.save();

            // Gửi email với liên kết đặt lại mật khẩu
            const resetLink = `${process.env.URL_CLIENT}/reset-password/${token}`;
            await transporter.sendMail({
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: 'Đặt lại mật khẩu',
                text: `Nhấp vào liên kết sau để đặt lại mật khẩu: ${resetLink}`,
            });

            res.json({ message: 'Email đặt lại mật khẩu đã được gửi.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi khi yêu cầu đặt lại mật khẩu.' });
        }
    },
    resetPassword: async (req, res) => {
        const { token, newPassword } = req.body;
        console.log('token', token)
        try {
            const user = await db.user.findOne({
                where: {
                    reset_token: token,
                    reset_token_expiration: { [Op.gt]: Date.now() },
                },
            });

            if (!user) {
                return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.reset_token = null;
            user.reset_token_expiration = null;
            await user.save();

            res.json({ message: 'Mật khẩu đã được đặt lại thành công.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi khi đặt lại mật khẩu.' });
        }
    }
}

module.exports = AuthControler
