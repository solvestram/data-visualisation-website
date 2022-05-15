const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

// Create new DocumentClient
const documentClient = new AWS.DynamoDB.DocumentClient();

/**
 * Saves cryto data to DynamoDB
 * @param crypto_data crypto data to save
 */
export async function saveCryptoData(crypto_data: CryptoData): Promise<void> {
    // Table name and data for table
    const params = {
        TableName: "CryptoToUsdData",
        Item: crypto_data,
    };

    // Storing the data
    await documentClient.put(params).promise();
    console.log("Added item: ", JSON.stringify(crypto_data, null, 2));
}

/**
 * Saves tweet data to DynamoDB
 * @param tweet_data tweet data to save
 */
export async function saveTweetData(tweet_data: TweetData): Promise<void> {
    // Table name and data for table
    const params = {
        TableName: "TwitterData",
        Item: tweet_data,
    };

    // Storing the data
    await documentClient.put(params).promise();
    console.log("Added item: ", JSON.stringify(tweet_data, null, 2));
}

/**
 * Saves synthetic data to DynamoDB
 * @param synthetic_data synthetic data to save
 */
export async function saveSyntheticData(synthetic_data: SyntheticData) {
    // Table name and data for table
    const params = {
        TableName: "SyntheticData",
        Item: synthetic_data,
    };

    // Storing the data
    await documentClient.put(params).promise();
    console.log("Added item: ", JSON.stringify(synthetic_data, null, 2));
}
