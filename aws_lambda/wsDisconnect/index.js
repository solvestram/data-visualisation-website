let AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let connection_id = event.requestContext.connectionId;  // Get connection ID
    console.log("Disconnecting client with ID: " + connection_id);

    try {
        // Delete connection ID
        await deleteConnection(connection_id);
        
        // Return success
        return {
            statusCode: 200,
            body: "Disconnected client with ID: " + connection_id
        };
    }
    catch (e) {
        return {
            statusCode: 500,
            body: "Server Error: " + JSON.stringify(e)
        };
    }

};

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
