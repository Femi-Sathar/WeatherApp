
const express = require("express");
const https = require("https");

const app = express();
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  var tempUnit = req.body.tempunit;
  var cityName = req.body.cityName;
  const query = req.body.cityName;
  const apikey = "459cab360599f375a3203680b1010c91";
  if (tempUnit === "Celsius") {
    var unit = "metric";
  } else if (tempUnit === "Kelvin") {
    var unit = "standard ";
  } else {
    var unit = "imperial";
  }
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apikey + "&units=" + unit;

  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on('data', function(data) {
    const weatherDataObject = JSON.parse(data);
      if (weatherDataObject.cod == 200) {
        const temp = weatherDataObject.main.temp;
        const weatherDescription = weatherDataObject.weather[0].description;
        const icon = weatherDataObject.weather[0].icon;
        const imageurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.send(`<!DOCTYPE html>
        <html lang="en" dir="ltr">

        <head>
          <meta charset="utf-8">
          <title>WeatherAPP</title>
          <link href="https://fonts.googleapis.com/css?family=Montserrat:black|Ubuntu" rel="stylesheet" rel="stylesheet">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
          <link rel="stylesheet" href="css/style.css">
        </head>

        <body>
          <section id="hero">
            <div class="container">
            <h1>Temperature in ${cityName} is ${temp} ${tempUnit}</h1>
            <h2 ><img src="${imageurl}"> ${weatherDescription.toUpperCase()}</h2>
            </div>
          </div>
          <div class="return-button-container">
            <form action="/back" method="post">
              <div><input type="submit" name="submit" class="btn btn-dark btn-lg" value="Back!"></div>
            </form>
          </div>
          </body>
        </html>`);
          }

      else {
        res.send(`<!DOCTYPE html>
        <html lang="en" dir="ltr">

        <head>
          <meta charset="utf-8">
          <title>WeatherAPP</title>
          <link href="https://fonts.googleapis.com/css?family=Montserrat:black|Ubuntu" rel="stylesheet" rel="stylesheet">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
          <link rel="stylesheet" href="css/style.css">
        </head>

        <body>
          <section id="hero">
            <div class="container">
            <h1>OOPS</h1>
            <h5>Sorry! Weather Data not available for this location.Please try another City.</h2>
            </div>
          </div>
          <div class="return-button-container">
            <form action="/back" method="post">
            <div><input type="submit" name="submit" class="btn btn-dark btn-lg" value="Back!"></div>
            </form>
          </div>
          </body>
        </html>`);
      }


    });
  });
})

app.post("/back", function(req, res){
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function() {
  console.log("server started at 3000");
});
