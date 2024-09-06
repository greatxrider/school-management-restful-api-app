'use strict';

const { Model, DataTypes } = require('sequelize');

/**
 * Course model definition.
 * @module models/Course
 * @param {Object} sequelize - The Sequelize instance.
 * @returns {Object} - The Course model.
 */
module.exports = (sequelize) => {

  /**
   * Represents a Course.
   * @class
   * @extends Model
   */
  class Course extends Model {

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * @param {Object} models - The models to associate with.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.User, {
        as: 'user',
        foreignKey: {
          fieldName: 'userId',
          allowNull: false,
        },
      });
    }
  }

  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title is required',
        },
        notEmpty: {
          msg: 'Please provide a title',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A description is required',
        },
        notEmpty: {
          msg: 'Please provide a description',
        },
      },
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Course',
  });

  return Course;
};
