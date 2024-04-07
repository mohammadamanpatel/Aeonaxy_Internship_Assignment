// courseController.js

const { Course } = require("../models/courseModel");

// Create a new course
const createCourse = async (req, res) => {
    try {
        console.log("req.user", req.user);
        const { title, description, category, level } = req.body;
        const newCourse = await Course.create({ title, description, category, level });
        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Read all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        console.log("courses", courses);
        res.status(200).json({ courses });
    } catch (error) {
        console.error('Get All Courses Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a course by ID
const updateCourseById = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Only superadmin users can update courses' });
        }
        const courseId = req.params.id;
        console.log("courseId", courseId);
        const { title, description, category, level } = req.body;
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        course.title = title;
        course.description = description;
        course.category = category;
        course.level = level;
        await course.save();
        res.status(200).json({ message: 'Course updated successfully', course });
    } catch (error) {
        console.error('Update Course Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await course.destroy();
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Delete Course Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getFilteredCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { category, level } = req.query;
        const whereClause = {};
        if (category) whereClause.category = category;
        if (level) whereClause.level = level;
        const courses = await Course.findAll({
            where: whereClause,
            limit: limit,
            offset: offset,
        });
        const totalCount = await Course.count({ where: whereClause });
        res.status(200).json({
            courses: courses,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Fetch Courses Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createCourse, getAllCourses, updateCourseById, deleteCourseById, getFilteredCourses };
