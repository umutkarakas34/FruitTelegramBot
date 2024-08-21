const Sequelize = require('sequelize');
const sequelize = require('../utility/db');
const Task = require('./task'); // Task modelini içe aktar

const TaskImages = sequelize.define('TaskImages', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Task,
            key: 'id'
        }
    },
    image_url: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: 'task_images',
    timestamps: false
});

module.exports = TaskImages;
