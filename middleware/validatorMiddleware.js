const {validationResult} = require('express-validator');

const validtorMiddleware  = (req,res,next)=>{
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next();
}


module.exports = validtorMiddleware;