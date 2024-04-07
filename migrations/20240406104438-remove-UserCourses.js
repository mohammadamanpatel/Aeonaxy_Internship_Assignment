'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the UserCourses table
    await queryInterface.dropTable('UserCourses');
  },

  down: async (queryInterface, Sequelize) => {
    // Recreate the UserCourses table (only necessary if you want to rollback)
    await queryInterface.createTable('UserCourses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  }
};
