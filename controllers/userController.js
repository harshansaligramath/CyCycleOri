const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const Product = require("../models/product");
const Banner = require("../models/banner");

const loadRegister = async (req, res) => {
  try {
    res.render("register", { active: 1 });
  } catch (error) {
    console.log(error.message);
  }
};

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};
const insertUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    // console.log("sp"+spassword)
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mno,
      password: spassword,
      is_admin: 0,
    });
    const userData = await user.save();
    console.log(userData);

    if (userData) {
      res.redirect("/");
      // res.render('registration', { message: "your registration is succesful" })
    } else {
      res.render("registration", { message: "your registration is failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const fast2sms = require("fast-two-sms");
require("dotenv").config();

const sendMessage = function (mobile, res, next) {
    let randomOTP = Math.floor(Math.random() * 9000) + 1000
    var options = {
        authorization: process.env.SMS_API,
        message: `your OTP verification code is ${randomOTP}`,
        numbers: [mobile],
    };
    fast2sms
        .sendMessage(options)
        .then((response) => {
            console.log("otp sent successfully");
        })
        .catch((error) => {
            console.log(error);
        });
    return randomOTP;
};
let user
const loadOtp = async (req, res) => {
    try {
        const is_user = await User.findOne({$or:[{ email: req.body.email }, { mobile: req.body.phone }]})
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
            newOtp = sendMessage(req.body.phone, res);
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
      newOtp = sendMessage(req.body.phone, res);
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
              res.render('login', { message: "your registration is failed", active: 1 })
          }
      } else {
          res.render('login', { message: "otp entered is incorrect", active: 1 })
          console.log("otp is incorrect");
      }
  } catch (error) {
      console.log(error.message);
  }
}

// login user

const loginLoad = async (req, res) => {
  try {
    res.render("login", { active: 0 });
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
            active: 0,
          });
        }
      } else {
        res.render("login", {
          message: "email or password is incorrect",
          active: 0,
        });
      }
    } else {
      res.render("login", { message: "invalid user credentials", active: 0 });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    bannerData = await Banner.find();
    console.log(bannerData);
    if (req.session.user) {
      session = req.session.user;
    } else session = false;
    res.render("home", { user: session,banner:bannerData});
  } catch (error) {
    console.log(error.message);
  }
};

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

const loadProducts = async (req, res) => {
  try {
    productData = await Product.find();
    console.log(productData);
    if (req.session.user) {
      session = req.session.user;
    } else session = false;
    res.render("products", { user: session, product: productData });
  } catch (error) {
    console.log(error.message);
  }
};

// const loadBannerDatas = async (req, res) => {
//     try {

//     } catch (error) {
//         console.log(error.message);
//     }
// }

module.exports = {
  loadRegister,
  // insertUser,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  loadProducts,
  loadOtp,
  resendOtp,
  verifyOtp
  
  
};
