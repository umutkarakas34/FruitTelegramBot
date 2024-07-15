const Sequelize = require('sequelize');
const sequelize = require('../utility/db');
const Admin = require('../models/admin'); // User modelini içe aktarma

const Blog = sequelize.define('Blog', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true // Resim opsiyonel olabilir, true yerine false yapabilirsiniz zorunlu kılmak isterseniz
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Admin,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

module.exports = Blog;
