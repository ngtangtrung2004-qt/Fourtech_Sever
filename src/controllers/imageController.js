import path from 'path'
import fs from 'fs'

const ImageController = {
    getImage: (req, res) => {
        const { type, filename } = req.params;
        const cacLoaiHopLe = ['product', 'category', 'brand', 'avatar'];

        if (!cacLoaiHopLe.includes(type)) {
            return res.status(400).json({ message: 'Loại hình ảnh không hợp lệ' });
        }

        const duongDanHinhAnh = path.join(__dirname, '../uploads', type, filename);

        // Kiểm tra nếu tệp hình ảnh tồn tại
        fs.stat(duongDanHinhAnh, (err, stats) => {
            if (err || !stats.isFile()) {
                return res.status(404).json({ message: 'Không tìm thấy hình ảnh' });
            }

            res.sendFile(duongDanHinhAnh);
        });
    }
}

module.exports = ImageController