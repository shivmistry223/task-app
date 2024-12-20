const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.getAuthToken();

    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.getAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send({ message: "Logged out" });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: "Logged out" });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const allowableUpdates = ["name", "email", "password", "age"];
  const updates = Object.keys(req.body);
  const isValidUpdates = updates.every((update) =>
    allowableUpdates.includes(update)
  );

  if (!isValidUpdates || !req.body) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    updates.forEach((key) => (req.user[key] = req.body[key]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.send(req.user);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Uploaded File must be in jpg, jpeg or png format"));
    }

    return cb(undefined, true);
  },
});

router.post(
  "/users/me/avatars",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ height: 250, width: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatars", auth, async (req, res) => {
  console.log(req.user);
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatars", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || !user.avatar) {
    throw new Error();
  }

  res.set("Content-Type", "image/png");
  res.send(user.avatar);
});

module.exports = router;
