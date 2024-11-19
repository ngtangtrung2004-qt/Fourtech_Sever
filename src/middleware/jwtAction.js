import jwt from 'jsonwebtoken'
require('dotenv').config()

// const white_lists = [
//     '/',
//     '/register',
//     '/login',
//     '/logout',
//     '/forgot-password',
//     '/reset-password',
//     '/brand',
//     '/brand/:id',
//     '/category',
//     '/category/:id',
//     '/product',
//     '/product/:id',
//     '/product/increase-view/:id',
//     '/contact'
// ]

export const createJWT = (payload) => {
    const secretKey = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPRIRES;
    let token = null;

    try {
        token = jwt.sign(payload, secretKey, { expiresIn: expiresIn })
    } catch (error) {
        console.log(error);
    }
    return token
}

export const verifyToken = (token) => {
    const secretKey = process.env.JWT_SECRET;
    let decoded = null;
    try {
        decoded = jwt.verify(token, secretKey);
    } catch (error) {
        console.log(error);
    }
    return decoded
}

export const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1]
    }
    return null
}

export const checkUserJWT = (req, res, next) => {
    // if (white_lists.includes(req.path)) return next();
    // let cookies = req.cookies;
    let tokenFormHeader = extractToken(req)
    //if (cookies && cookies.jwt) {
    if (tokenFormHeader) {
        let token = tokenFormHeader
        let decoded = verifyToken(token)
        if (decoded) {
            req.user = decoded
            req.token = token
            next()
        } else {
            return res.status(401).json({
                EC: -1,
                data: '',
                message: "Token không đúng hoặc hết hạn!"
            })
        }
    } else {
        return res.status(401).json({
            EC: -1,
            data: '',
            message: "Chưa xác thực người dùng      !"
        })
    }
}



export const checkUserPermission = (req, res, next) => {
    console.log("Requested Path:", req.path);
    // Nếu route có trong white_lists hoặc là '/account', không cần kiểm tra phân quyền
    // if (white_lists.includes(req.path) || req.path === '/account') {
    //     return next();
    // }
    if (req.user) {
        let role = req.user.role
        if (role === 'admin') {
            return next()
        } else {
            return res.status(401).json({
                EC: -1,
                data: '',
                message: "Bạn không có quyền truy cập!"
            })
        }
    } else {
        return res.status(401).json({
            EC: -1,
            data: '',
            message: "Chưa xác thực người dùng!"
        })
    }
}