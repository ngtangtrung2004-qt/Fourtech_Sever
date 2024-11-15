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
                file.mimetype === 'image/gif' ||
                file.mimetype === 'image/webp') {
                // Tạo đường dẫn thư mục tải lên động
                const uploadPath = path.join(__dirname, `../uploads/${folderName}`);
                //tự động tạo thư mục nếu chưa có thư mục
                fs.mkdirSync(uploadPath, { recursive: true });
                callback(null, uploadPath)
            } else {
                callback(new Error("Chỉ chấp nhận các định dạng ảnh .jpg, .png, jpeg, .webp, .gif !!!!"), false)
            }
        },
        filename: (req, file, cb) => {
            const newFileName = `${Date.now()}-${file.originalname}`
            cb(null, newFileName)
        }
    })

    return multer({
        storage: storage,
        limits: {
            files: 5
        }
    })
}

export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Lỗi khi vượt quá số lượng tệp cho phép
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ message: 'Vượt quá số lượng ảnh cho phép (tối đa 5 ảnh)!' });
        }
        // Lỗi khi vượt quá kích thước tệp cho phép
        // if (err.code === 'LIMIT_FILE_SIZE') {
        //     return res.status(400).json({ message: 'Kích thước tệp vượt quá giới hạn (tối đa 5MB).' });
        // }
        // Lỗi khi có vấn đề với tệp
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ message: 'Vượt quá số lượng ảnh cho phép (tối đa 5 ảnh)!' });
        }
    }

    // Nếu lỗi không phải từ multer, hoặc không phải lỗi có mã xác định
    return res.status(400).json({ message: 'Đã xảy ra lỗi khi xử lý tệp.', error: err.message });
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý tệp.', error: err.message });
};


export const deleteImage = (__dirname, pathImage, images) => {
    if (!images) {
        console.warn("Không có hình ảnh nào được cung cấp để xóa.");
        return;
    }

    // Kiểm tra nếu images là mảng
    if (Array.isArray(images)) {
        images.forEach((singleImage) => {
            if (singleImage && typeof singleImage === 'string') {
                const imagePath = path.join(__dirname, pathImage, singleImage);
                if (fs.existsSync(imagePath)) {
                    try {
                        fs.unlinkSync(imagePath);
                        console.log(`Xóa: ${imagePath}`);
                    } catch (error) {
                        console.error(`Lỗi khi xóa ${imagePath}:`, error);
                    }
                } else {
                    console.warn(`Không tìm thấy tập tin: ${imagePath}`);
                }
            }
        });
    } else if (typeof images === 'string') {
        // Trường hợp images là một chuỗi, xử lý một ảnh
        const imagePath = path.join(__dirname, pathImage, images);
        if (fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath);
                console.log(`Xóa: ${imagePath}`);
            } catch (error) {
                console.error(`Lỗi khi xóa ${imagePath}:`, error);
            }
        } else {
            console.warn(`Không tìm thấy tập tin:: ${imagePath}`);
        }
    } else {
        console.warn("Kiểu không hợp lệ cho hình ảnh. Phải là một chuỗi hoặc một mảng các chuỗi.");
    }
};


export default upload