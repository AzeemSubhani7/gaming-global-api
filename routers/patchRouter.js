const express = require("express");
const Patch = require('../models/patches')
const patchRouter = express.Router();


// To Create A patch
patchRouter.post('/addpatch', async (req, res) => {
  try {
      console.log(req.body)
      const newPatch = {
        title: req.body.title,
        patch: req.body.patch,
        text: req.body.text,
        for: req.body.for
      }
      const patch = new Patch(newPatch);
      await patch.save();
      return res.status(200).send(patch);
    } 
  catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
})

// Get Rainbow Six Patches
patchRouter.get('/rainbowpatch', async(req, res) => {
  try{
    const patches = await Patch.find({ for: 'rainbow' })
    console.log(patches)
    return res.status(200).send(patches)
  }
  catch(error) {
    console.error(error)
    return res.status(500).send(error)
  }
})

// Get Fortnite Patches
patchRouter.get('/fortnitepatch', async(req, res) => {
  try{
    const patches = await Patch.find({ for: 'fortnite' })
    console.log(patches)
    return res.status(200).send(patches)
  }
  catch(error) {
    console.error(error)
    return res.status(500).send(error)
  }
})

module.exports = patchRouter;
