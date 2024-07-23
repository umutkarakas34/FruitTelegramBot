// models/userTask.js
const Sequelize = require('sequelize');
const sequelize = require('../utility/db');
const User = require('./user'); // Kullanıcı modelini içe aktar
const Task = require('./task'); // Görev modelini içe aktar

const UserTask = sequelize.define('UserTask', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Task,
            key: 'id'
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    completed_at: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, {
    tableName: 'user_tasks',
    timestamps: false
});

module.exports = UserTask;
