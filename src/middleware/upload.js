// import multer from "multer";
// import AWS from "aws-sdk";
// import Random from "./random.js";

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const uploadImage = upload.single("image");

// // Define the upload middleware
// const uploadMiddleware = async function (req, res, next) {
//     try {
//         if (!req.file || !req.file.buffer) {
//             // No file provided, ignore and call next()
//             return next();
//         }

//         // S3 upload parameters
//         const params = {
//             Bucket: process.env.BUCKET_NAME, // pass your bucket name
//             Key: Random(8), // file will be saved as testBucket/dsj829sc to avoid collisions
//             Body: req.file.buffer,
//             ContentType: 'image/jpeg',
//         };

//         // Upload the file to S3
//         const s3Response = await s3.upload(params).promise()
//         req.body.image = s3Response.Location;
//         next();
//     } catch (error) {
//         return next({
//             status: 400,
//             message: "error uploading image",
//         });
//     }
// };

// export { uploadImage, uploadMiddleware };
