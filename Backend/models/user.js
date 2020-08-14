module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User", //   DB에 users로 바뀌어서 저장됨
    {
      email: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
        unique: true, //  고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
    }
  );
  User.associate = (db) => {
    db.User.hasMany(db.Post)
    db.User.hasMany(db.Comment)
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked'}) //사용자와 게시글의 좋아요 관계 as:별칭
    // through: n:n관계에서 자동으로 생기는 테이블의 이름을 정할 수 있는 곳 반드시 상대 테이블에서도 입력해줘야한다
    db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' })
    db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' })
    // 나를 먼저 찾고 그 다음에 조건을 찾자, 같은 테이블내에서 관계를 지어야하면 foreignKey를 지정해줘야한다
  }; //테이블 관계 작상하는 곳
  return User;
};
