const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const server = app.listen(port);
const config = require("./config");

const dbContext = require("./databaseContext");
const CosmosClient = require("@azure/cosmos").CosmosClient;
const { query } = require("express");
const { partitionKey } = require("./config");

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

app.get("/getAllShipments", function (req, res) {
  //io.sockets.emit("FromAPI", req.query + " : Updated");

  // createContainer("Sourcedata", req.query);

  const { endpoint, key, databaseId } = config;

  const client = new CosmosClient({ endpoint, key });

  const database = client.database(databaseId);
  const container = database.container("Sourcedata");

  const querySpec = {
    query: "SELECT * from c",
  };

  async function getdata() {
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();
    res.send(items);
  }
  getdata();

  return true;
});

app.get("/getShipmentById", function (req, res) {
  const { endpoint, key, databaseId } = config;

  const client = new CosmosClient({ endpoint, key });

  const database = client.database(databaseId);
  const container = database.container("Sourcedata");

  async function getdata() {
    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [
        {
          name: "@id",
          value: req.query.id,
        },
      ],
    };

    const { resources: results } = await container.items
      .query(querySpec)
      .fetchAll();

    if (results.length == 0) {
      throw "No items found matching";
    } else if (results.length > 1) {
      throw "More than 1 item found matching";
    }

    const item = results[0];
    console.log(item);

    res.send(item);
  }
  getdata();

  return true;
});

app.get("/deleteShipmentById", function (req, res) {
  const { endpoint, key, databaseId } = config;

  const client = new CosmosClient({ endpoint, key });

  const database = client.database(databaseId);
  const container = database.container("Sourcedata");

  try {
    async function getdata() {
      const { resources: results } = await container
        .item(req.query.id, undefined)
        .delete();
      console.log(results);

      res.send("Item deleted Successfully");
    }
    getdata();
  } catch (err) {
    console.log(err.message);
  }

  return true;
});

app.get("/updateShipmentById", function (req, res) {
  const { endpoint, key, databaseId } = config;

  const client = new CosmosClient({ endpoint, key });

  const database = client.database(databaseId);
  const container = database.container("Sourcedata");

  try {
    async function getdata() {
      console.log(req.body, "body response");
      console.log(req.query.id, "id response");
      const { resource: updatedItem } = await container
        .item(req.query.id, undefined)
        .replace(req.body);
      res.send("Item Updated successfully");
      // console.log(updatedItem);

      //res.send(item);
    }
    getdata();
  } catch (err) {
    console.log(err.message);
  }

  return true;
});

console.log("express running on server port 3000");
