const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    email :{
        type : String,
        unique : true
    },
    password : {
        type : String,
        require : true
    },
    role :{
        type : String,
        require : true,
        enum: ["job_seeker", "employer"]
    },
    companyLogo :{
        type : String,
        default : ""
    }
})

const User = new mongoose.model("User", userSchema);
module.exports = User;
