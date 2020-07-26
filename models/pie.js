'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pie = sequelize.define('pies', {
      x: DataTypes.INTEGER,
      y: DataTypes.INTEGER,
      lat: DataTypes.FLOAT,
      lng: DataTypes.FLOAT,
      sentAt: DataTypes.DATE,
      senderName: DataTypes.TEXT,
      senderEmail: DataTypes.TEXT,
      recipientName:  DataTypes.TEXT,
      recipientEmail: DataTypes.TEXT,
      eatenAt:DataTypes.DATE,
      message: DataTypes.TEXT,
      subscribedSender: DataTypes.BOOLEAN
  }, {});
  return Pie;
};