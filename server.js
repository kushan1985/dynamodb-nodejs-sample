const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const port = 3001;
const cors = require('cors');

const app = express();
app.use(cors());
// import the aws sdk to use the dynamodb
// libraries in the app
const AWS = require('aws-sdk');

// update the region to 
// where dynamodb is hosted
AWS.config.update({
    region: "us-east-1"
    });

// create a new dynamodb client
// which provides connectivity b/w the app
// and the db instance
const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'hackathon_product_views';

app.use(bodyParser.json());

app.get("/rows/:productId", (req, res) => {
    // var params = {
    //     TableName: tableName
    // };


    const input = {
            TableName: "hackathon_product_views",
            Key: {
                id: req.params.productId  //{S: "p-kpyfpupzxj161df5"}
            }
        }
        // const command = new GetItemCommand(input);

    client.get(input, (err, data) => {
        if (err) {
            console.log("Error");
            console.log(err);
        } else {
            console.log(data);
            res.contentType = 'application/json';
            res.send(data.Item);
        }
    });
});

app.post("/rows/add", (req, res) => {
    var body = req.body;
    var params = {
        TableName: tableName,
        Item: {
            "Id": uuidv4(),
            "Name": body["name"]
        }
    };

    client.put(params, (err, data) => {
        var status = {};
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            status["success"] = false;
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            status["success"] = true;
        }
        res.contentType = "application/json";
        res.send(status);
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
