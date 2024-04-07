const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, updateCourseById, deleteCourseById, getFilteredCourses } = require('../controllers/Course.js');
const { isSuperAdmin, isRegistered } = require('../middlewares/authMiddlewares.js');

//Routes for Course related controllers
router.post('/Createcourse', isRegistered, isSuperAdmin, createCourse);

router.get('/getCourses', isRegistered, isSuperAdmin, getAllCourses);

router.put('/:id', isRegistered, isSuperAdmin, updateCourseById);

router.delete('/deleteCourse/:id', isRegistered, isSuperAdmin, deleteCourseById);

router.get('/filtered-courses', isRegistered, isSuperAdmin, getFilteredCourses);

module.exports = router;
