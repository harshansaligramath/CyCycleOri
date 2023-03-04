const Banner = require("../../models/banner");
const Category = require("../../models/category");


const loadHome = async (req, res) => {
    try {

      
      const categoryData = await Category.find()
      let { search,  } = req.query
      if (!search) {
          search = ''
      }
     
      


      bannerData = await Banner.find();
      console.log(bannerData);
      if (req.session.user) {
        session = req.session.user;
      } else session = false;
      res.render("home", { user: session,banner:bannerData,val: search,});
    } catch (error) {
      console.log(error.message);
    }
  };
module.exports = {
    loadHome
};

