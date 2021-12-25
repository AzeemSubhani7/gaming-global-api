const express = require("express");
const User = require("../models/user");
const Report = require("../models/report");
const Post = require("../models/post");
const authMiddleware = require("../middleware/auth");

const reportRouter = express.Router();

// Reporting about a post to the admin
reportRouter.post("/api/reports/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    const newReport = {
      user: req.user._id,
      post: post._id,
      reportText: req.body.reportText,
    };
    const report = new Report(newReport);
    await report.save();
    return res.status(200).send(report);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// Getting the reports
reportRouter.get("/api/admin/getreports", async (req, res) => {
  try {
    const reports = await Report.find().populate("user").populate({
      path: 'post',
      populate: {
        path: 'user'
      }
    });

    return res.status(200).send(reports);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// Deleting a report
reportRouter.delete("/api/admin/deletereport/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    // console.log(report);
    if (!report) {
      return res.status(404).send("report not found!");
    }
    // console.log(report);
    await report.remove();

    return res.status(200).send("Report deleted Successfully!");
  } catch (error) {
    console.error(error).send(error);
  }
});

module.exports = reportRouter;
