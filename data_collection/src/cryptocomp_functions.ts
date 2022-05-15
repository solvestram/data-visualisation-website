import axios from 'axios';
import { saveCryptoData } from './database_functions';

// Throw error if API key is missing
if (!process.env.CRYPTOCOMP_KEY) {
    throw "Missing CRYPTOCOMP_KEY";
}

// Get API key
const cryptocomp_key: string = process.env.CRYPTOCOMP_KEY

/**
 * Gets crypto data from CRYPTOCOMP API
 * @param crypto_symbol cryptocurrency symbol to get
 * @param limit number of elements to get
 * @returns array of rate objects (CryptoCompDataRate)
 */
async function getCryptoData(crypto_symbol: string, limit: number): Promise<Array<CryptoCompDataRate>> {
    const api_url: string = "https://min-api.cryptocompare.com/data/v2/histoday";
    const before_date: number = 1640995200; // Date: 01/01/2022 00:00:00

    // Make request to API
    const res: any = await axios.get(api_url, {
        params: {
            fsym: crypto_symbol,
            tsym: 'USD',
            limit: limit,
            toTs: before_date,
            api_key: cryptocomp_key
        }
    });

    // Extract rates array from response
    let rates: Array<CryptoCompDataRate> = res.data.Data.Data;

    return rates;
}

/**
 * Gets crypto data from CRYPTOCOMP API and uploads it to DynamoDB database
 * @param crypto_symbol cryptocurrency symbol to get
 * @param limit number of elements to get
 */
export async function getAndSaveCryptoData(crypto_symbol: string, limit: number): Promise<void> {
    // Get data from CRYPTOCOMP API
    const rates: Array<CryptoCompDataRate> = await getCryptoData(crypto_symbol, limit);

    for (const rate of rates) {
        // Upload data to DynamoDB
        saveCryptoData({
            Timestamp: rate.time.toString(),
            FromSymbol: crypto_symbol,
            DailyHigh: rate.high,
            DailyLow: rate.low,
            DailyAvg: (rate.high + rate.low) / 2
        });
    }
}