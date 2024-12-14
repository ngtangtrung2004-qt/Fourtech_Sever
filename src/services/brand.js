import { where } from "sequelize";
import db from "../models";
import { deleteImage } from "../middleware/multer";

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
            data: data,
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
        const { brandName, brandImage } = brandData;

        if (!brandName) {
            deleteImage(__dirname, '../uploads/brand/', brandImage)
            return {
                EC: 1,
                message: "Tên thương hiệu không được bỏ trống!",
                data: '',
                statusCode: 400
            }
        }
        if (!brandImage) {
            deleteImage(__dirname, '../uploads/brand/', brandImage)
            return {
                EC: 1,
                message: "Chưa chọn hình ảnh!",
                data: '',
                statusCode: 400
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

        let isNameBrandExist = await checkBrandName(brandName)

        if (isNameBrandExist) {
            deleteImage(__dirname, '../uploads/brand/', brandImage)
            return {
                EC: 1,
                message: "Tên thương hiệu đã tồn tại!",
                data: '',
                statusCode: 409
            };
        } else {
            const data = await db.brand.create({
                name: brandName,
                logo: 'brand/' + brandImage
            })
            return {
                message: "Thêm thương hiệu thành công.",
                EC: 0,
                data: data,
                statusCode: 200
            }
        }

    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        const { brandImage } = brandData;
        deleteImage(__dirname, '../uploads/brand/', brandImage)

        return {
            message: "Có lỗi trong Service!",
            EC: -1,
            data: '',
            statusCode: 500
        }
    }
};

const putBrand = async (brandEditData) => {
    try {
        const { id, brandName, brandImage } = brandEditData;

        if (!brandName) {
            deleteImage(__dirname, '../uploads/brand/', brandImage)
            return {
                message: "Tên thương hiệu không được để trống!",
                EC: 1,
                data: '',
                statusCode: 400
            }
        }

        let idBrand = await db.brand.findOne({
            where: { id: id }
        });

        if (idBrand) {
            let nameExists = await db.brand.findOne({
                where: {
                    name: brandName,
                    id: { [db.Sequelize.Op.ne]: id }
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

            const updatedbrand = await db.brand.update(
                {
                    name: brandName,
                    logo: brandImage ? `brand/${brandImage}` : idBrand.logo
                },
                {
                    where: { id: idBrand.id }
                }
            );
            if (brandImage && brandImage !== idBrand.logo) {
                console.log('xóa');
                deleteImage(__dirname, '../uploads/', idBrand.logo);
            }

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
        const product = await db.product.findAll({
            where: { brand_id: id }
        })

        if (product.length > 0) {
            return {
                message: "Không thể xóa thương hiệu này vì đã có sản phẩm liên quan!",
                data: '',
                EC: -1,
                statusCode: 409
            }
        }

        const brand = await db.brand.findOne({
            where: {
                id: id
            }
        });

        if (brand) {
            const brandImage = brand.logo;
            deleteImage(__dirname, '../uploads/', brandImage)

            if (brandImage) {
                try {
                    console.log("Tệp hình ảnh đã được xóa.");
                } catch (error) {
                    console.log("Lỗi khi xóa tệp hình ảnh hoặc tệp không tồn tại:");
                    return {
                        message: "Lỗi khi xóa tệp hình ảnh hoặc tệp không tồn tại!",
                        data: '',
                        EC: -1,
                        statusCode: 404
                    }
                }
            }

            await brand.destroy({
                where: { id: id },
                force: true
            });

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


module.exports = {
    getAllBrand,
    postBrand,
    putBrand,
    deleteBrand
}