const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("EVENT INFO: " + JSON.stringify(event));  // Log event info

    try {
        let connection_id = event.requestContext.connectionId;
        let domain_name = event.requestContext.domainName;
        let stage = event.requestContext.stage;
        
        // Create response data in a proper format
        let response_data = {
            synthetic_data: {
                data: await getSyntheticData(),
                predicted_data: await getSyntheticDataPredictions()
            },
        };
        
        // Send response
        await sendResponse(connection_id, domain_name, stage, response_data);
        
        // Return success
        return { statusCode: 200, body: "Response was sent successfully." };
    }
    catch (e) {
        console.log("ERROR: " + JSON.stringify(e));

        return { statusCode: 500, body: "Error: " + JSON.stringify(e) };
    }
};

// Sends response to client
async function sendResponse(connection_id, domain_name, stage, response_data) {
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: domain_name + '/' + stage
    });

    console.log("Sending response to " + connection_id);

    let apiMsg = {
        ConnectionId: connection_id,
        Data: JSON.stringify(response_data)
    };

    await apigwManagementApi.postToConnection(apiMsg).promise();
    console.log("Response was sent to " + connection_id);
}

// Gets synthetic data from DynamoDB
async function getSyntheticData() {
    let params = {
        TableName: "SyntheticData"
    };

    let data = (await documentClient.scan(params).promise()).Items;
    return data;
}

// Gets synthetic data predictions from DynamoDB
async function getSyntheticDataPredictions() {
    let params = {
        TableName: "SyntheticDataPredictions"
    };

    let data = (await documentClient.scan(params).promise()).Items;
    return data;
}
