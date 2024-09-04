'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

/**
 * User model definition.
 * @module models/User
 * @param {Object} sequelize - The Sequelize instance.
 * @returns {Object} - The User model.
 */
module.exports = (sequelize) => {
  /**
   * Represents a User.
   * @class
   * @extends Model
   */
  class User extends Model {
    /**
    * Helper method for defining associations.
    * This method is not a part of Sequelize lifecycle.
    * The `models/index` file will call this method automatically.
    * @param {Object} models - The models to associate with.
    */
    static associate(models) {
      // define association here
      User.hasMany(models.Course, {
        as: 'courses',
        foreignKey: {
          fieldName: 'userId',
          allowNull: false,
        },
      });
    };
  };

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required',
        },
        notEmpty: {
          msg: 'Please provide a first name',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required',
        },
        notEmpty: {
          msg: 'Please provide a last name',
        },
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The email you entered already exists',
      },
      validate: {
        notNull: {
          msg: 'An email is required',
        },
        isEmail: {
          msg: 'Please provide a valid email address',
        },
        notEmpty: {
          msg: 'Please provide an email',
        }
      }
    },
    rawPassword: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A raw password is required',
        },
        notEmpty: {
          msg: 'Please provide a raw password',
        },
        len: {
          args: [8, 20],
          msg: 'The raw password should be between 8 and 20 characters in length',
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if (val === this.rawPassword) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPassword);
        }
      },
      validate: {
        notNull: {
          msg: 'The password confirmation is required',
        },
        notEmpty: {
          msg: 'Please provide a value for confirmation password',
        },
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
