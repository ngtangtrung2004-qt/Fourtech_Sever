import { deleteImage } from "../config/configMulter"
import db from "../models"


const getAllProduct = () => {
    try {
        console.log('CÓ LỖI TRONG SERVICE >>>', error);

        const { imageProduct } = dataProduct
        deleteImage(__dirname, '../uploads/product/', imageProduct)

        return {
            message: "Có lỗi trong Service!",
            data: '',
            EC: -1,
            statusCode: 500
        }
    } catch (error) {

    }
}


const getOneProduct = () => {

}

const postProduct = async (dataProduct) => {
    try {
        const { nameProduct, category_id, brand_id, price, promotion_price, description, quantity, imageProduct } = dataProduct


        console.log(dataProduct);
        if (!nameProduct || !category_id || !brand_id || !price || !promotion_price || !description || !quantity) {
            deleteImage(__dirname, '../uploads/product/', imageProduct)
            return {
                message: "Thiếu tham số bắt buộc!",
                EC: 1,
                data: [],
                statusCode: 400
            }
        }

        if (!imageProduct) {
            return {
                message: "Ảnh chưa được chọn!",
                statusCode: 400,
                EC: 1,
                data: []
            }
        }

        const data = await db.product.create({
            name: nameProduct,
            category_id,
            brand_id,
            price: price,
            promotion_price,
            description,
            quantity: quantity,
            image: imageProduct
        })

        console.log(data);
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

const putProduct = () => {

}

const deleteProduct = () => {

}


module.exports = {
    getAllProduct,
    getOneProduct,
    postProduct,
    putProduct,
    deleteProduct
}