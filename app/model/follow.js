'use strict';

module.exports = app => {
  const { INTEGER, DATE, TINYINT } = app.Sequelize;

  return app.model.define('follow', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: INTEGER,
      allowNull: false,
    },
    follow_user_id: {
      type: INTEGER,
      allowNull: false,
    },
    status: {
      type: TINYINT,
      allowNull: false,
    },
    created_at: {
      type: DATE,
      allowNull: false,
    },
    updated_at: {
      type: DATE,
      allowNull: false,
    },
  });
};
