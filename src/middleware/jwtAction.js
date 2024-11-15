import jwt from 'jsonwebtoken'
require('dotenv').config()


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

export const auth = (req, res, next) => {
    const white_lists = ['/', '/register', '/login', '/category', '/brand', '/product','/forgot-password','/reset-password','/contact','/reply']
    console.log('check req>>>', req.originalUrl);
    if (white_lists.find(item => '/api' + item === req.originalUrl)) {
        next()
    } else {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                console.log('check Token>>>', decoded);
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "Token hết hạn hoặc không hợp lệ!",
                    data: '',
                    EC: 1
                })
            }
        } else {
            return res.status(401).json({
                message: "Bạn chưa truyền Access Token ở header / Hoặc Token bị hết hạn!",
                data: '',
                EC: -1
            })
        }
    }
}


// export const checkUserPermission = (req, res, next) => {
//     if(req.user) {
//         let email = req.user.email
//         let role = req.user.role
//     } else {
//         return res.status(401).json({
//             EC: -1,
//             data: '',
//             message: "Người dùng chưa được xác thực"
//         })
//     }
// }