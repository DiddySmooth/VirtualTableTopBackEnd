'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userGame extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userGame.init({
    gameId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    online: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'userGame',
  });
  return userGame;
};