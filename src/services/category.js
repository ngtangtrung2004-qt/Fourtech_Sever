import { where } from "sequelize";
import db from "../models"
import path from 'path'
import fs from 'fs'
import { deleteImage } from "../middleware/multer";

const getAllCategory = async () => {
    try {
        const data = await db.category.findAll({
            attributes: ['id', 'name', 'image', 'created_at', 'updated_at'],
            order: [
                ['created_at', 'DESC']
            ]
        })

        return {
            EC: 0,
            message: "Lấy tất cả danh mục thành công.",
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

const postCategory = async (categoryData) => {
    try {
        const { categoryName, categoryImage } = categoryData;
        if (!categoryName || categoryName.trim() === "") {
            if (categoryImage) {
                deleteImage(__dirname, '../uploads/category/', categoryImage);  // Xóa ảnh nếu có
            }
            return {
                message: "Tên danh mục không được để trống!",
                EC: 1,
                data: '',
                statusCode: 400
            };
        }

        // Kiểm tra nếu chưa chọn hình ảnh
        if (!categoryImage) {
            return {
                message: "Chưa chọn hình ảnh!",
                EC: 1,
                data: '',
                statusCode: 400
            };
        }

        // Kiểm tra tên danh mục có tồn tại không
        const checkCategoryName = await db.category.findOne({
            where: { name: categoryName }
        });

        if (checkCategoryName) {
            if (categoryImage) {
                deleteImage(__dirname, '../uploads/category/', categoryImage);
            }
            return {
                EC: 1,
                message: "Tên danh mục đã tồn tại!",
                data: '',
                statusCode: 409
            };
        }

        const data = await db.category.create({
            name: categoryName,
            image: 'category/' + categoryImage,  // Lưu đường dẫn ảnh
        });

        return {
            message: "Thêm danh mục thành công.",
            EC: 0,
            data: data,
            statusCode: 200
        };
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        // Nếu có lỗi trong quá trình tạo danh mục, xóa ảnh đã tải lên
        const { categoryImage } = categoryData;
        if (categoryImage) {
            deleteImage(__dirname, '../uploads/category/', categoryImage);
        }

        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
        };
    }
}

const putCategory = async (categoryEditData) => {
    try {
        const { id, categoryName, categoryImage } = categoryEditData;
        // Tìm danh mục theo ID
        let idCategory = await db.category.findOne({
            where: { id: id }
        });

        if (!categoryName) {
            deleteImage(__dirname, '../uploads/category/', categoryImage)
            return {
                EC: 1,
                message: "Tên danh mục không được bỏ trống!",
                data: '',
                statusCode: 400
            }
        }

        if (idCategory) {
            // Kiểm tra xem tên danh mục đã tồn tại trong cơ sở dữ liệu chưa
            let nameExists = await db.category.findOne({
                where: { name: categoryName, id: { [db.Sequelize.Op.ne]: id } }
            });

            if (nameExists) {
                deleteImage(__dirname, '../uploads/category/', categoryImage);
                return {
                    message: 'Danh mục này đã tồn tại!',
                    EC: 1,
                    data: '',
                    statusCode: 409
                };
            }

            // Cập nhật danh mục với tên và ảnh mới (nếu có)
            const updatedCategory = await db.category.update(
                {
                    name: categoryName,
                    image: categoryImage ? `category/${categoryImage}` : idCategory.image
                },
                {
                    where: { id: idCategory.id }
                }
            );

            if (categoryImage && categoryImage !== idCategory.image) {
                deleteImage(__dirname, '../uploads/', idCategory.image)
            }

            return {
                message: 'Cập nhật danh mục thành công!',
                EC: 0,
                data: updatedCategory,
                statusCode: 200
            };
        } else {
            return {
                message: 'Danh mục không tồn tại!',
                EC: 1,
                data: '',
                statusCode: 404
            };
        }

    } catch (error) {
        const { categoryImage } = categoryEditData;
        deleteImage(__dirname, '../uploads/category/', categoryImage)

        console.log('CÓ LỖI TRONG SERVICE >>>', error);
        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
        };
    }
};


const deleteCategory = async (id) => {
    try {

        const product = await db.product.findAll({
            where: { category_id: id }
        })

        if (product.length > 0) {
            return {
                message: "Không thể xóa danh mục này vì liên quan đến sản phẩm!",
                data: '',
                EC: -1,
                statusCode: 409
            }
        }

        // Tìm danh mục trong cơ sở dữ liệu
        const category = await db.category.findOne({
            where: {
                id: id
            }
        });

        if (category) {
            // Lấy tên tệp hình ảnh

            const categoryImage = category.image;
            deleteImage(__dirname, '../uploads/', categoryImage)

            if (categoryImage) {
                try {
                    console.log("Tệp hình ảnh đã được xóa.");
                } catch (err) {
                    console.log("Lỗi khi xóa tệp hình ảnh hoặc tệp không tồn tại:", err);
                    return {
                        message: "Lỗi khi xóa tệp hình ảnh hoặc tệp không tồn tại!",
                        data: '',
                        EC: -1,
                        statusCode: 404
                    }
                }
            }

            // Xóa danh mục khỏi cơ sở dữ liệu
            await category.destroy({
                where: { id: id }, // Sửa lại để xóa sản phẩm bằng id
                force: true
            });

            return {
                message: "Xóa danh mục thành công.",
                EC: 0,
                data: category,
                statusCode: 200
            };
        } else {
            return {
                message: "Danh mục không tồn tại!",
                EC: 1,
                data: '',
                statusCode: 404
            };
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);
        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
        };
    }
};


module.exports = {
    getAllCategory,
    postCategory,
    deleteCategory,
    putCategory
}