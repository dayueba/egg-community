'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  return app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: {
      type: STRING(30),
      allowNull: false,
    },
    phone: {
      type: INTEGER,
      allowNull: false,
    },
    password: {
      type: STRING(64),
      allowNull: false,
    },
    created_at: DATE,
    updated_at: DATE,
  });
};
