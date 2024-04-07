const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: process.env.PGPORT,
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const usercourses = sequelize.define('usercourses', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  UserId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  CourseId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
sequelize.sync();
module.exports = { usercourses, sequelize };
