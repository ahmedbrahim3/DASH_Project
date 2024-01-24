const {Comment} = require("../models/comment.model")
const{Post} = require("../models/post.model")

//********** GET ALL **********

module.exports.getAll=(req, res)=>{
    Comment.find()
        .then(obj=>{res.json(obj);res.status(201)})
        .catch(err=>{res.status(400).json(err);console.log("ERROR GETTING ALL COMMENT")})
}

//********** GET ONE ***********

module.exports.getOne=(req,res)=>{
    Comment.findOne({_id:req.params.id})
        .then(obj=>res.json(obj))
        .catch(err=>{res.status(400).json(err);console.log("ERROR GETTING ONE COMMENT")})

}
//********** GET BY POST ID ***********

module.exports.getByPost=(req,res)=>{
    Comment.find({post:req.params.id}).sort({ createdAt: 'desc'}).populate('author').exec()
        .then(obj=>res.json(obj))
        .catch(err=>{res.status(400).json(err);console.log("ERROR GETTING ONE COMMENT")})

}

//********** UPDATE ************

module.exports.update=(req,res)=>{
    Comment.updateOne({_id:req.params.id},req.body,{new:true, runValidators:true})
    .then (obj=>res.json(obj))
    .catch(err=>{res.status(400).json(err);console.log("ERROR UPDATING POST")})
}

//*********** DELETE ************

module.exports.delete=(req,res)=>{
    Comment.deleteOne({_id:req.params.id})
        .then(obj=>{res.json(obj);
            Post.updateOne({ _id:req.params.postId },{ $pull: { comments: req.params.id } })
                .then(obj=>{console.log("COMMENT DELETED");res.json(obj);res.status(201)})
                .catch(err=>{res.status(400).json(err);console.log("ERROR DELETING COMMENT")})
            })
        .catch(err=>{res.status(404);})
}

//*********** CREATE ***********

module.exports.create=(req,res)=>{
    Comment.create({...req.body, author:req.params.authorId, post:req.params.postId})
        .then(obj=>{res.json(obj);res.status(201);
            Post.updateOne({ _id:req.params.postId },{ $push: { comments: obj._id } })
            .then(obj=>{console.log("COMMENT ADDED");res.json(obj);res.status(201)})
            .catch(err=>{res.status(400);})
        })
        .catch(err=>{res.status(400);})
}

//*********** LIKE COMMENT **********

module.exports.likeComment=(req,res)=>{
    Comment.updateOne({_id:req.params.commentId}, {$addToSet: {likes:req.params.userId}})
        .then(obj=>{res.json(obj);res.status(201);console.log("COMMENT LIKED")})
        .catch(err=>{res.status(400);})
}

//*********** DISLIKE COMMENT **********

module.exports.dislikeComment=(req,res)=>{
    Comment.updateOne({_id:req.params.commentId}, {$pull: {likes:req.params.userId}})
        .then(obj=>{res.json(obj);res.status(201);console.log("COMMENT DISLIKED")})
        .catch(err=>{res.status(400);})
}

