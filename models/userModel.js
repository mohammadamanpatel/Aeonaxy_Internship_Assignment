const { Sequelize, DataTypes } = require('sequelize');
const { Course } = require('./courseModel.js'); // Import Course model
const { usercourses } = require('./userEnrollmentModel.js');

// Initialize Sequelize with connection options
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

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatarSecureUrl: {
        type: DataTypes.STRING
    },
    avatarPublicId: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    },
    ForgetPasswordToken: {
        type: DataTypes.STRING
    },
    ForgetPasswordTokenExpirement: {
        type: DataTypes.DATE
    }
});
sequelize.sync();

module.exports = { User, sequelize };
