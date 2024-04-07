

const express = require('express');
const router = express.Router();
const { enrollCourse, viewEnrolledCourses } = require('../controllers/CourseEnroll.js');
const { isStudent, isRegistered } = require('../middlewares/authMiddlewares.js');

//Routes for Course enrollment controllers
router.post('/enroll/:courseId', isRegistered, isStudent, enrollCourse);


router.get('/enrolled-courses', isRegistered, isStudent, viewEnrolledCourses);

module.exports = router;
