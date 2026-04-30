const express = require('express');

const Gun = require('../models/Gun');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.use(ensureAuthenticated);

router.get('/', async (req, res, next) => {
  try {
    const guns = await Gun.find().sort({ createdAt: -1 });
    res.render('guns/index', {
      title: 'Gun Inventory',
      guns,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/new', (req, res) => {
  res.render('guns/new', {
    title: 'Add Gun',
    error: null,
    gun: {},
  });
});

router.post('/', async (req, res, next) => {
  const { gunName, price, automatic } = req.body;

  try {
    const gun = await Gun.create({
      gunName: gunName.trim(),
      price: Number(price),
      automatic: automatic === 'on',
    });

    return res.redirect(`/guns/${gun.id}`);
  } catch (error) {
    return res.status(400).render('guns/new', {
      title: 'Add Gun',
      error: error.message,
      gun: { gunName, price, automatic: automatic === 'on' },
    });
  }
});

router.get('/:id/edit', async (req, res, next) => {
  try {
    const gun = await Gun.findById(req.params.id);

    if (!gun) {
      return res.status(404).render('guns/not-found', {
        title: 'Not Found',
        message: 'Gun not found.',
      });
    }

    return res.render('guns/edit', {
      title: 'Edit Gun',
      error: null,
      gun,
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id/delete', async (req, res, next) => {
  try {
    const gun = await Gun.findById(req.params.id);

    if (!gun) {
      return res.status(404).render('guns/not-found', {
        title: 'Not Found',
        message: 'Gun not found.',
      });
    }

    return res.render('guns/delete', {
      title: 'Delete Gun',
      gun,
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const gun = await Gun.findById(req.params.id);

    if (!gun) {
      return res.status(404).render('guns/not-found', {
        title: 'Not Found',
        message: 'Gun not found.',
      });
    }

    return res.render('guns/show', {
      title: gun.gunName,
      gun,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/:id', async (req, res, next) => {
  const { price, automatic } = req.body;

  try {
    const gun = await Gun.findById(req.params.id);

    if (!gun) {
      return res.status(404).render('guns/not-found', {
        title: 'Not Found',
        message: 'Gun not found.',
      });
    }

    gun.price = Number(price);
    gun.automatic = automatic === 'on';

    await gun.save();

    return res.redirect(`/guns/${gun.id}`);
  } catch (error) {
    try {
      const gun = await Gun.findById(req.params.id);
      return res.status(400).render('guns/edit', {
        title: 'Edit Gun',
        error: error.message,
        gun: gun || { _id: req.params.id, gunName: '', price, automatic: automatic === 'on' },
      });
    } catch (lookupError) {
      return next(lookupError);
    }
  }
});

router.post('/:id/delete', async (req, res, next) => {
  try {
    const gun = await Gun.findByIdAndDelete(req.params.id);

    if (!gun) {
      return res.status(404).render('guns/not-found', {
        title: 'Not Found',
        message: 'Gun not found.',
      });
    }

    return res.redirect('/guns');
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
