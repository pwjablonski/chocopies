"use strict";

const EAT =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEMAIL-Eat-Chocopie-Together-Mina-Cheon-EAT.jpg?v=1597433318984";
const UNITE =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEMAIL-Eat-Chocopie-Together-Mina-Cheon-UNITE.jpg?v=1597433312753";
const SHARE =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEMAIL-Eat-Chocopie-Together-Mina-Cheon-SHARE.jpg?v=1597433313118";
const PEACE =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEMAIL-Eat-Chocopie-Together-Mina-Cheon-PEACE.jpg?v=1597433315029";
const LOVE =
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEMAIL-Eat-Chocopie-Together-Mina-Cheon-LOVE.jpg?v=1597433317404";

const idToImageURL = function(id) {
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
};

module.exports = idToImageURL;
