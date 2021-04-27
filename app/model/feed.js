'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  return app.model.define('feed', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: INTEGER,
      allowNull: false,
    },
    content: {
      type: STRING(255),
      allowNull: false,
    },
    created_at: DATE,
    updated_at: DATE,
  });
};
