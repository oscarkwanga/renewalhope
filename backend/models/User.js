const mongoose=require('mongoose');



const usersschema=mongoose.Schema({
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    contact:{
        type:String
    },
    admin:{
        type:String,
        default:'false'
    },
    space:{
         type:String,
    },
    coverimage:{
        type:String,
    },
    token:{
        type:String,
   },
   rating:{type:String},
   role:{type:String,default:'user'},
   notifications: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      message: String,
      typesent:String,
      reference:String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  lastLogin: {
  type: Date,
  default: null
},
resetPasswordToken: String,
resetPasswordExpires: Date,

  loged:{type:Boolean,default:false}
  
   
})

module.exports = mongoose.model('Users',usersschema)




