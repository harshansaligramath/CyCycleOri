const Banner = require("../../models/banner");

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
module.exports = {
    loadHome
};
