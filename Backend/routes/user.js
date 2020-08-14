const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Op } = require('sequelize')

const { User, Post, Comment, Image } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();


router.get("/", async (req, res, next) => {
  console.log(req.headers , 'HEADER')
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        }, //  DB에서 password만 빼고 다 가져와줘잉
        include: [
          {
            model: Post,
            attributes: ['id'], //데이터 효율을 위해 전체 데이터가 아닌 id만 가져온다
          },
          {
            model: User,
            as: "Followings",
            attributes: ['id'],
          },
          {
            model: User,
            as: "Followers",
            attributes: ['id'],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/followers', isLoggedIn, async(req, res, next) => { // GET user/followers
  try{
    const user = await User.findOne({where : {id: req.user.id}})
    if(!user){
      res.status(403).json('존재하지 않는 회원 입니다')
    }
    const followers = await user.getFollowers({
       limit: parseInt(req.query.limit)
    })
    res.status(200).json(followers)
  }catch(error){
    console.error(error)
    next(error)
  }
})

router.get('/followings', isLoggedIn, async(req, res, next) => { // GET user/followings
  try{
    const user = await User.findOne({where : {id: req.user.id}})
    if(!user){
      res.status(403).json('존재하지 않는 회원 입니다')
    }
    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit)
    })
    res.status(200).json(followings)
  }catch(error){
    console.error(error)
    next(error)
  }
})

router.get('/:userId/posts', async (req, res, next) => {  //GET /user/1/posts
  try{
      const where = {UserId : req.params.userId }
      if(parseInt(req.query.lastId, 10)){ //  초기로딩이 아닐때
           where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
      }
      const posts = await Post.findAll({
          where,
          limit: 10,
          order:[
              ['createdAt', 'DESC'],  // 최신 게시물부터
              [Comment, 'createdAt', 'DESC'], 
              ],
          include:[{
              model: User,
              attributes:['id', 'nickname'],
          },{
              model: Image
          },{
              model: Comment,
              include:[{
                  model: User,
                  attributes:['id', 'nickname'],
              }]
          },{
              model: User,  //  좋아요 누른 사람
              as: 'Likers',
              attributes:['id'],
            },{
              model: Post,
              as: 'Retweet',
              include:[{
                model: User,
                attributes: ['id', 'nickname'],
              },{
                model: Image,
              }]
            }]
      })
      res.status(200).json(posts)
  }catch(error){
      console.error(error)
      next(error)
  }
})

router.get('/:id', async (req, res, next) => { // GET /user/3
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: Post,
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id'],
      }]
    })
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length;
      data.Followings = data.Followings.length;
      data.Followers = data.Followers.length;
      res.status(200).json(data);
    } else {
      res.status(404).json('존재하지 않는 사용자입니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason); //ClientError
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        }, //  DB에서 password만 빼고 다 가져와줘잉
        include: [
          {
            model: Post,
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
}); //미들웨어 확장

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("logout OK");
});

router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 email 입니다.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 11);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(200).send("OK!");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/nickname', isLoggedIn, async(req, res, next) => {
  try{
    await User.update({
      nickname: req.body.nickname
    },{
      where : { id: req.user.id },
    })
    res.status(200).json({nickname: req.body.nickname})
  }catch(error){
    console.error(error)
    next(error)
  }
})

router.patch('/:userId/follow', isLoggedIn, async(req, res, next) => { // PATCH user/1/follow
  try{
    const user = await User.findOne({where : {id: req.params.userId}}) // 유저가 존재하는지 확인
    if(!user){
      res.status(403).json('존재하지 않는 회원 입니다')
    }
    await user.addFollowers(req.user.id)
    res.status(200).json({UserId: parseInt(req.params.userId, 10)})
  }catch(error){
    console.error(error)
    next(error)
  }
})


router.delete('/:userId/follow', isLoggedIn, async(req, res, next) => {  // DELETE user/1/follow
  try{
    const user = await User.findOne({where : {id: req.params.userId}}) // 유저가 존재하는지 확인
    if(!user){
      res.status(403).json('존재하지 않는 회원 입니다')
    }
    await user.removeFollowers(req.user.id)
    res.status(200).json({UserId: parseInt(req.params.userId, 10)})
  }catch(error){
    console.error(error)
    next(error)
  }
})

router.delete('/follower/:userId', isLoggedIn, async(req, res, next) => {  // DELETE user/follower/2
  try{
    const user = await User.findOne({where : {id: req.params.userId}}) 
    if(!user){
      res.status(403).json('없는 사람을 차단하려고 하십니까..?')
    }
    await user.removeFollowings(req.user.id)
    res.status(200).json({UserId: parseInt(req.params.userId, 10)})
  }catch(error){
    console.error(error)
    next(error)
  }
})

module.exports = router;

