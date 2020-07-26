'use strict';

const EAT =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-EAT.png?v=1593119005599";
const UNITE =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-UNITE.png?v=1593119006333";
const SHARE =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-SHARE.png?v=1593119006137";
const PEACE =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-PEACE.png?v=1593119005876";
const LOVE =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-LOVE.png?v=1593119005767";

const idToImageURL = function (id) {
  let imageURL;
  const idModFive = id % 5;

  if (idModFive === 0) {
    imageURL = EAT;
  } else if (idModFive == 1) {
    imageURL = UNITE;
  } else if (idModFive === 2) {
    imageURL = PEACE;
  } else if (idModFive === 3) {
    imageURL = SHARE;
  } else if (idModFive === 4) {
    imageURL = LOVE;
  }
  return imageURL;
}

module.exports = idToImageURL;