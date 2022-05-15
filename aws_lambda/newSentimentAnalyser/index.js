const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("EVENT INFO: " + JSON.stringify(event)); // Log event info

    await Promise.all(event.Records.map(async record => {
        if (record.eventName === "INSERT") {
            let tweet_id = record.dynamodb.NewImage.TweetId.S;
            let tweet_ts = record.dynamodb.NewImage.TweetTs.S;
            let tweet_text = record.dynamodb.NewImage.Text.S;
            let currency_symbol = record.dynamodb.NewImage.CurrencySymbol.S;

            // Get sentiment
            let sentiment = (await getSentiment(tweet_text)).Sentiment;

            // Save sentiment
            return saveSentiment(tweet_id, tweet_ts, currency_symbol, sentiment);
        }
    }));
};

// Gets sentiment for a text from AWS Comprehend
async function getSentiment(text) {
    let comprehend = new AWS.Comprehend();

    let params = {
        LanguageCode: 'en',
        Text: text
    };

    return await comprehend.detectSentiment(params).promise();
}

// Saves data to a DynamoDB table
async function saveSentiment(tweet_id, tweet_ts, currency_symbol, sentiment) {
    const params = {
        TableName: "TwitterSentiment",
        Item: {
            TweetId: tweet_id,
            TweetTs: tweet_ts,
            CurrencySymbol: currency_symbol,
            Sentiment: sentiment
        },
    };

    await documentClient.put(params).promise();

    console.log("Saved sentiment: ", JSON.stringify({
        TweetId: tweet_id,
        TweetTs: tweet_ts,
        Sentiment: sentiment
    }, null, 2));
}
