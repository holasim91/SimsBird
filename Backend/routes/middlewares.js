exports.isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
        next()
    }else{
        res.status(401).send('로그인을 해주세요')
    }
}

exports.isNotLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        next()
    }else{
        res.status(401).send('로그인을 하지 않은 유저만 접근 가능합니다')
    }
}
