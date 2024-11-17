import { where, Sequelize, Op } from 'sequelize';
import db from '../models'
import bcrypt, { genSaltSync } from 'bcrypt'
import { createJWT } from '../middleware/jwtAction';

const registerService = async (dataRegister) => {
    try {
        const checkEmail = async (email) => {
            let emailUser = await db.user.findOne({
                where: { email: email }
            })
            if (emailUser) {
                return true
            }
            return false
        }

        const checkPhone = async (phone) => {
            let phoneUser = await db.user.findOne({
                where: { phone: phone }
            })
            if (phoneUser) {
                return true
            }
            return false
        }

        let isEmailExist = await checkEmail(dataRegister.emailRegister);
        let isPhoneExist = await checkPhone(dataRegister.phoneRegister);

        if (isEmailExist == true) {
            return {
                message: "Email đăng ký đã tồn tại!!",
                EC: 1,
                data: '',
                statusCode: 409
            }
        } else if (isPhoneExist == true) {
            return {
                message: "Số điện thoại đăng ký đã tồn tại!",
                EC: 1,
                data: '',
                statusCode: 409
            }
        } else {
            const dataUser = await db.user.create({
                full_name: dataRegister.full_nameRegister,
                email: dataRegister.emailRegister,
                phone: dataRegister.phoneRegister,
                password: bcrypt.hashSync(dataRegister.passwordRegister, 10) //hashPassword mã hóa mật khẩu
            })

            return {
                message: "Đăng ký thành công.",
                EC: 0,
                data: '',
                statusCode: 200
            }
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);
        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            statusCode: 500
        }
    }
}

const loginService = async (dataLogin) => {
    try {
        const checkPassword = (inputPassword, hashPassword) => {
            return bcrypt.compareSync(inputPassword, hashPassword); //kiểm tra xem mật khẩu người dùng nhập vào có khớp với mật khẩu đã được mã hóa ko
        }

        const user = await db.user.findOne({
            where: {
                [Op.or]: [
                    { email: dataLogin.valueLogin },
                    { phone: dataLogin.valueLogin }
                ]
            }
        })

        if (user) {
            const isConrrectPassword = checkPassword(dataLogin.passwordLogin, user.password);

            if (isConrrectPassword == true) {
                let jwtToken = createJWT({
                    avatar: user.avatar,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role
                })
                return {
                    message: "Đăng nhập thành công.",
                    EC: 0,
                    data: {
                        access_token: jwtToken,
                        avatar: user.avatar,
                        full_name: user.full_name,
                        email: user.email,
                        role: user.role
                    },
                    statusCode: 200
                }
            } else {
                return {
                    message: "Email/Sđt hoặc mật khẩu không đúng!",
                    EC: 1,
                    data: '',
                    statusCode: 404
                }
            }

        } else {
            return {
                message: "Tài khoản chưa được đăng ký!",
                EC: 1,
                data: '',
                statusCode: 404
            }
        }

    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);
        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
        }
    }
}

const getAllUser = async () => {
    try {
        const data = await db.user.findAll({
            attributes: ['id', 'full_name', 'email', 'phone', 'role', 'created_at'],
            order: [
                ['created_at', 'DESC']  // Sắp xếp theo trường 'created_at' giảm dần (DESC)
            ]
        })

        return {
            message: "Lấy tất cả người dùng thành công.",
            EC: 0,
            data: data,
            statusCode: 200
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);
        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
        }
    }
}

const deleteService = async (id) => {
    try {
        const user = await db.user.findOne({
            where: {
                id: id
            }
        })
        if (user) {
            await user.destroy()
            return ({
                message: "Xóa tài khoản thành công.",
                EC: 0,
                data: '',
                statusCode: 200
            })
        } else {
            return ({
                message: "Xóa tài khoản thất bại!",
                EC: 1,
                data: '',
                statusCode: 500
            })
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);
        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
        }
    }
}

module.exports = {
    registerService,
    loginService,
    getAllUser,
    deleteService
}