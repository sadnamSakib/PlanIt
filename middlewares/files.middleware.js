const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const imageFileFilter = (req, file, cb) => {
  const allowedType = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else cb(null, false);
};

const image = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

let uploadImage = multer({ storage: image, imageFileFilter });

const pdfFileFilter = (req, file, cb) => {
  const allowedType = ["application/pdf"];
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else cb(null, false);
};

const pdf = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

let uploadPdf = multer({ storage: pdf, pdfFileFilter });

module.exports = { uploadImage, uploadPdf };
