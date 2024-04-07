// enrollmentController.js

const { Course } = require('../models/courseModel.js');
const { usercourses } = require('../models/userEnrollmentModel.js');
const { mailSender } = require('../utils/emailSender.js');


const enrollCourse = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("email", email);
        console.log('req.user in enroll', req.user);
        const UserId = req.user.id;
        console.log("userId", UserId);
        console.log("req.param", req.params.courseId);
        const CourseId = req.params.courseId;
        console.log("courseId", CourseId);
        const enrollmentExists = await usercourses.findOne({ where: { UserId, CourseId } });
        if (enrollmentExists) {
            return res.status(400).json({ message: 'User is already enrolled in the course' });
        }

        await usercourses.create({ UserId, CourseId });
        const mailResponse = await mailSender(email, "Enrollment Confirmation", "Thank you for enrolling in our course");
        console.log("mailResponse", mailResponse); 

        res.status(201).json({ message: 'User enrolled in the course successfully' });
    } catch (error) {
        console.error('Course Enrollment Error:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const viewEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("userId", req.user.id);
        const enrolledCourses = await usercourses.findAll({
            where: { UserId: userId },
        });
        const courseIds = enrolledCourses.map(course => course.CourseId);
        const courses = await Course.findAll({
            where: { id: courseIds }
        });

        res.status(200).json({ enrolledCourses: courses });
    } catch (error) {
        console.error('Get Enrolled Courses Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { enrollCourse, viewEnrolledCourses };
