const { Sequelize, DataTypes } = require('sequelize');
const { User } = require('./userModel.js');
const { usercourses } = require('./userEnrollmentModel.js');

// Initialize Sequelize with connection options
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: process.env.PGPORT,
    ssl: true, // Set to true if SSL is enabled
    dialectOptions: {
        ssl: {
            require: true, // Set to true if SSL is required
            rejectUnauthorized: false // Set to false if using self-signed certificates
        }
    }
});

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
sequelize.sync();

module.exports = { Course, sequelize };
