const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controllers/uploadController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer(); // memory storage

// Authenticated users can upload images
router.post("/", authenticate, upload.single("file"), uploadImage);

module.exports = router;
