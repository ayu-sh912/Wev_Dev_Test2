const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

passport.use(
  new LocalStrategy({ usernameField: 'name' }, async (name, password, done) => {
    try {
      const normalizedName = String(name || '').trim();

      if (!normalizedName) {
        return done(null, false, { message: 'Invalid name or password.' });
      }

      const user = await User.findOne({ name: normalizedName });

      if (!user) {
        return done(null, false, { message: 'Invalid name or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid name or password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
