// models/Job.js
module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
      title: DataTypes.STRING,
      company: DataTypes.STRING,
      description: DataTypes.TEXT,
      location: DataTypes.STRING,
      skillsRequired: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL only
    });
  
    return Job;
  };
  