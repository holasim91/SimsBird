const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config.js')[env]
const db ={}

const sequelize = new Sequelize(config.database, config.username, config.password, config) //  sequelize가 노드와 mysql을 연결시켜줌

db.Comment = require('./comment')(sequelize, Sequelize)
db.Hashtag = require('./hashtag')(sequelize, Sequelize)
db.Image = require('./image')(sequelize, Sequelize)
db.Post = require('./post')(sequelize, Sequelize)
db.User = require('./user')(sequelize, Sequelize)

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}); //관계들 연결

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
