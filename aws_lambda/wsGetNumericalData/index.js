const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const all_crypto_symbols = ['LUNA', 'LTC', 'SOL', 'ATOM', 'AVAX'];  // list of all cryptocurrencies

exports.handler = async (event) => {
    console.log("EVENT INFO: " + JSON.stringify(event));  // Log event info

    try {
        let connection_id = event.requestContext.connectionId;
        let domain_name = event.requestContext.domainName;
        let stage = event.requestContext.stage;
        
        // Create response data in a proper format
        let response_data = {
            numerical_data: {
                crypto_symbols: all_crypto_symbols,
                data: await getNumericalData()
            }
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

// Gets numerical data from DynamoDB
async function getNumericalData() {
    let data = [];
    
    // Query each symbol
    for (let symbol of all_crypto_symbols) {
        let params = {
            TableName: "CryptoToUsdData",
            KeyConditionExpression: 'FromSymbol = :symbol',
            ExpressionAttributeValues: {
                ':symbol': symbol,
            },
            Limit: 250,  // limit number of items returned
            ScanIndexForward: false  // sort in descending order
        };

        data = data.concat((await documentClient.query(params).promise()).Items);
    }

    return data;
}
