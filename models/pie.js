'use strict';
module.exports = (sequelize, DataTypes) => {
  const PIE = sequelize.define('pies', {
          x: {
        type: Sequelize.INTEGER
      },
      y: {
        type: Sequelize.INTEGER
      },
      lat: {
        type: Sequelize.FLOAT
      },
      lng: {
        type: Sequelize.FLOAT
      },
      sentAt: {
        type: Sequelize.DATE
      },
      senderName: {
        type: Sequelize.TEXT
      },
      senderEmail: {
        type: Sequelize.TEXT
      },
      recipientName: {
        type: Sequelize.TEXT
      },
      recipientEmail: {
        type: Sequelize.TEXT
      },
      eatenAt: {
        type: Sequelize.DATE
      },
      message: {
        type: Sequelize.TEXT
      },
      subscribedSender: {
        type: Sequelize.BOOLEAN
      }
  }, {});
  return Note;
};