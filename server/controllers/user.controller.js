const {User} = require("../models/user.model")
const jwt = require('jsonwebtoken')


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })}
//********** GET ALL **********

module.exports.getAll=(req, res)=>{
    User.find()
        .then(obj=>{res.json(obj);res.status(201)})
        .catch(err=>{res.status(400).json(err);console.log("ERROR GETTING ALL USER")})
}

//********** GET ONE ***********

module.exports.getOne=(req,res)=>{
    User.findOne({_id:req.params.id}).select('-password')
        .then(obj=>res.json(obj))
        .catch(err=>{res.status(400).json(err);console.log("ERROR GETTING ONE USER")})

}

//********** UPDATE ************
module.exports.updateUser = async (req, res) => {
    try {
        const user = await User.updateinfo(req.params.id,req.body)

// create a token

      res.status(201).json(user);
        } catch (error) {
      res.status(400).json({error: error.message})
    }
}

//*********** DELETE ************

module.exports.delete=(req,res)=>{
    User.deleteOne({_id:req.params.id})
        .then(obj=>res.json(obj))
        .catch(err=>{res.status(400).json(err);console.log("ERROR DELETING USER")})
}

//*********** CREATE ***********

module.exports.create=(req,res)=>{
    User.create(req.body)
        .then(obj=>{res.json(obj);res.status(201)})
        .catch(err=>{res.status(400).json(err);console.log("ERROR CREATING USER")})
}


//************ REJECT REQUEST **********
module.exports.rejReq=(req,res)=>{
    User.updateOne({ _id:req.params.id },{ $pull: { requests: req.params.friendId } })
    .then(obj=>{console.log("Request Rejected");res.json(obj);res.status(201)})
    .catch(err=>{res.status(400).json(err);console.log("ERROR Rejecting")})
}

//************ ACCEPT REQUEST **********
module.exports.accReq=(req,res)=>{
    User.updateOne({ _id:req.params.id },{ $addToSet: { friends: req.params.friendId } })
    .then(obj=>{console.log("FRIEND ADDED");res.json({me:req.params.id, friendId:req.params.friendId});res.status(201);})
    .catch(err=>{res.status(400).json({err});console.log("ERROR ADDING FRIEND")})

    User.updateOne({ _id:req.params.firendId },{ $addToSet: { friends: req.params.id } })
    .then(obj=>{console.log("FRIEND ADDED");})
    .catch(err=>{console.log("ERROR ADDING FRIEND")})

    User.updateOne({ _id:req.params.id },{ $pull: { requests: req.params.friendId } })
    .then(obj=>{console.log("Treated Rquests")})
    .catch(err=>{console.log("ERROR Treating request")})
}

//************ DELETE FRIEND **********
module.exports.deleteFriend=(req,res)=>{
    User.updateOne({ _id:req.params.id },{ $pull: { friends: req.params.friendId } })
    .then(obj=>{console.log("FRIEND REMOVED");res.json(obj);res.status(201)})
    .catch(err=>{res.status(400).json(err);console.log("ERROR DELETING FRIEND")})

    User.updateOne({ _id:req.params.friendId },{ $pull: { friends: req.params.id } })
    .then(obj=>{console.log("FRIEND REMOVED",obj)})
    .catch(err=>{console.log("ERROR DELETING FRIEND")})
}

//************ GET USER WITH THEIR FRIEND' DETAILS ***********************
module.exports.getOneWF=(req,res)=>{
    User.findById({_id:req.params.id})
    .populate('friends').populate('requests') // Populate the 'friends' field with user documents
    .exec()
    .then(obj => {
        if (!obj) {
        console.log('User not found');
        } else {
        console.log('User with friends:', res.json(obj));
        }
    })
    .catch(err=>{res.status(400).json(err);console.log("GETTING USER WITH FRIENDS")})

}

//********** LOGIN ************

module.exports.loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.login(email, password)
        const userId = user._id.toString()
// create a token

        const token = createToken(user._id)
        console.log(user._id)
        res.status(201).cookie('token', token).cookie('userId',userId).json({'token':token,'userId':user._id});
        }
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

//*********** SIGN UP **********

module.exports.signupUser = async (req, res) => {
    const {email} = req.body

    try {
        const user = await User.signup(req.body)

// create a token

      const token = createToken(user._id)
      const userId = user._id.toString()
      res.status(201).cookie('token', token).cookie('userId',userId).json({'email':email,'token':token});
        } catch (error) {
      res.status(400).json({error: error.message})
    }
}

//*************LOGOUT******************
module.exports.logout = async (req,res) => {
    const {token} = req.cookies;
    if(!token){
        return res.status(400).json({message:'Token not found.'})
    }
    try {
        res.clearCookie('token');
        res.clearCookie('userId');
        res.status(204).json({message:"User Logged out successfully."})
    } catch (error) {
         res.status(400).json(error)
    }
}

//*****************SEND REQUEST***********
module.exports.sendReq=(req,res)=>{
    User.updateOne({_id:req.params.friendId}, {$addToSet: {requests:req.params.id}})
        .then(obj=>{res.json(obj);res.status(201);console.log("REQUEST SEND")})
        .catch(err=>{res.status(400).json(err);console.log("ERROR SENDING REQ")})
    }

//*****************CANCEL REQUEST***********
module.exports.cancReq=(req,res)=>{
    User.updateOne({_id:req.params.friendId}, {$pull: {requests:req.params.id}})
        .then(obj=>{res.json(obj);res.status(201);console.log("REQUEST CANCELED")})
        .catch(err=>{res.status(400).json(err);console.log("ERROR CANCELING REQ")})
    }
