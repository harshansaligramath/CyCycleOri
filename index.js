require('dotenv').config()
const mongoose = require("mongoose");
mongoose.connect(process.env.DB);
// const path=require('path')
const cors=require("cors"); 
const nocache = require("nocache")

 
 
const express = require("express");
const app = express();
app.use(cors());


app.set('view engine', 'ejs');
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(nocache());


const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);
app.all('*', (req, res) => { 
  res.render("errorpage")
})

app.listen(3000, function () {
  console.log("server is running at 3000");
}); 
 