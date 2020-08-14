const express = require('express')
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const dotenv = require('dotenv')
const morgan = require('morgan');
const path = require('path');
const hpp = requore('hpp');
const helmet = require('helmet');

const postRouter = require('./routes/post')
const postsRouter = require('./routes/posts')
const userRouter = require('./routes/user')
const hashtagRouter = require('./routes/hashtag')
const db = require('./models')
const passportConfig = require('./passport')

dotenv.config( )
const app = express()
const port = 80
db.sequelize.sync()
    .then(() => {
        console.log('DB Connect Success!!!!')
    })
    .catch(console.error)
passportConfig() ;   

if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'));
    app.use(hpp());
    app.use(helmet());

}else{
    app.use(morgan('dev'))
}
app.use(cors({
    origin: ['http://localhost:3030','simsbird.com'], //CORS
    credentials: true, //쿠키 백엔드로 전달 
}))

app.use('/', express.static(path.join(__dirname, 'uploads')))
app.use(express.json()) //json형태의 데이터를 req.body에 넣는 역할
app.use(express.urlencoded({extended: true})) //form - submit형태의 데이터 req.body에 넣는 역할
// 프론트에서 보낸 데이터를 req.body에 넣는 역할
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
}))
app.use(passport.initialize())
app.use(passport.session())


app.use('/posts',postsRouter)
app.use('/post',postRouter)
app.use('/user',userRouter)
app.use('/hashtag',hashtagRouter)

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))