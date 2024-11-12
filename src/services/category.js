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
            data: data
        }

    } catch (error) {
        console.log(error);
        return {
            message: "Có lỗi trong service!",
            EC: -1,
            data: ''
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
                message: "Thiếu tham số bắt buộc!",
                data: ''
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
                data: ''
            };
        } else {
            const data = await db.category.create({
                name: categoryName,
                image: 'category/' + categoryImage
            })
            return {
                message: "Thêm danh mục thành công.",
                EC: 0,
                data: data
            }
        }

    } catch (error) {
        console.log(error);

        const { categoryImage } = categoryData;
        deleteImage(__dirname, '../uploads/category/', categoryImage)

        return {
            message: "Có lỗi trong service!",
            EC: -1,
            data: ''
        }
    }
}

const putCategory = async (categoryEditData) => {
    try {
        const { id, categoryName, categoryImage } = categoryEditData;

        if (!categoryImage || !categoryName) {
            deleteImage(__dirname, '../uploads/category/', categoryImage)

            return {
                EC: 1,
                message: "Thiếu tham số bắt buộc!",
                data: ''
            }
        }

        // Tìm danh mục theo ID
        let idCategory = await db.category.findOne({
            where: { id: id }
        });

        if (idCategory) {
            // Kiểm tra xem tên danh mục đã tồn tại trong cơ sở dữ liệu chưa
            let nameExists = await db.category.findOne({
                where: { name: categoryName }
            });

            // Nếu tên danh mục đã tồn tại và không phải là danh mục hiện tại
            if (nameExists && nameExists.id !== idCategory.id) {
                return {
                    message: 'Danh mục này đã tồn tại!',
                    EC: 1,
                    data: ''
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
                data: updatedCategory
            };
        } else {
            return {
                message: 'Danh mục không tồn tại!',
                EC: 1,
                data: ''
            };
        }

    } catch (error) {
        const { categoryImage } = categoryEditData;
        deleteImage(__dirname, '../uploads/category/', categoryImage)
        console.log(error);
        return {
            message: 'Có lỗi xảy ra trong quá trình cập nhật!',
            EC: -1,
            data: ''
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

            // Xóa danh mục khỏi cơ sở dữ liệu
            await category.destroy();

            return {
                message: "Xóa danh mục thành công.",
                EC: 0,
                data: category
            };
        } else {
            return {
                message: "Danh mục không tồn tại.",
                EC: 1,
                data: ''
            };
        }
    } catch (error) {
        console.log(error);
        return {
            message: "Có lỗi trong service!",
            EC: -1,
            data: ''
        };
    }
};

module.exports = {
    getAllCategory,
    postCategory,
    deleteCategory,
    putCategory
}