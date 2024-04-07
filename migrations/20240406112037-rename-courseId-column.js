'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename the column from courseId to CourseId
    await queryInterface.renameColumn('usercourses', 'courseId', 'CourseId');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the column name change
    await queryInterface.renameColumn('usercourses', 'CourseId', 'courseId');
  }
};
