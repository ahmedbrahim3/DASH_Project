const mongoose = require("mongoose");
const ObjectId = new mongoose.Types.ObjectId();
const PostSchema = new mongoose.Schema(
  {
    author : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: {
      type: String,
      required: [true, "Please Add a description"],
      trim:true,
    },
    code: {
      type: String,
    },

    image: {
      type: String,

    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    likes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);



module.exports.Post = mongoose.model("Post", PostSchema);