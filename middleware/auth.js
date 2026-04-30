function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

function ensureGuest(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/guns');
  }

  return next();
}

module.exports = {
  ensureAuthenticated,
  ensureGuest,
};
