const cloudinary = require('cloudinary').v2;


const streamUpload = (filePathOrBuffer, folder, public_id) =>
new Promise((resolve, reject) => {
// If it's a Buffer, use upload_stream
if (Buffer.isBuffer(filePathOrBuffer)) {
const stream = cloudinary.uploader.upload_stream(
{ folder, public_id },
(error, result) => (error ? reject(error) : resolve(result))
);
stream.end(filePathOrBuffer);
} else {
// Otherwise assume it's a local path (string) and use uploader.upload
cloudinary.uploader.upload(filePathOrBuffer, { folder, public_id }, (error, result) => {
if (error) return reject(error);
resolve(result);
});
}
});


module.exports = { streamUpload };