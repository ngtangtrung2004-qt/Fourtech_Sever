import { where } from "sequelize"
import { deleteImage } from "../middleware/multer"
import db from "../models"


const getAllProduct = async () => {
    try {
        const data = await db.product.findAll({
            attributes: ['id', 'name', 'category_id', 'brand_id', 'image', 'price', 'promotion_price', 'description', 'quantity', 'view', 'created_at'],
            paranoid: true,
            include: [
                {
                    model: db.brand,
                    as: 'brandData',
                    attributes: ['id', 'name']
                },
                {
                    model: db.category,
                    as: 'categoryData',
                    attributes: ['id', 'name']
                }
            ],
            order: [
                ['view', 'DESC']
            ]
        })

        const formatterData = data.map((pro) => {
            return {
                id: pro.id,
                name: pro.name,
                category_id: pro.category_id,
                category_name: pro.categoryData ? pro.categoryData.name : null, // Lấy tên sản phẩm nếu tồn tại
                brand_id: pro.brand_id,
                brand_name: pro.brandData ? pro.brandData.name : null, // Lấy tên thương hiệu nếu tồn tại
                image: pro.image,
                price: pro.price,
                promotion_price: pro.promotion_price,
                description: pro.description,
                quantity: pro.quantity,
                view: pro.view,
                created_at: pro.dataValues.created_at
            };
        })

        return {
            data: formatterData,
            EC: 0,
            statusCode: 200,
            message: "Lấy tất cả sản phẩm thành công."
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        return {
            message: "Có lỗi trong Service!",
            data: '',
            EC: -1,
            statusCode: 500
        }
    }
}

const getAllProductTrash = async () => {
    try {
        const data = await db.product.findAll({
            attributes: ['id', 'name', 'category_id', 'brand_id', 'image', 'price', 'promotion_price', 'description', 'quantity', 'view', 'created_at'],
            where: {
                deleted_at: {
                    [db.Sequelize.Op.ne]: null // Lấy các bản ghi có `deleted_at` khác `null`
                }
            },
            paranoid: false,
            include: [
                {
                    model: db.brand,
                    as: 'brandData',
                    attributes: ['id', 'name']
                },
                {
                    model: db.category,
                    as: 'categoryData',
                    attributes: ['id', 'name']
                }
            ]
        })

        const formatterData = data.map((pro) => {
            return {
                id: pro.id,
                name: pro.name,
                category_id: pro.category_id,
                category_name: pro.categoryData ? pro.categoryData.name : null, // Lấy tên sản phẩm nếu tồn tại
                brand_id: pro.brand_id,
                brand_name: pro.brandData ? pro.brandData.name : null, // Lấy tên thương hiệu nếu tồn tại
                image: pro.image,
                price: pro.price,
                promotion_price: pro.promotion_price,
                description: pro.description,
                quantity: pro.quantity,
                view: pro.view,
                created_at: pro.dataValues.created_at
            };
        })

        return {
            data: formatterData,
            EC: 0,
            statusCode: 200,
            message: "Lấy tất cả sản phẩm đã xóa thành công."
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        return {
            message: "Có lỗi trong Service!",
            data: '',
            EC: -1,
            statusCode: 500
        }
    }
}


const getOneProduct = async (idProduct) => {
    const id = idProduct
    try {
        const data = await db.product.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: db.brand,
                    as: 'brandData',
                    attributes: ['id', 'name']
                },
                {
                    model: db.category,
                    as: 'categoryData',
                    attributes: ['id', 'name']
                }
            ]
        })

        if (data) {
            const formatterData = {
                id: data.id,
                name: data.name,
                category_id: data.category_id,
                category_name: data.categoryData ? data.categoryData.name : null, // Lấy tên sản phẩm nếu tồn tại
                brand_id: data.brand_id,
                brand_name: data.brandData ? data.brandData.name : null, // Lấy tên thương hiệu nếu tồn tại
                image: data.image,
                price: data.price,
                promotion_price: data.promotion_price,
                description: data.description,
                quantity: data.quantity,
                view: data.view,
                created_at: data.dataValues.created_at
            }
            return {
                message: "Lấy sản phẩm thành công.",
                statusCode: 200,
                data: formatterData,
                EC: 0
            }
        } else {
            return {
                message: "Không có sản phẩm!",
                statusCode: 404,
                data: [],
                EC: 1
            }
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        return {
            message: "Có lỗi trong Service!",
            data: '',
            EC: -1,
            statusCode: 500
        }
    }
}

const getProductByCategory = async (idCategory) => {
    try {
        const product = await db.product.findAll({
            where: { category_id: idCategory },
            order: [
                ['view', 'DESC']
            ],
            include:
            {
                model: db.category,
                as: 'categoryData',
                attributes: ['id', 'name']
            }
        })

        if (product.length === 0) {
            return {
                message: "Không tìm thấy sản phẩm nào cho danh mục này!",
                statusCode: 200,
                data: [],
                EC: 1
            }
        } else {
            return {
                message: "Lấy sản phẩm theo danh mục này thành công.",
                statusCode: 200,
                data: product,
                EC: 0
            }
        }

    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        return {
            message: "Có lỗi trong Service!",
            data: '',
            EC: -1,
            data: '',
            statusCode: 500

        }
    }
}

const getProductByBrand = async (idBrand) => {
    try {
        const product = await db.product.findAll({
            where: { brand_id: idBrand },
            order: [
                ['view', 'DESC']
            ],
            include:
            {
                model: db.brand,
                as: 'brandData',
                attributes: ['id', 'name']
            }
        })

        if (product.length === 0) {
            return {
                message: "Không tìm thấy sản phẩm nào cho thương hiệu này!",
                statusCode: 200,
                data: [],
                EC: 1
            }
        } else {
            return {
                message: "Lấy sản phẩm theo thương hiệu này thành công.",
                statusCode: 200,
                data: product,
                EC: 0
            }
        }

    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        return {
            message: "Có lỗi trong Service!",
            data: '',
            EC: -1,
            data: '',
            statusCode: 500

        }
    }
}

const postProduct = async (dataProduct) => {
    try {
        const { nameProduct, category_id, brand_id, price, promotion_price, description, quantity, imageProduct } = dataProduct

        if (!nameProduct || !category_id || !brand_id || !price || !description || !quantity) {
            deleteImage(__dirname, '../uploads/product/', imageProduct)
            return {
                message: "Thiếu tham số bắt buộc!",
                EC: 1,
                data: [],
                statusCode: 400
            }
        }

        if (!imageProduct) {
            deleteImage(__dirname, '../uploads/product/', imageProduct)
            return {
                message: "Ảnh chưa được chọn!",
                statusCode: 400,
                EC: 1,
                data: []
            }
        }

        // Nếu imageProduct là mảng ảnh, thêm tiền tố "product/" vào tất cả các ảnh
        const imagesWithPrefix = Array.isArray(imageProduct)
            ? imageProduct.map(image => `product/${image}`)
            : [`product/${imageProduct}`]; // Thêm tiền tố cho ảnh nếu chỉ có 1 ảnh

        const data = await db.product.create({
            name: nameProduct,
            category_id,
            brand_id,
            price: price,
            promotion_price,
            description,
            quantity: quantity,
            image: imagesWithPrefix
        })

        // deleteImage(__dirname, '../uploads/product/', imageProduct)
        return {
            message: "Thêm sản phẩm thành công.",
            EC: 0,
            data: data,
            statusCode: 200
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        const { imageProduct } = dataProduct
        deleteImage(__dirname, '../uploads/product/', imageProduct)

        return {
            message: "Có lỗi trong Service!",
            data: '',
            EC: -1,
            statusCode: 500
        }
    }
}

const putProduct = async (dataProduct) => {
    try {
        const { idProduct, imageProduct, name, category_id, brand_id, price, promotion_price, description, quantity } = dataProduct;

        if (!name || !category_id || !brand_id || !price || !promotion_price || !description || !quantity) {
            deleteImage(__dirname, '../uploads/product/', imageProduct)
            return {
                message: "Thiếu tham số bắt buộc!",
                data: '',
                EC: 1,
                statusCode: 400
            }
        }

        const id = await db.product.findOne({
            where: { id: idProduct }
        })

        // Nếu không có ảnh mới, giữ lại ảnh cũ
        const imagesWithPrefix = imageProduct && imageProduct.length > 0
            ? Array.isArray(imageProduct)
                ? imageProduct.map(image => `product/${image}`)
                : [`product/${imageProduct}`] // Thêm tiền tố cho ảnh nếu chỉ có 1 ảnh
            : undefined; // Nếu không có ảnh mới, không cần cập nhật ảnh

        if (id) {
            const data = await db.product.update(
                {
                    name,
                    category_id,
                    brand_id,
                    image: imagesWithPrefix || id.image,
                    price,
                    promotion_price,
                    description,
                    quantity
                },
                {
                    where: { id: idProduct }
                }
            )

            if (data) {
                if (imagesWithPrefix) {
                    deleteImage(__dirname, '../uploads/', id.image); // Xóa ảnh cũ nếu có ảnh mới
                }
                return {
                    EC: 0,
                    message: "Cập nhật sản phẩm thành công.",
                    statusCode: 200,
                    data: data
                }
            } else {
                return {
                    EC: 1,
                    message: "Lỗi hệ thống!",
                    statusCode: 500,
                    data: ''
                }
            }
        } else {
            return {
                EC: 1,
                message: "Sản phẩm cần cập nhật không tồn tại!",
                statusCode: 404,
                data: ''
            }
        }

    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        const { imageProduct } = dataProduct
        deleteImage(__dirname, '../uploads/product/', imageProduct)

        return {
            message: "Có lỗi trong Service!",
            data: '',
            EC: -1,
            statusCode: 500
        }
    }
}

const deleteSoftProduct = async (id) => {
    try {

        const orderDetail = await db.order_detail.findAll({
            where: { product_id: id }
        })

        if (orderDetail.length > 0) {
            return {
                message: "Không được xóa sản phẩm này vì có liên quan đến đơn hàng!",
                EC: 1,
                data: '',
                statusCode: 409
            };
        }

        // Tìm sản phẩm trong cơ sở dữ liệu
        const product = await db.product.findOne({
            where: {
                id: id
            }
        });

        if (product) {
            // Xóa sản phẩm khỏi cơ sở dữ liệu
            await product.destroy({
                where: { id: product }
            });

            return {
                message: "Xóa sản phẩm thành công.",
                EC: 0,
                data: product,
                statusCode: 200
            };
        } else {
            return {
                message: "Sản phẩm không tồn tại!",
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

const restoreProduct = async (id) => {
    try {
        // Tìm sản phẩm trong cơ sở dữ liệu
        const product = await db.product.findOne({
            where: {
                id: id,
            },
            paranoid: false
        });

        console.log(product);

        if (product) {
            // Khôi phục sản phẩm
            await product.restore();

            return {
                message: "Khôi phục sản phẩm thành công.",
                EC: 0,
                data: product,
                statusCode: 200
            };
        } else {
            return {
                message: "Sản phẩm không tồn tại!",
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

const deleteProduct = async (id) => {
    try {
        // Tìm sản phẩm trong cơ sở dữ liệu
        const product = await db.product.findOne({
            where: { id: id },
            paranoid: false, // Để lấy cả các bản ghi đã bị xóa mềm
        });

        if (product) {
            // Nếu không có mục cart_item tham chiếu, có thể xóa sản phẩm
            await db.product.destroy({
                where: { id: id }, // Sửa lại để xóa sản phẩm bằng id
                force: true
            });
            const productImage = product.image;

            if (productImage) {
                try {
                    deleteImage(__dirname, '../uploads/', productImage)
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

            return {
                message: "Xóa sản phẩm vĩnh viễn thành công.",
                EC: 0,
                data: product,
                statusCode: 200
            };
        } else {
            return {
                message: "Sản phẩm không tồn tại!",
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



const postView = async (id) => {
    try {
        const product = await db.product.findOne({
            where: { id: id }
        });
        if (product) {
            product.view += 1; // Tăng số lượt xem
            await product.save();
            return {
                message: 'Lượt xem đã cập nhật',
                views: product.view,
                statusCode: 200
            };
        } else {
            return {
                message: 'Không tìm thấy sản phẩm!',
                views: '',
                statusCode: 404
            };
        }
    } catch (error) {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        return {
            message: "Có lỗi trong Service!",
            views: '',
            statusCode: 500
        }
    }
}


module.exports = {
    getAllProduct,
    getAllProductTrash,
    getOneProduct,
    getProductByCategory,
    getProductByBrand,
    postProduct,
    putProduct,
    deleteSoftProduct,
    restoreProduct,
    deleteProduct,
    postView
}