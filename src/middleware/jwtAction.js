import jwt from 'jsonwebtoken'
require('dotenv').config()


export const createJWT = (payload) => {
    const secretKey = process.env.JWT_SECRET;
    let token = null;

    try {
        token = jwt.sign(payload, secretKey, { expiresIn: '2d' }) //sau 2 ngày sẽ không dùng được token này nữa 
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

// export const checkUserJWT = (req, res, next) => {
//     let cookies = req.cookies;

//     if (cookies && cookies.jwt) {
//         let token = cookies.jwt
//         let decoded = verifyToken(token)

//         if (decoded) {
//             req.user = decoded
//             next()
//         } else {
//             return res.status(401).json({
//                 EC: -1,
//                 data: '',
//                 message: "Người dùng chưa được xác thực"
//             })
//         }

//         console.log('my cookie>>>>', token);
//     } else {
//         return res.status(401).json({
//             EC: -1,
//             data: '',
//             message: "Người dùng chưa được xác thực"
//         })
//     }
// }

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