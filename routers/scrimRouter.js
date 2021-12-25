const express = require("express");

const User = require("../models/user");
const Scrim = require("../models/scrim");
const Notification = require("../models/notification");

const scrimRouter = express.Router();

// To create a new User // Sign-in a user
scrimRouter.post("/api/scrim/create/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("");
    }
    // Scrim Material
    const { title, text, game } = req.body;

    const scrim = new Scrim({
      user: userId,
      scrimTitle: title,
      scrimText: text,
      game: game,
    });
    await scrim.save();
    return res.status(200).send(scrim);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// To-get all the scrims
scrimRouter.get("/api/scrims/getall", async (req, res) => {
  try {
    const scrims = await Scrim.find().populate("user").populate("going");
    // console.log(scrims);
    if (scrims.length < 0) {
      return res.status(404).send();
    }
    return res.status(200).send(scrims);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// To-accept the scrim
scrimRouter.patch("/api/scrims/:scrimId/accept/:userId", async (req, res) => {
  
  try{
    const scrimId = req.params.scrimId;
    const userId = req.params.userId;

    console.log(scrimId);
    console.log(userId);

    const scrim = await Scrim.findById(scrimId);
    scrim.going = userId;
    await scrim.save();

    return res.status(200).send("OK");
  }
  catch(error) {
    return res.status(500).send(error);
  }


});

// To-delete A Scrim
scrimRouter.delete("/api/rmascrim/:id", async (req, res) => {
  try {
    const scrimId = req.params.id;
    console.log(scrimId);
    const scrim = await Scrim.findById(scrimId);
    if(!scrim) {
      return res.status(404).send()
    }
    console.log(scrim);
    await scrim.remove();
    return res.status(200).send({ msg: 'scrim deleted' });

  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = scrimRouter;
