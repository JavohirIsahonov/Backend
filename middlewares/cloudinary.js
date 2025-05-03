const { v2: cloudinary } = require('cloudinary');
const ErrorResponse = require('../utils/errorResponse');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'products',
            use_filename: true,
            unique_filename: true,
            transformation: [
                { width: 500, height: 500, crop: 'limit' },
                { fetch_format: 'auto', quality: 'auto' }
            ]
        });
        return result.secure_url;
    } catch (error) {
        throw new ErrorResponse('Rasm yuklashda xatolik yuz berdi', 500);
    }
};

module.exports = { uploadToCloudinary };