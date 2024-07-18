const User = require('../models/user.js');
const Referral = require('../models/referral.js');
const Admin = require('../models/admin.js');
const Task = require('../models/task.js');
const Game = require('../models/game.js');
const DailyCheckin = require('../models/dailyCheckin.js');
const Blog = require('../models/blog.js');

// İlişkileri tanımlama
User.hasMany(Referral, { foreignKey: 'user_id', as: 'referrals' });
Referral.belongsTo(User, { foreignKey: 'user_id', as: 'referrer' });

User.hasMany(Referral, { foreignKey: 'referred_user_id', as: 'referredUsers' });
Referral.belongsTo(User, { foreignKey: 'referred_user_id', as: 'referredUser' });

Admin.hasMany(Task, { foreignKey: 'admin_id', as: 'tasks' });
Task.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });

User.hasMany(Game, { foreignKey: 'user_id', as: 'games' });
Game.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(DailyCheckin, { foreignKey: 'user_id' });
DailyCheckin.belongsTo(User, { foreignKey: 'user_id' });

Admin.hasMany(Blog, { foreignKey: 'admin_id' });
Blog.belongsTo(Admin, { foreignKey: 'admin_id' });


module.exports = {
    User,
    Referral,
    Admin,
    Task,
    Game,
    DailyCheckin,
    Blog
};
