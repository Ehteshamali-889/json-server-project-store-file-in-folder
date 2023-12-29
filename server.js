// server/server.js
const jsonServer = require('json-server');
const multer = require('multer');
const cors = require('cors');
const path = require('path'); // Node.js path module
const fs = require('fs'); // Node.js file system module

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set up multer storage and limits
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(__dirname, 'shared'); // Use path to create an absolute path
    // Create the 'shared' folder if it doesn't exist
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Enable CORS only for the /files route
server.post('/files', cors(), upload.single('file'), (req, res) => {
  // Access the uploaded file using req.file
  const uploadedFile = req.file;

  // Process the file as needed
  // For example, save it to the database, generate a link, etc.

  // Send a response
  res.json({ success: true, message: 'File uploaded successfully' });
});

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
