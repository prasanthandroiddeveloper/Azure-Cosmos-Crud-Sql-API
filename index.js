const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 3000;
const server = app.listen(port);
const config = require("./config");

const dbContext = require("./databaseContext");
const CosmosClient = require("@azure/cosmos").CosmosClient;

const API_KEY = "";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(API_KEY);

app.use(cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

const createContainer = (containerId, dataReceived) => {
  const { endpoint, key, databaseId } = config;

  const client = new CosmosClient({ endpoint, key });

  const database = client.database(databaseId);
  const container = database.container(containerId);

  // Make sure Tasks database is already setup. If not, create it.
  dbContext.create(client, databaseId, containerId);

  const { resource: createdItem } = container.items.create(dataReceived);
  console.log("sdsdsd", createdItem);
};

app.get("/webhook", function (req, res) {
  //io.sockets.emit("FromAPI", req.query + " : Updated");
  console.log(JSON.stringify(req.query), "params");
  const axios = require("axios");
  res.send("Welcome to Roambee");
  const timeStamp = parseInt(req.query.time * 1000);
  var dateNew = new Date(timeStamp);
  const ambient = req.query.ambient;
  const shipmentId = req.query.shipment_id;
  const bee_name = req.query.bee_name;
  const destination = req.query.destination;
  const timestamp = new Date().toString();
  const data = JSON.stringify(req.query);
  console.log(req.query.ambient, "ambient level");
  var message = "";
  console.log(req.query.ambient, "ambient level");
  if (ambient <= 1) {
    message = "Door is Closed";
  } else if (ambient > 2 && ambient <= 5) {
    message = "Door maybe open";
  } else if (ambient >= 6) {
    message = "Door is open";
    console.log("Door is open");
    // res.send({msg:"Door Closed"});
  }

  if (message) {
    axios
      .post(
        `https://portal.roambee.com/services/shipment/get2?sid=${shipmentId}&apikey=f1970070-b231-4927-a004-e7bedae5a80c`
      )
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res.data, "Total response");

        subscriptions = res.data.subscriptions;
        if (subscriptions) {
          subscriptions
            .filter((item) => item.type === "ACTIVITY")
            .map((record) => {
              if (record.email) {
                console.log(record.email);
                var mailOptions = {
                  from: "shipment.monitoring@kaptura.co",
                  to: record.email,
                  subject: "CONTAINER DOOR ALERT from ROAMBEE",
                  text: `Container ${message} Alert on ${bee_name} to destination ${destination} ${new Date(
                    timeStamp
                  )}`,
                  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'
                };

                sgMail.send(mailOptions);
              }
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const trnsData = {
    ambient,
    shipmentId,
    bee_name,
    destination,
    timestamp,
  };
  console.log(trnsData, "ssd12121");
  createContainer("Sourcedata", req.query);
  createContainer("Transformeddata", trnsData);

  return true;
});

app.get("/batwebhook", function (req, res) {
  //io.sockets.emit("FromAPI", req.query + " : Updated");
  console.log(JSON.stringify(req.query), "params");
  const axios = require("axios");
  res.send("Welcome to Roambee");
  const timeStamp = parseInt(req.query.time * 1000);
  var dateNew = new Date(timeStamp);
  const ambient = req.query.ambient;
  const shipmentId = req.query.shipment_id;
  const bee_name = req.query.bee_name;
  const destination = req.query.destination;
  const messageJson = JSON.stringify(req.query);
  console.log(req.query.ambient, "ambient level");
  var message = "";
  console.log(req.query.ambient, "ambient level");
  if (ambient <= 1) {
    message = "Door is Closed";
  } else if (ambient > 2 && ambient <= 5) {
    message = "Door maybe open";
  } else if (ambient >= 6) {
    message = "Door is open";
    console.log("Door is open");
    // res.send({msg:"Door Closed"});
  }

  if (message) {
    axios
      .post(
        `https://portal.roambee.com/services/shipment/get2?sid=${shipmentId}&apikey=aa1140a8-219a-4fb9-b12a-c5751206a5ec`
      )
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res.data, "Total response");

        subscriptions = res.data.subscriptions;
        if (subscriptions) {
          subscriptions
            .filter((item) => item.type === "ACTIVITY")
            .map((record) => {
              if (record.email) {
                console.log(record.email);
                var mailOptions = {
                  from: "shipment.monitoring@kaptura.co",
                  to: record.email,
                  subject: "CONTAINER DOOR ALERT from ROAMBEE",
                  text: `Container ${message} Alert on ${bee_name} to destination ${destination} ${new Date(
                    timeStamp
                  )}`,
                  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'
                };

                sgMail.send(mailOptions);
              }
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return true;
});

app.get("/batpngwebhook", function (req, res) {
  //io.sockets.emit("FromAPI", req.query + " : Updated");
  console.log(JSON.stringify(req.query), "params");
  const axios = require("axios");
  res.send("Welcome to Roambee");
  const timeStamp = parseInt(req.query.time * 1000);
  var dateNew = new Date(timeStamp);
  const ambient = req.query.ambient;
  const shipmentId = req.query.shipment_id;
  const bee_name = req.query.bee_name;
  const destination = req.query.destination;
  const messageJson = JSON.stringify(req.query);
  console.log(req.query.ambient, "ambient level");
  var message = "";
  console.log(req.query.ambient, "ambient level");
  if (ambient <= 1) {
    message = "Door is Closed";
  } else if (ambient > 2 && ambient <= 5) {
    message = "Door maybe open";
  } else if (ambient >= 6) {
    message = "Door is open";
    console.log("Door is open");
    // res.send({msg:"Door Closed"});
  }

  if (message) {
    axios
      .post(
        `https://portal.roambee.com/services/shipment/get2?sid=${shipmentId}&apikey=3898fe77-37be-4c08-affa-e0f04e8f00c4`
      )
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res.data, "Total response");

        subscriptions = res.data.subscriptions;
        if (subscriptions) {
          subscriptions
            .filter((item) => item.type === "ACTIVITY")
            .map((record) => {
              if (record.email) {
                console.log(record.email);
                var mailOptions = {
                  from: "shipment.monitoring@kaptura.co",
                  to: record.email,
                  subject: "CONTAINER DOOR ALERT from ROAMBEE",
                  text: `Container ${message} Alert on ${bee_name} to destination ${destination} ${new Date(
                    timeStamp
                  )}`,
                  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'
                };

                sgMail.send(mailOptions);
              }
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return true;
});

console.log("express running on server port 3000");
