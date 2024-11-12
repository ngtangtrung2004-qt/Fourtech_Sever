// import multer from "multer";
// import path from 'path'

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         if (file.mimetype === 'image/jpg' ||
//             file.mimetype === 'image/png' ||
//             file.mimetype === 'image/jpeg' ||
//             file.mimetype === 'image/webp') {
//             let uploadPath = path.join(__dirname, '../uploads/')
//             console.log(uploadPath);
//             callback(null, uploadPath)
//         } else {
//             callback(new Error("Ảnh chưa đúng định dạng .jpg, .png, jpeg, .webp"), false)
//         }
//     },
//     filename: (req, file, cb) => {
//         const newFileName = `${Date.now()}-${file.originalname}`
//         cb(null, newFileName)
//     }
// })

// const upload = multer({
//     storage: storage
// })

// export default upload

import multer from "multer";
import path from 'path'
import fs from "fs";


// Hàm upload nhận tham số folderName để tạo thư mục tải lên động
const upload = (folderName) => {
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            if (file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/webp') {
                // Tạo đường dẫn thư mục tải lên động
                const uploadPath = path.join(__dirname, `../uploads/${folderName}`);
                //tự động tạo thư mục nếu chưa có thư mục
                fs.mkdirSync(uploadPath, { recursive: true });
                callback(null, uploadPath)
            } else {
                callback(new Error("Ảnh chưa đúng định dạng .jpg, .png, jpeg, .webp"), false)
            }
        },
        filename: (req, file, cb) => {
            const newFileName = `${Date.now()}-${file.originalname}`
            cb(null, newFileName)
        }
    })

    return multer({
        storage: storage
    })
}

export const deleteImage = (__dirname, pathImage, image) => {
    let imagePath = path.join(__dirname, pathImage, image);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}


export default upload