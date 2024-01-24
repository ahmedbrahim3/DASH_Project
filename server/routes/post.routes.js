const PostController = require("../controllers/post.controller")

module.exports=(app)=>{
    app.get("/api/posts",PostController.getAll)
    app.get("/api/posts/:id",PostController.getOne)
    app.get("/api/posts/f/:id",PostController.getAllF)
    app.get("/api/profilePosts/:authorId" , PostController.getAllById)
    app.post("/api/posts/:authorId",PostController.create)
    app.put("/api/posts/:id",PostController.update)
    app.put("/api/posts/like/:userId/:postId",PostController.likePost)
    app.put("/api/posts/dislike/:userId/:postId",PostController.dislikePost)
    app.delete("/api/posts/:id",PostController.delete)
};