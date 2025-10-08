const imagekit = require("../utils/imageKit");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file.buffer.toString("base64"); // convert buffer to base64
    const fileName = `${Date.now()}_${req.file.originalname}`;

    const result = await imagekit.upload({
      file, // base64 string
      fileName,
      folder: "/vendra", // optional: group uploads in a folder
    });

    res.json({
      url: result.url, // public URL to store in DB
    });
  } catch (err) {
    console.error("Image upload failed:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
};
