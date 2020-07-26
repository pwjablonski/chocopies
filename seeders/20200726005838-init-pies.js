"use strict";
const Jimp = require("jimp");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const image = await Jimp.read(
      "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2Fkorea-2500.png?v=1593401598746"
    );

    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const pies = []

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
        if (!(pixel.r === 255 && pixel.g === 255 && pixel.b === 255)) {
          pies.push(
            {
              x,
              y,
              lat: 43 - y * 0.05,
              lng: 124 + x * 0.1,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          );
        }
      }
    }
    
    return queryInterface.bulkInsert("Pies", pies, {});
    
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Pies", null, {});
  }
};
