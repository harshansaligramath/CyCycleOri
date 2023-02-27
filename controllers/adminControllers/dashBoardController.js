const User = require("../models/userModel");



const loadDashboard = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.admin_id });
    res.render("dashboard", { admin: userData });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadDashboard,
  
};
