const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Task = require('../models/task');
const Game = require('../models/game');
const { message } = require('telegraf/filters');
const User = require('../models/user');
const DailyCheckin = require('../models/dailyCheckin');
const Farming = require('../models/farming');
const Referral = require('../models/referral');

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ where: { username } });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}
const createTask = async (req, res) => {
    const { task_title, task_description } = req.body;

    try {
        const task = await Task.create({
            task_title,
            task_description,
            admin_id: req.user.id
        });

        if (req.files && req.files.length > 0) {
            // Tüm resimleri TaskImages modeline kaydet
            const imagePromises = req.files.map(file => {
                return TaskImages.create({
                    image_url: file.path,
                    task_id: task.id
                });
            });
            await Promise.all(imagePromises);
        }

        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
// Tüm task'ları getirme
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: {
                model: Admin
            }
        });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
// Belirli bir task'ı ID ile getirme
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
// Task güncelleme
const updateTask = async (req, res) => {
    const { task_title, task_image, task_description } = req.body;
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.task_title = task_title;
        task.task_image = task_image;
        task.task_description = task_description;
        await task.save();
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
// Task silme
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.destroy();
        res.status(204).json();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
const createBlog = async (req, res) => {
    try {
        const { title, image, content, admin_id } = req.body;
        const blog = await Blog.create({ title, image, content, admin_id });
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Tüm blogları getirme
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Belirli bir blogu ID ile getirme
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Blog güncelleme
const updateBlog = async (req, res) => {
    try {
        const { title, image, content } = req.body;
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        blog.title = title;
        blog.image = image;
        blog.content = content;
        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Blog silme
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        await blog.destroy();
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getGames = async (req, res) => {
    try {
        const games = await Game.findAll({
            include: {
                model: User
            }
        })

        return res.status(200).json(games);
    }
    catch (error) {
        return res.status(500).json({ message: error.message, })
    }
}
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll()

        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ message: error.message, })
    }
}
const getDailyCheckins = async (req, res) => {
    try {
        const dailycheckins = await DailyCheckin.findAll({
            include: {
                model: User
            }
        })

        return res.status(200).json(dailycheckins);
    }
    catch (error) {
        return res.status(500).json({ message: error.message, })
    }
}
const getFarmings = async (req, res) => {
    try {
        const farmings = await Farming.findAll({
            include: {
                model: User
            }
        })

        return res.status(200).json(farmings);
    }
    catch (error) {
        return res.status(500).json({ message: error.message, })
    }
}
const getUserReferrals = async (req, res) => {
    try {
        const userReferrals = await Referral.findAll({
            attributes: [
                'user_id',
                [Sequelize.fn('COUNT', Sequelize.col('user_id')), 'referral_count']
            ],
            include: {
                model: User,
                attributes: ['id', 'username', 'email'] // Kullanıcı bilgilerini getirmek için
            },
            where: {
                referral_level: 1 // Yalnızca referral_level 1 olanları çek
            },
            group: ['user_id', 'User.id'] // Hem user_id hem de User modelinden id'yi grupluyoruz
        });

        return res.status(200).json(userReferrals);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {
    login,
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getGames,
    getUsers,
    getDailyCheckins,
    getFarmings,
    getUserReferrals
};