exports.get404 = (req, res, next) => {
  //res.status(404).sendFile(path.join(rootDir,'views','404.html'))
  res.status(404);
  res.render("404", {
    pageTitle: "404 Page Not Found",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500 = (req, res, next) => {
  //res.status(404).sendFile(path.join(rootDir,'views','404.html'))
  res.status(500);
  res.render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};
