const {Post} = require("../models/post.model")
const {Comment} = require("../models/comment.model");
const { User } = require("../models/user.model");

//********** GET ALL **********

module.exports.getAll=(req, res)=>{
    Post.find().sort({ createdAt: 'desc'})
        .populate('comments').populate('likes').populate('author').exec()
        .then(allPosts=>res.status(200).json({ allPosts, message: 'All Notes', ok: true }))
        .catch(err=>{res.status(400).json(err);console.log("ERROR GETTING ALL POST")})
    }
//********** GET FRIENDS POSTS**********

module.exports.getAllF = async (req, res) => {
    try {
        const currUser = await User.findOne({ _id: req.params.id });

        const allPosts = await Post.find({ author: { $in: currUser.friends } })
            .sort({ createdAt: 'desc' })
            .populate('comments')
            .populate('likes')
            .populate('author')
            .exec();

        res.status(200).json({ allPosts, message: 'All Notes', ok: true });
    } catch (err) {
        res.status(400).json(err);
        console.log("ERROR GETTING ALL POST");
    }
};


//********** GET ONE ***********

module.exports.getOne=(req,res)=>{
    Post.findOne({_id:req.params.id})
        .then(obj=>res.json(obj))
        .catch(err=>{res.status(400).json(err);console.log("ERROR GETTING ONE POST")})

}

//********** UPDATE ************

module.exports.update=(req,res)=>{
    Post.updateOne({_id:req.params.id},req.body,{new:true, runValidators:true})
    .then (obj=>res.json(obj))
    .catch(err=>{res.status(400).json(err);console.log("ERROR UPDATING POST")})
}

//*********** DELETE ************

module.exports.delete=(req,res)=>{
    Post.deleteOne({_id:req.params.id})
        .then(obj=>{res.json(obj);
            Comment.deleteMany({post:req.params.id}).then(obj=>console.log("COMMENT CLEARED")).catch(err=>{res.status(400);})
        })
        .catch(err=>{res.status(400).json(err);console.log("ERROR DELETING POST")})
    }

//*********** CREATE ***********

module.exports.create=(req,res)=>{
    Post.create({...req.body, author:req.params.authorId})
        .then(obj=>{res.json(obj);res.status(201)})
        .catch(err=>{res.status(400).json(err);console.log("ERROR CREATING POST")})
    }

//*********** LIKE POST **********

module.exports.likePost=(req,res)=>{
    Post.updateOne({_id:req.params.postId}, {$addToSet: {likes:req.params.userId}})
        .then(obj=>{res.json(obj);res.status(201);console.log("POST LIKED")})
        .catch(err=>{res.status(400).json(err);console.log("ERROR LIKING POST")})
    }

//*********** DisLIKE POST **********

module.exports.dislikePost=(req,res)=>{
    Post.updateOne({_id:req.params.postId}, {$pull: {likes:req.params.userId}})
        .then(obj=>{res.json(obj);res.status(201);console.log("POST DISLIKED")})
        .catch(err=>{res.status(400).json(err);console.log("ERROR DISLIKING POST")})
    }

module.exports.getAllById = async (req,res)  =>  {
        try {
            const authorId = req.params.authorId
            console.log(authorId)
            const userPosts = await Post.find({author:authorId}).sort({ createdAt: 'desc'}).populate('comments').populate('likes').populate('author').exec()
            if  (!userPosts){
    
                res.status(404).json("❌❌❌❌❌")
                console.log("test1")
            }else{
                res.status(200).json(userPosts)
                console.log("test2")
            }
    
        }catch(err){
            console.error(err.message,"test3")
            res.status(500).json({message : "Server Error"})
        }
    }