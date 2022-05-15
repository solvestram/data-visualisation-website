import TwitterApi from 'twitter-api-v2';
import { saveTweetData } from './database_functions';

// Throw error if API key is missing
if (!process.env.TWITTER_BEARER_TOKEN) {
    throw "Missing TWITTER_BEARER_TOKEN";
}

// Create TwitterApi client object
const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

/**
 * Searches tweet data for a cryptocurrency
 * @param currency_symbol symbol of crypto that is being searched
 * @param keyword search keyword
 * @param count number of tweets to get
 * @returns Array of tweets (TweetData)
 */
async function searchTweets(currency_symbol: string, keyword: string, count: number): Promise<Array<TweetData>> {
    // Search parameters
    const params: Object = {
        max_results: 100,
        'tweet.fields': ['lang', 'created_at'],
    }

    // Get search results
    const results = await client.v2.search(keyword, params);

    let tweets: Array<TweetData> = [];
    for await (const tweet of results) {
        // Filter by language
        if (tweet.lang === 'en') {
            // Create tweet object with proper format and push to tweets array
            tweets.push({
                TweetId: tweet.id,
                TweetTs: (new Date(tweet.created_at!).getTime() / 1000).toString(),
                CurrencySymbol: currency_symbol,
                Text: tweet.text,
            });
        }

        // End loop if limit reached
        if (tweets.length > count) {
            break;
        }
    }

    return tweets;
}

/**
 * Searches tweet data for a cryptocurrency and saves it to DynamoDB
 * @param currency_symbol symbol of crypto that is being searched
 * @param keyword search keyword
 * @param count number of tweets to get
 */
export async function getAndSaveTweetData(currency_symbol: string, keyword: string, count: number): Promise<void> {
    // Get data
    const data: Array<TweetData> = await searchTweets(currency_symbol, keyword, count);

    for (const tweet of data) {
        // Upload data to DynamoDB
        saveTweetData(tweet);
    }
}