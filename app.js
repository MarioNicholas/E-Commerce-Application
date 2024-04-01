const express = require("express"); //import express js
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const https = require("https");

const MONGODBURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.qumrgtk.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?`;

const app = express(); //routing a server fot createServer
const store = new mongoDBStore({
  uri: MONGODBURL,
  collection: "sessions",
});
const csrfProtection = csrf();
const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");

const errorController = require("./controllers/error");
const User = require("./models/user");
const { MongoDBStore } = require("connect-mongodb-session");
// const monggoConnect = require("./util/database").monggoConnect;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilters = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
//app.set('view engine', 'pug'); this is used to create pug template
app.set("views", "views");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(helmet()); //helmet is for setting secure response header for deployment
app.use(compression()); //Compression is for compressing assets for deployment
app.use(morgan("combined", { stream: accessLogStream })); //For setting up request log

//parsing incoming request body by installing new package (BodyParser)
app.use(bodyParser.urlencoded({ extended: false })); //parsing body through forms
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilters }).single("image")
); //Middleware for image uploader
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

//Set Local variabel to pass data to every view (fuck cumbursome)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

//add middleware route function. This function will be executed every incoming request
app.use("/admin", adminRoutes); //path : /admin/...
app.use(shopRoute);
app.use(authRoute);

app.get("/500", errorController.get500);

//404 page
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});
//Connect using mongodb
// monggoConnect(() => {
//   app.listen(3000);
// });

mongoose
  .connect(MONGODBURL)
  .then((result) => {
    //start server at https manually
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    next(new Error(err));
  });
