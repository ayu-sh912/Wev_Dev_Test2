const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');
const { ensureGuest } = require('../middleware/auth');

const router = express.Router();

router.get('/register', ensureGuest, (req, res) => {
  res.render('auth/register', {
    title: 'Register',
    error: null,
    formData: {},
  });
});

router.post('/register', ensureGuest, async (req, res, next) => {
  const { name, password, confirmPassword, age, phoneNumber, gender, isLegal } = req.body;
  const normalizedName = String(name || '').trim();
  const normalizedPhoneNumber = String(phoneNumber || '').trim();
  const formData = { name: normalizedName, age, phoneNumber: normalizedPhoneNumber, gender, isLegal: Boolean(isLegal) };

  try {
    if (!normalizedName || !password || !confirmPassword || !age || !normalizedPhoneNumber || !gender || !isLegal) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        error: 'All fields are required.',
        formData,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        error: 'Passwords do not match.',
        formData,
      });
    }

    const existingUser = await User.findOne({ name: normalizedName });
    if (existingUser) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        error: 'That name is already registered.',
        formData,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: normalizedName,
      password: hashedPassword,
      age: Number(age),
      phoneNumber: normalizedPhoneNumber,
      gender,
      isLegal: true,
    });

    req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      return res.redirect('/guns');
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/login', ensureGuest, (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    error: null,
    formData: {},
  });
});

router.post('/login', ensureGuest, (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).render('auth/login', {
        title: 'Login',
        error: info?.message || 'Login failed.',
        formData: { name: req.body.name },
      });
    }

    req.logIn(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      return res.redirect('/guns');
    });
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    return res.redirect('/login');
  });
});

module.exports = router;
