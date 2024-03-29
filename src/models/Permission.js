"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Permission.belongsToMany(models.Role, {
        through: "RolePermissions",
        as: "roles",
        foreignKey: "permission_id",
      });
      Permission.belongsToMany(models.User, {
        through: "UserPermissions",
        foreignKey: "permission_id",
      });
    }
  }
  Permission.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Permission already exist!",
        },
      },
    },
    {
      sequelize,
      modelName: "Permission",
      timestamps: false,
    }
  );
  return Permission;
};
