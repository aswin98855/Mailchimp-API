const express = require("express");
const bodyParser = require("body-parser");
const https = require('node:https');
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members : [
      {
        email_address : email,
        status : "subscribed",
        merge_fields : {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us13.api.mailchimp.com/3.0/lists/148390d6de";
  //list id

  const options = {
    method: "POST",
    auth: "aswin:415ee314942b32ea7014221dc9085dac-us13"
    //api key id
  }

  const request = https.request(url, options, function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }


    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure",function(req,res){
  res.redirect("/");
})


app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000.");
})
