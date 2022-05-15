let AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let connection_id = event.requestContext.connectionId; // Get connection ID
    console.log("Client connected with ID: " + connection_id);

    try {
        // Save connection ID
        await saveConnection(connection_id);
        
        // Return success
        return {
            statusCode: 200,
            body: "Client connected with ID: " + connection_id
        };
    }
    catch (e) {
        return {
            statusCode: 500,
            body: "Server Error: " + JSON.stringify(e)
        };
    }
};

// Saves connection ID to DynamoDB
async function saveConnection(connection_id) {
    const params = {
        TableName: "WebsocketClients",
        Item: {
            ConnectionId: connection_id
        },
    };

    await documentClient.put(params).promise();

    console.log("Saved connection ID: " + connection_id);
}
