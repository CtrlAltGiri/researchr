const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

let storage, upload;
storage = new GridFsStorage({
    url: process.env.DB_URL,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: req.user._id,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
});

storage.on('connection', (db) => {
    upload = multer({ storage: storage }).single('file');
})

exports.upload = (req, res, next) => {
    try {
        upload(req, res, next);
    }
    catch (err) {
        next(err);
    }
};