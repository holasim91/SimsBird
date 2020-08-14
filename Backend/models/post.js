module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post',{ 
        content: {
            type: DataTypes.TEXT,
            allowNull: false, // 필수
        }
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', //이모티콘 저장

    } );
    Post.associate = (db) => {
        db.Post.belongsTo(db.User)   // n:1 === 1:n 관계
        db.Post.belongsToMany(db.Hashtag,{through: 'PostHashtag'}) // n:n 관계 중간에 각 테이블을 합친 가상테이블이 생성된다.
        db.Post.hasMany(db.Comment) 
        db.Post.hasMany(db.Image)
        db.Post.belongsToMany(db.User, {through: 'Like', as: 'Likers'})
        db.Post.belongsTo(db.Post, { as: 'Retweet', })   // Retweet
        

    };
    return Post;
}