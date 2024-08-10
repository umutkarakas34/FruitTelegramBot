const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const TaskImages = sequelize.define('TaskImages', {
    image_url: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = TaskImages;
