'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename the column from userId to UserId
    await queryInterface.renameColumn('usercourses', 'userId', 'UserId');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the column name change
    await queryInterface.renameColumn('usercourses', 'UserId', 'userId');
  }
};
