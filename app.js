//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { options } = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){

    // Read the form data
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // Construct the 'members' data object w.r.t. MailChimp API doco
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);    //FlatPacking the JSON data object before submitting to MailChimp API 


const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "dfc61925f326362ba80e8c99e7df0e82-us14",
  server: "us14",
});

const list_id = "334b8daa68";

const run = async () => {
//   const response = await mailchimp.lists.getList(list_id);      // This test worked OK.
  const response = await mailchimp.lists.batchListMembers(list_id, jsonData);      
  res.sendFile(__dirname + "/success.html");
};

run().catch(e => res.sendFile(__dirname + "/failure.html"));

});

// Redirect for failure scenario
app.post("/failure", function(req, res) {
    res.redirect("/");
});


app.listen(3000, function() {
    console.log("Server is up!!")
});

// Mailchimp API Key: dfc61925f326362ba80e8c99e7df0e82-us14
// Unique ID(List ID) for audience NiraLabs : 334b8daa68


