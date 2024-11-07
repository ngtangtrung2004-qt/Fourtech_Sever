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

export const veryfiToken = (token) => {
    const secretKey = process.env.JWT_SECRET;
    let data = null;
    try {
        let decoded = jwt.verify(token, secretKey);
        data = decoded
    } catch (error) {
        console.log(err);
    }
    return data
}

export const checkUserJWT = (req, res, next) => {
    let cookies = req.cookies;

    if (cookies && cookies.jwt) {
        console.log(cookies.jwt);
    }
    // console.log(cookies);

}