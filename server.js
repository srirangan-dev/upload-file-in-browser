const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

const UPLOAD_FOLDER = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_FOLDER)) fs.mkdirSync(UPLOAD_FOLDER);
app.use("/uploads", express.static(UPLOAD_FOLDER));

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_FOLDER,
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
  limits: { fileSize: 500 * 1024 }, // 500 KB
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({
    message: "File uploaded successfully",
    fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
    fileType: req.file.mimetype,
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
