const mongoose = require("mongoose");
const ObjectId = new mongoose.Types.ObjectId();
const bcrypt = require('bcrypt')
const validator = require('validator')
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim:true,
    },
    lastName: {
      type: String,
      required: [true, "First name is required"],
      trim:true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      validate: {
        validator: (val) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Please enter a valid email",
      },
      trim:true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be 8 characters or longer"],
      validate: {
        validator: (val) =>
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
            val
          ),
        message: "Please enter a valid password",
      },
      trim:true,
    },
    bio: {
      type: String,
      trim:true,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    image : {
      type:String,
      required:[true,"Please upload a profile picture."],
      trim:true,
    }
  },
  { timestamps: true }
);

// *********** SIGN UP **********
UserSchema.statics.signup = async function(user) {

  // ************ VALIDATION *****************
  if (!user.email || !user.password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(user.email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(user.password)) {
    throw Error('Password not strong enough')
  }

  const exists = await this.findOne({ email: user.email })

  if (exists) {
    throw Error('Email already in use')
  }

  if (user.password!=user.confirmPW){
    throw Error('Passwords Must match')
}

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(user.password, salt)

  const createdUser = await this.create({ ...user, password: hash })

  return createdUser
}

// static login method
UserSchema.statics.login = async function(email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

//************UPDATE USER *****************
UserSchema.statics.updateinfo = async function(id,user) {

  // ************ VALIDATION *****************
  if (!user.email || !user.password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(user.email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(user.password)) {
    throw Error('Password not strong enough')
  }


  if (user.password!=user.confirmPW){
    throw Error('Passwords Must match')
}

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(user.password, salt)

  const createdUser = await this.updateOne({_id:id},{...user, password: hash},{new:true, runValidators:true})

  return createdUser
}

module.exports.User = mongoose.model("User", UserSchema);
