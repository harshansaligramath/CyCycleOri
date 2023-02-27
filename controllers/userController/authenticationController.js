const User = require("../../models/userModel");
const bcrypt = require("bcrypt");

const fast2sms = require("fast-two-sms");
require("dotenv").config();

// login user

const loginLoad = async (req, res) => {
    try {
      res.render("login");
    } catch (error) {
      console.log(error.message);
    }
  };
  

  
const verifyLogin = async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
  
      const userData = await User.findOne({ email: email, is_admin: 0 });
      console.log("user:" + userData);
      if (userData) {
        const passwordMatch = await bcrypt.compare(password, userData.password);
        // console.log("user p:"+password)
        // console.log("diclear p:"+userData.password)
        // console.log("user:"+passwordMatch)
        if (passwordMatch) {
          if (userData.is_verified) {
            req.session.user_id = userData._id;
            req.session.user = userData.name;
            req.session.user1 = true;
            const status = await User.findByIdAndUpdate(
              { _id: userData._id },
              { $set: { status: 1 } }
            );
            console.log(status);
            res.redirect("/");
          } else {
            res.render("login", {
              message:
                "You have been temporarily blocked by the Administrator , Please login after sometime",
              
            });
          }
        } else {
          res.render("login", {
            message: "email or password is incorrect",
            
          });
        }
      } else {
        res.render("login", { message: "invalid user credentials"});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  
const loadforget = async (req, res) => {
    try {
        res.render('forget', );
    }
    catch (error) {
        console.log(error.message);
    }
  };

  const verifyforget = async (req, res) => {
    try {
        const is_user =await User.findOne({ mobile: req.body.mno })
        console.log(is_user+'mno '+req.body.mno);
        if(is_user){
            newOtp = sendMessage(req.body.mno, res);
            console.log(newOtp);
            res.render('otp2',{otp:newOtp,user:is_user})
    }else{
        res.render('forget', { user:'',message :'no user found' });
    }}
    catch (error) {
        console.log(error.message);
    }
  };
  const resetPassword = async(req,res)=>{
    try {
        if(req.query.otp==req.body.otp){
          const spassword = await bcrypt.hash(req.body.password, 10);  
          const userData =await User.updateOne({_id:req.query.id},{$set:{password:spassword}})
          console.log(userData);
          console.log('password changed successfully');
          res.redirect('login')
        }else{
            newOtp = sendMessage(req.body.mno, res);
            console.log(newOtp);
            res.render('otp2',{otp:newOtp,user:is_user,head:1}) 
        }
    } catch (error) {
        
    }
  }
  const userLogout = async (req, res) => {
    try {
      req.session.user1 = null;
      req.session.user = null;
      time = new Date().getHours() + ":" + new Date().getMinutes();
      const status = await User.findByIdAndUpdate(
        { _id: req.session.user_id },
        { $set: { status: time } }
      );
      console.log(status);
  
      res.redirect("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadRegister = async (req, res) => {
    try {
      res.render("register", { active: 1 });
    } catch (error) {
      console.log(error.message);
    }
  };

  let user
const loadOtp = async (req, res) => {
    try {
        const is_user = await User.findOne({$or:[{ email: req.body.email }, { mobile: req.body.mno }]})
        // const is_user=await User.findOne({email: req.body.email})
        console.log(is_user);
        if (is_user) {
            res.render('login', { message: 'user already exists'})
        } else {
            const spassword = await bcrypt.hash(req.body.password, 10);
            user = new User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mno,
                password: spassword,
                is_admin: 0
            });
            console.log(user);
            newOtp = sendMessage(req.body.mno, res);
            console.log(newOtp);
            const userData = await User.find()
            res.render("otp", { otp: newOtp, user: userData,head:1 })
        }
    } catch (error) {
        console.log(error.message);
    }
}
const resendOtp = async (req, res) => {
    try {
        newOtp = sendMessage(req.body.mno, res);
        console.log(newOtp);
        const userData = await User.find()
        res.render("otp", { otp: newOtp, user: userData ,head:1})
    } catch (error) {
        console.log(error.message);
    }
  
  }

  const verifyOtp = async (req, res) => {

    try {
        if (req.query.id == req.body.otp) {
            const userData = await user.save()
            if (userData) {
                req.session.user_id = userData._id;
                req.session.user = userData.name;
                req.session.user1 = true
                await User.findByIdAndUpdate({ _id: userData._id }, { $set: { status: 1 } })
                res.redirect('/')
            }
            else {
                res.render('login', { message: "your registration is failed"})
            }
        } else {
            res.render('login', { message: "otp entered is incorrect"})
            console.log("otp is incorrect");
        }
    } catch (error) {
        console.log(error.message);
    }
  }
module.exports = {
    loginLoad,
    verifyLogin,
    loadforget,
    verifyforget,
    resetPassword,
    userLogout,
    loadRegister,
    loadOtp,
    resendOtp,
    verifyOtp
};
