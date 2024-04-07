'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'ForgetPasswordTokenExpirement', {
      type: Sequelize.DATE,
      allowNull: true, // or false, depending on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'ForgetPasswordTokenExpirement');
  }
};