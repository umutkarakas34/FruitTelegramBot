const User = require('../models/user');
const Referral = require('../models/referral');

// İlişkileri tanımlama
User.hasMany(Referral, { foreignKey: 'user_id', as: 'referrals' });
User.hasMany(Referral, { foreignKey: 'referred_user_id', as: 'referredUsers' });
Referral.belongsTo(User, { foreignKey: 'user_id', as: 'referrer' });
Referral.belongsTo(User, { foreignKey: 'referred_user_id', as: 'referredUser' });

module.exports = {
    User,
    Referral
};
