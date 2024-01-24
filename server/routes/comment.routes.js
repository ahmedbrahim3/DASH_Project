const CommentController = require("../controllers/comment.controller")

module.exports=(app)=>{
    app.get("/api/comments",CommentController.getAll)
    app.get("/api/comments/:id",CommentController.getOne)
    app.get("/api/comments/post/:id",CommentController.getByPost)
    app.post("/api/comments/:authorId/:postId",CommentController.create)
    app.put("/api/comments/:id",CommentController.update)
    app.put("/api/comments/like/:userId/:commentId",CommentController.likeComment)
    app.put("/api/comments/dislike/:userId/:commentId",CommentController.dislikeComment)
    app.delete("/api/comments/:id/:postId",CommentController.delete)

};