const User = require('../models/user');
const Referral = require('../models/referral');

User.hasMany(Referral, { foreignKey: 'user_id' });
User.hasMany(Referral, { foreignKey: 'referred_user_id' });
Referral.belongsTo(User, { foreignKey: 'user_id' });
Referral.belongsTo(User, { foreignKey: 'referred_user_id' });

module.exports = {
    User,
    Referral
};
