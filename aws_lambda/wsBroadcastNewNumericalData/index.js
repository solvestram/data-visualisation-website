const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

// Set domain name and stage
const domain_name = "<domain_name>";
const stage = "<stage>";

const all_crypto_symbols = ['LUNA', 'LTC', 'SOL', 'ATOM', 'AVAX'];  // list of all crypto symbols

exports.handler = async (event) => {
    console.log("EVENT INFO: " + JSON.stringify(event));  // Log event info
    
    // Create data object in a proper format
    let data = {
        numerical_data: {
            crypto_symbols: all_crypto_symbols,
            data: []
        },
    };

    for (let record of event.Records) {
        if (record.eventName === "INSERT") {
            // Create numerical object in a proper format
            let numerical_object = {
                FromSymbol: record.dynamodb.NewImage.FromSymbol.S,
                Timestamp: record.dynamodb.NewImage.Timestamp.S,
                DailyAvg: record.dynamodb.NewImage.DailyAvg.N,
                DailyHigh: record.dynamodb.NewImage.DailyHigh.N,
                DailyLow: record.dynamodb.NewImage.DailyLow.N
            };
            
            // Push the object into data array
            data.numerical_data.data.push(numerical_object);
        }
    }

    // Broadcasting to connections
    let connection_objects = await getAllConnectionId();
    await Promise.all(connection_objects.map(async connection_object => {
        return broadcast(connection_object.ConnectionId, data);
    }));
};

// Broadcasts new data to a client
async function broadcast(connection_id, data) {
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: domain_name + '/' + stage
    });

    console.log("Sending data to " + connection_id);

    let apiMsg = {
        ConnectionId: connection_id,
        Data: JSON.stringify(data)
    };

    try {
        // Send data to client
        await apigwManagementApi.postToConnection(apiMsg).promise();
        console.log("Data was sent to " + connection_id);
    }
    catch (e) {
        console.log("Failed to send message to: " + connection_id);
        
        // If the client is no longer connected (gone)
        if (e.statusCode == 410) {
            try {
                // Delete connection
                await deleteConnection(connection_id);
            }
            catch (e) {
                console.log("ERROR deleting connection ID: " + JSON.stringify(e));
                throw e;
            }
        }
        else {
            console.log("UNKNOWN ERROR: " + JSON.stringify(e));
            throw e;
        }
    }
}

// Gets all connection IDs from DynamoDB
async function getAllConnectionId() {
    let params = {
        TableName: "WebsocketClients"
    };

    let data = (await documentClient.scan(params).promise()).Items;
    return data;
}

// Deletes connection ID from DynamoDB
async function deleteConnection(connection_id) {
    const params = {
        TableName: "WebsocketClients",
        Key: {
            ConnectionId: connection_id
        },
    };

    await documentClient.delete(params).promise();

    console.log("Deleted connection ID: " + connection_id);
}
