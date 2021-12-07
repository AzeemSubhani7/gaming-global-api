const express = require("express");

const statsRouter = express.Router();

const axios = require('axios')
const API_KEY_SEIGE = 'a47121d7-16cc-41d9-8ddc-2faf9db9ce3c'
const TRN_API_KEY = '21018cdd-8674-449c-a99c-94db25a84bef'



statsRouter.get("/api/statistics/rainbow", async (req, res) => {
  const getGenericStats = async ({ username, platform }) => {
    const { data } = await axios.get(`https://api2.r6stats.com/public-api/stats/${username}/${platform}/generic`, {
      headers: {
        Authorization: `Bearer ${API_KEY_SEIGE}`,
      },
    })
    console.log({ data })
    res.status(200).send({data})
  }
  try{
    getGenericStats({
      username: req.body.userName,
      platform: req.body.platform,
    });
  }
  catch(error) {
    console.log(error);
    res.status(500).send(error)
  }
});

statsRouter.get("/api/statistics/fortnite", async(req, res) => {
  try{
      const userName = req.body.userName;
      console.log(req.body)
      const response = await axios.get(`https://api.fortnitetracker.com/v1/profile/pc/${userName}`, 
        {
          headers: { "TRN-Api-Key": TRN_API_KEY },
        }
      )
      console.log(response)

      res.status(200).send(response.data)
  }
  catch(error) {
    console.log(error);
    res.status(500).send(error);
  }
})



module.exports = statsRouter;
