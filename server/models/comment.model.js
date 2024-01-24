const mongoose = require("mongoose");
const ObjectId = new mongoose.Types.ObjectId();

const CommentSchema = new mongoose.Schema(
  {
    author : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post : { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    content: {
      type: String,
      required: [true, "Please Add a comment"],
      trim:true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
    },
  { timestamps: true }
);



module.exports.Comment = mongoose.model("Comment", CommentSchema);