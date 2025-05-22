/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Thay đổi với Cloud name của bạn
    api_key: process.env.CLOUDINARY_API_KEY, // Thay đổi với API Key của bạn
    api_secret: process.env.CLOUDINARY_API_SECRET, // Thay đổi với API Secret của bạn
});

// Cấu hình multer (Lưu file vào bộ nhớ)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware upload (dùng trong routes)
export const uploadMiddleware = upload.array('images');

// Hàm xử lý tải ảnh lên Cloudinary
export const uploadImagesToCloudinary = async (files: any[]): Promise<string[]> => {
    try {
        // Kiểm tra xem có file được upload không
        if (!files || !Array.isArray(files)) {
            throw new Error('No files uploaded.');
        }

        // Mảng để lưu trữ URL của các ảnh đã upload
        const imageUrls: string[] = [];

        // Lặp qua mảng các file và upload từng cái lên Cloudinary
        for (const file of files) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'uploads', // Chọn thư mục
                        public_id: `image_${Date.now()}_${Math.random()}`, // ID công khai, có thể kết hợp thời gian và random để đảm bảo duy nhất
                        resource_type: 'image', // Chỉ định đây là hình ảnh
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                stream.end(file.buffer); // Upload file
            });

            imageUrls.push((result as any).secure_url); // Lưu URL của ảnh vào mảng
        }

        // Trả về mảng các URL của các ảnh đã upload
        return imageUrls;
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error('Error uploading images to Cloudinary');
    }
};

// xóa ảnh
export const deleteImagesFromCloudinary = async (req: Request, res: Response): Promise<void> => {
    const { public_ids } = req.body; // Nhận danh sách public_id từ request
    try {
        if (!Array.isArray(public_ids) || public_ids.length === 0) {
            res.status(400).json({ message: 'Missing or invalid public_ids array.' });
            return;
        }

        // Gọi API Cloudinary để xóa nhiều ảnh cùng lúc
        const result = await cloudinary.api.delete_resources(public_ids, { invalidate: true });

        res.status(200).json({ data: result });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Error deleting images from Cloudinary.' });
    }
};
