import { where } from "sequelize";
import db from "../models";
import path from 'path'
import fs from 'fs'
import { deleteImage } from "../config/configMulter";

const getAllBrand = async () => {
    try {
        let data = await db.brand.findAll({
            attributes: ['id', 'name', 'logo', 'category_id', 'created_at', 'updated_at'],
            order: [
                ['created_at', 'DESC']
            ],
            include: {
                model: db.category,
                as: 'category',  // Đảm bảo alias 'category' trùng với alias trong phương thức associate
                attributes: ['id', 'name']  // Chỉ lấy tên của danh mục
            }
        })
        // Định dạng lại dữ liệu trước khi trả về
        const formattedData = data.map(brand => {
            return {
                id: brand.id,
                name: brand.name,
                logo: brand.logo,
                created_at: brand.dataValues.created_at,
                category_name: brand.category ? brand.category.name : null,
                category_id: brand.category ? brand.category.id : null
            };
        });
        return {
            EC: 0,
            message: "Lấy tất cả thương hiệu thành công.",
            data: formattedData,
            statusCode: 200
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);
        return {
            EC: -1,
            message: "Có lỗi trong Service!",
            data: '',
            statusCode: 500
        }
    }
}

const postBrand = async (brandData) => {
    try {
        const { brandName, brandImage, category_id } = brandData;

        // Kiểm tra nếu tên thương hiệu không có
        if (!brandName || brandName.trim() === "") {
            if (brandImage) {
                deleteImage(__dirname, '../uploads/brand/', brandImage);  // Xóa ảnh nếu có
            }
            return {
                message: "Tên thương hiệu không được để trống!",
                EC: 1,
                data: '',
                statusCode: 400
            };
        }

        // Kiểm tra nếu chưa chọn hình ảnh
        if (!brandImage) {
            return {
                message: "Chưa chọn hình ảnh!",
                EC: 1,
                data: '',
                statusCode: 400
            };
        }

        // Kiểm tra nếu không có category_id
        if (!category_id) {
            if (brandImage) {
                deleteImage(__dirname, '../uploads/brand/', brandImage);  // Xóa ảnh nếu không có category_id
            }
            return {
                message: "Danh mục không được để trống!",
                EC: 1,
                data: '',
                statusCode: 400
            };
        }

        // Kiểm tra tên thương hiệu có tồn tại không
        const checkBrandName = await db.brand.findOne({
            where: { name: brandName }
        });

        if (checkBrandName) {
            if (brandImage) {
                deleteImage(__dirname, '../uploads/brand/', brandImage);  // Xóa ảnh nếu tên thương hiệu đã tồn tại
            }
            return {
                EC: 1,
                message: "Tên thương hiệu đã tồn tại!",
                data: '',
                statusCode: 409
            };
        }

        // Tạo mới thương hiệu với category_id
        const data = await db.brand.create({
            name: brandName,
            logo: 'brand/' + brandImage,  // Lưu đường dẫn ảnh
            category_id: category_id      // Lưu category_id vào cơ sở dữ liệu
        });

        return {
            message: "Thêm thương hiệu thành công.",
            EC: 0,
            data: data,
            statusCode: 200
        };
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        // Nếu có lỗi trong quá trình tạo thương hiệu, xóa ảnh đã tải lên
        const { brandImage } = brandData;
        if (brandImage) {
            deleteImage(__dirname, '../uploads/brand/', brandImage);
        }

        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
        };
    }
};


const putBrand = async (brandEditData) => {
    try {
        const { id, brandName, categoryId, brandImage } = brandEditData;

        if (!brandName) {
            deleteImage(__dirname, '../uploads/brand/', brandImage)
            return {
                message: "Tên thương hiệu không được để trống!",
                EC: 1,
                data: '',
                statusCode: 400
            }
        }

        if (!brandImage) {
            deleteImage(__dirname, '../uploads/brand/', brandImage)
            return {
                message: "Chưa chọn hình ảnh!",
                EC: 1,
                data: '',
                statusCode: 400
            }
        }

        // Tìm thương hiệu theo ID
        let idBrand = await db.brand.findOne({
            where: { id: id }
        });

        if (idBrand) {
            // Kiểm tra xem tên thương hiệu mới có tồn tại trong cơ sở dữ liệu nhưng không phải là thương hiệu hiện tại
            let nameExists = await db.brand.findOne({
                where: {
                    name: brandName,
                }
            });

            if (nameExists) {
                deleteImage(__dirname, '../uploads/brand/', brandImage);
                return {
                    message: 'Thương hiệu này đã tồn tại!',
                    EC: 1,
                    data: '',
                    statusCode: 409
                };
            }

            console.log('check category_id >>>.', categoryId);

            // Cập nhật thương hiệu với tên và ảnh mới (nếu có)
            const updatedbrand = await db.brand.update(
                {
                    name: brandName,
                    category_id: categoryId,
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
                data: updatedbrand,
                statusCode: 200
            };
        } else {
            return {
                message: 'Thương hiệu không tồn tại!',
                EC: 1,
                data: '',
                statusCode: 404
            };
        }

    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        const { brandImage } = brandEditData;
        deleteImage(__dirname, '../uploads/brand/', brandImage)

        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
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
                    return {
                        message: "Lỗi khi xóa tệp hình ảnh hoặc tệp không tồn tại!",
                        data: '',
                        EC: -1,
                        statusCode: 404
                    }
                }
            }

            // Xóa thương hiệu khỏi cơ sở dữ liệu
            await brand.destroy();

            return {
                message: "Xóa thương hiệu thành công.",
                EC: 0,
                data: brand,
                statusCode: 200
            };
        } else {
            return {
                message: "Thương hiệu không tồn tại.",
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

const getBrandsByCategory = async (categoryId) => {
    try {
        const brands = await db.brand.findAll({
            where: {
                category_id: categoryId
            }
        })

        if(!brands || brands.length === 0 ) {
            return {
                message: "Không tìm thấy thương hiệu nào cho danh mục này!",
                EC: 1,
                statusCode: 404,
                data: []
            }
        }

        return {
            message: "Thành công.",
            statusCode: 200,
            EC: 0,
            data: brands
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
}

module.exports = {
    getAllBrand,
    postBrand,
    putBrand,
    deleteBrand,
    getBrandsByCategory
}