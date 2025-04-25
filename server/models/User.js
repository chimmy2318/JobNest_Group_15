// models/User.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      // Add more fields if needed
    });
  
    User.associate = (models) => {
      User.belongsToMany(models.Skill, {
        through: 'UserSkills',
        foreignKey: 'userId',
      });
    };
  
    return User;
  };
  