const User = require("../../models/userModel");
const bcrypt = require("bcrypt");

const loadLogin = async (req, res) => {
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
  
      const userData = await User.findOne({ email: email });
  
      if (userData) {
        const passwordMatch = await bcrypt.compare(password, userData.password);
  
        if (passwordMatch) {
          if (userData.is_admin === 0) {
            res.render("login", { message: "email and password incorrect" });
          } else {
            req.session.admin_id = userData._id;
            res.redirect("/admin/dashboard");
          }
        } else {
          res.render("login", { message: "email and password is incorrect" });
        }
      } else {
        res.render("login", { message: "email and password is incorrect" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const logout = async (req, res) => {
    try {
      req.session.admin_id = null;
      res.redirect("/admin");
    } catch (error) {
      console.log(error.message);
    }
  };
  
const loadDashboard = async (req, res) => {
    try {
      const userData = await User.findById({ _id: req.session.admin_id });
      res.render("dashboard", { admin: userData });
    } catch (error) {
      console.log(error.message);
    }
  };
  const loadUsers = async (req, res) => {
    try {
      var search = "";
      if (req.query.search) {
        // console.log("re"+req.query);
        search = req.query.search;
        // console.log("search:"+search);
      }
      const userData = await User.find({
        is_admin: 0,
        $or: [
          { name: { $regex: ".*" + search + ".*" } },
          { email: { $regex: ".*" + search + ".*" } },
          { mobile: { $regex: ".*" + search + ".*" } },
        ],
      });
      res.render("users", { users: userData, val: search });
    } catch (error) {
      console.log(error.message);
    }
  };
  const blockUser = async (req, res) => {
    try {
      const id = req.query.id;
      const userData = await User.findOne({ _id: id });
      if (userData.is_verified) {
        const userData = await User.findByIdAndUpdate(
          { _id: id },
          { $set: { is_verified: 0 } }
        );
        console.log("blocked");
      } else {
        await User.findByIdAndUpdate({ _id: id }, { $set: { is_verified: 1 } });
      }
      console.log("unblocked");
      res.redirect("/admin/users");
    } catch (error) {
      console.log(error);
    }
  };
module.exports = {
    loadLogin,
    verifyLogin,
    logout,
    loadDashboard,
    loadUsers,
    blockUser
};
