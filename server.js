const express = require('express');
const dotenv = require('dotenv');
const file_upload = require('express-fileupload')
const dbConnect = require('./config/database.js');
dotenv.config();
const { v2 } = require('cloudinary');
const cookie_parser = require('cookie-parser')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser())
app.use(file_upload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}))
dbConnect();
const userRoutes = require('./routes/userRoutes.js');
const coursesRoutes = require('./routes/courseRoutes.js')
const enrolledRoutes = require('./routes/studentEnrollmentRoutes.js')
app.use('/user', userRoutes);
app.use('/courses', coursesRoutes);
app.use('/enrollCourse', enrolledRoutes)
console.log("process.env.CLOUD_NAME", process.env.CLOUD_NAME);
console.log("process.env.API_KEY", process.env.API_KEY);
console.log("process.env.API_SECRET", process.env.API_SECRET);
v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
