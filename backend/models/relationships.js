const User = require('../models/user.js');
const Referral = require('../models/referral.js');
const Admin = require('../models/admin.js');
const Task = require('../models/task.js');
const Game = require('../models/game.js');
const DailyCheckin = require('../models/dailyCheckin.js');
const Blog = require('../models/blog.js');
const Farming = require('./farming.js');
const UserTask = require('./userTask.js');
const TaskImages = require('./taskImages.js');

// İlişkileri tanımlama
User.hasMany(Referral, { foreignKey: 'user_id' });
Referral.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Referral, { foreignKey: 'referred_user_id' });
Referral.belongsTo(User, { foreignKey: 'referred_user_id' });

Admin.hasMany(Task, { foreignKey: 'admin_id' });
Task.belongsTo(Admin, { foreignKey: 'admin_id' });

User.hasMany(Game, { foreignKey: 'user_id' });
Game.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(DailyCheckin, { foreignKey: 'user_id' });
DailyCheckin.belongsTo(User, { foreignKey: 'user_id' });

Admin.hasMany(Blog, { foreignKey: 'admin_id' });
Blog.belongsTo(Admin, { foreignKey: 'admin_id' });

User.hasMany(Farming, { foreignKey: 'user_id' });
Farming.belongsTo(User, { foreignKey: 'user_id' });

UserTask.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' }); // UserTask -> User ilişkisi
UserTask.belongsTo(Task, { foreignKey: 'task_id', onDelete: 'CASCADE' }); // UserTask -> Task ilişkisi

User.hasMany(UserTask, { foreignKey: 'user_id', onDelete: 'CASCADE' }); // User -> UserTask ilişkisi
Task.hasMany(UserTask, { foreignKey: 'task_id', onDelete: 'CASCADE' }); // Task -> UserTask ilişkisi

Task.hasMany(TaskImages, { foreignKey: 'task_id', onDelete: 'CASCADE' }); // Task -> TaskImages ilişkisi
TaskImages.belongsTo(Task, { foreignKey: 'task_id', onDelete: 'CASCADE' }); // TaskImages -> Task ilişkisi


module.exports = {
    User,
    Referral,
    Admin,
    Task,
    Game,
    DailyCheckin,
    Blog
};
