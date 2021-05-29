require("dotenv").config()
const express = require("express")
const cors = require("cors")
//const lyricsFinder = require("lyrics-finder") // for lyrics we use this can be commented
const SpotifyWebApi = require("spotify-web-api-node")


const app = express()
app.use(cors())
app.use(express.json())

//login req
app.post('/login', (req,res)=> {
    const code = req.body.code; //get code from redirect url request
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
      })

      //api exposded methods https://github.com/thelinmichael/spotify-web-api-node
      spotifyApi.authorizationCodeGrant(code).then(data => {
          res.json({
              accessToken : data.body.access_token,
              refreshToken: data.body.refresh_token,
              expiresIn:data.body.expires_in
          })
      }).catch(err=> {
        res.sendStatus(400)
        console.log("error in access",err);
      })
})


app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "960f87b99f6f4a3eb3d37403ed0e6321",
    clientSecret: "0a30a586cde34039aa260569e3436d93",
    refreshToken
  })

  //call below and pass so this will update refresh token accordingly ..
  spotifyApi
    .refreshAccessToken()
    .then(data => {

      //console.log("refreshAccessToken data",data.body)
      //pass this data to client from here..
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })


})

app.listen(3001);

