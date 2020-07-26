'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Pie.init({
    x: DataTypes.INTEGER,
    y: DataTypes.INTEGER,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    sentAt: DataTypes.DATE,
    senderName: DataTypes.TEXT,
    senderEmail: DataTypes.TEXT,
    recipientName: DataTypes.TEXT,
    recipientEmail: DataTypes.TEXT,
    eatenAt: DataTypes.DATE,
    message: DataTypes.TEXT,
    subscribedSender: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Pie',
  });
  return Pie;
};