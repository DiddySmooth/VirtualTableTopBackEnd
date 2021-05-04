'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tokens.init({
    x: {type:DataTypes.INTEGER, allowNull: false, defaultValue: 50 },
    y: {type:DataTypes.INTEGER, allowNull: false, defaultValue: 50 },
    picture: DataTypes.STRING,
    name: DataTypes.STRING,
    gameId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tokens',
  });
  return tokens;
};