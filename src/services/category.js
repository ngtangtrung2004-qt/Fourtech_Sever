import { where } from "sequelize";
import db from "../models"
import path from 'path'
import fs from 'fs'
import { deleteImage } from "../config/configMulter";

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

        if (!categoryName || !categoryImage) {
            deleteImage(__dirname, '../uploads/category/', categoryImage)
            return {
                EC: 1,
                message: "Tên danh mục không được bỏ trống!",
                data: '',
                statusCode: 400
            }
        }
        if (!categoryImage) {
            deleteImage(__dirname, '../uploads/category/', categoryImage)
            return {
                EC: 1,
                message: "Chưa chọn hình ảnh!",
                data: '',
                statusCode: 400
            }
        }

        const checkCategoryName = async () => {
            let nameCategory = await db.category.findOne({
                where: { name: categoryName }
            })
            if (nameCategory) {
                return true
            }
            return false
        }

        let isNameCategoryExist = await checkCategoryName(categoryName)

        if (isNameCategoryExist) {

            deleteImage(__dirname, '../uploads/category/', categoryImage)

            return {
                EC: 1,
                message: "Tên danh mục đã tồn tại!",
                data: '',
                statusCode: 409
            };
        } else {
            const data = await db.category.create({
                name: categoryName,
                image: 'category/' + categoryImage
            })
            return {
                message: "Thêm danh mục thành công.",
                EC: 0,
                data: data,
                statusCode: 200
            }
        }

    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        const { categoryImage } = categoryData;
        deleteImage(__dirname, '../uploads/category/', categoryImage)

        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
        }
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

        if (!categoryImage) {
            deleteImage(__dirname, '../uploads/category/', categoryImage)

            return {
                EC: 1,
                message: "Phải có hình ảnh!",
                data: '',
                statusCode: 400
            }
        }


        if (idCategory) {
            // Kiểm tra xem tên danh mục đã tồn tại trong cơ sở dữ liệu chưa
            let nameExists = await db.category.findOne({
                where: { name: categoryName }
            });

            if (nameExists) {
                deleteImage(__dirname, '../uploads/category/', categoryImage);
                return {
                    message: 'Thương hiệu này đã tồn tại!',
                    EC: 1,
                    data: '',
                    statusCode: 409
                };
            }

            // Cập nhật danh mục với tên và ảnh mới (nếu có)
            const updatedCategory = await db.category.update(
                {
                    name: categoryName,
                    image: categoryImage ? `category/${categoryImage}` : idCategory.image // nếu không có ảnh mới thì giữ ảnh cũ
                },
                {
                    where: { id: idCategory.id }
                }
            );

            deleteImage(__dirname, '../uploads/', idCategory.image)

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
            await category.destroy();

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