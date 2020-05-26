export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  //if not logged in
  return res.redirect(`/login`);
}

export function isAuthenticatedForApi(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  //if not logged in
  return res.status(302).json({
    status: 302,
    message: "Please login again",
  });
}
