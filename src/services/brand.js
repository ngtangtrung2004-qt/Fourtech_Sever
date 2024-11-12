import { where } from "sequelize";
import db from "../models";
import path from 'path'
import fs from 'fs'
import { deleteImage } from "../config/configMulter";

const getAllBrand = async () => {
    try {
        let data = await db.brand.findAll({
            attributes: ['id', 'name', 'logo', 'created_at', 'updated_at'],
            order: [
                ['created_at', 'DESC']
            ]
        })
        return {
            EC: 0,
            message: "Lấy tất cả thương hiệu thành công.",
            data: data
        }
    } catch (error) {
        console.log(error);
        return {
            EC: -1,
            message: "Lỗi trong Service!",
            data: ''
        }
    }
}

const postBrand = async (brandData) => {
    try {
        const { brandName, brandImage } = brandData;

        if (!brandName || !brandImage) {
            deleteImage(__dirname, '../uploads/brand/', brandImage)
            return {
                message: "Thiếu tham số bắt buộc!",
                EC: 1,
                data: ''
            }
        }
        const checkBrandName = async () => {
            let nameBrand = await db.brand.findOne({
                where: { name: brandName }
            })
            if (nameBrand) {
                return true
            }
            return false
        }

        let isnameBrandExist = await checkBrandName(brandName)

        if (isnameBrandExist) {
            // Xóa tệp ảnh nếu đã được tải lên trước khi kiểm tra
            deleteImage(__dirname, '../uploads/brand/', brandImage)

            return {
                EC: 1,
                message: "Tên thương hiệu đã tồn tại!",
                data: ''
            };
        } else {
            const data = await db.brand.create({
                name: brandName,
                logo: 'brand/' + brandImage
            })
            return {
                message: "Thêm thương hiệu thành công.",
                EC: 0,
                data: data
            }
        }

    } catch (error) {
        console.log(error);
        const { brandImage } = brandData;
        deleteImage(__dirname, '../uploads/brand/', brandImage)
        return {
            message: "Có lỗi trong service!",
            EC: -1,
            data: ''
        }
    }
}

const putBrand = async (brandEditData) => {
    try {
        const { id, brandName, brandImage } = brandEditData;

        if (!brandName || !brandImage) {
            deleteImage(__dirname, '../uploads/brand/', brandImage)
            return {
                message: "Thiếu tham số bắt buộc!",
                EC: 1,
                data: ''
            }
        }

        // Tìm thương hiệu theo ID
        let idBrand = await db.brand.findOne({
            where: { id: id }
        });

        if (idBrand) {
            // Kiểm tra xem tên thương hiệu đã tồn tại trong cơ sở dữ liệu chưa
            let nameExists = idBrand.name;

            // Nếu tên thương hiệu đã tồn tại và không phải là thương hiệu hiện tại
            if (nameExists && nameExists.id !== idBrand.id) {
                deleteImage(__dirname, '../uploads/brand/', brandImage)
                return {
                    message: 'Thương hiệu này đã tồn tại!',
                    EC: 1,
                    data: ''
                };
            }

            // Cập nhật thương hiệu với tên và ảnh mới (nếu có)
            const updatedbrand = await db.brand.update(
                {
                    name: brandName,
                    logo: brandImage ? `brand/${brandImage}` : idBrand.logo // nếu không có ảnh mới thì giữ ảnh cũ
                },
                {
                    where: { id: idBrand.id }
                }
            );

            //Xóa ảnh cũ trong thư mục uploads khi update ảnh mới
            deleteImage(__dirname, '../uploads/', idBrand.logo)

            return {
                message: 'Cập nhật thương hiệu thành công!',
                EC: 0,
                data: updatedbrand
            };
        } else {
            return {
                message: 'Thương hiệu không tồn tại!',
                EC: 1,
                data: ''
            };
        }

    } catch (error) {
        console.log(error);

        const { brandImage } = brandEditData;
        deleteImage(__dirname, '../uploads/brand/', brandImage)

        return {
            message: 'Có lỗi xảy ra trong quá trình cập nhật!',
            EC: -1,
            data: ''
        };
    }
};

const deleteBrand = async (id) => {
    try {
        // Tìm thương hiệu trong cơ sở dữ liệu
        const brand = await db.brand.findOne({
            where: {
                id: id
            }
        });

        if (brand) {
            // Lấy tên tệp hình ảnh
            const brandImage = brand.logo;

            if (brandImage) {
                try {
                    deleteImage(__dirname, '../uploads', brandImage)
                } catch (err) {
                    console.log("Lỗi khi xóa tệp hình ảnh hoặc tệp không tồn tại:", err);
                }
            }

            // Xóa thương hiệu khỏi cơ sở dữ liệu
            await brand.destroy();

            return {
                message: "Xóa thương hiệu thành công.",
                EC: 0,
                data: brand
            };
        } else {
            return {
                message: "Thương hiệu không tồn tại.",
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
    getAllBrand,
    postBrand,
    putBrand,
    deleteBrand
}