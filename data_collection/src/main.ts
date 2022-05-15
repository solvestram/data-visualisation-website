import 'dotenv/config';  // load environment vairables
import { getAndSaveCryptoData } from './cryptocomp_functions';
import { getAndSaveTweetData } from './twitter_functions';
import { getAndSaveSyntheticData } from './other_functions';

// List of crypto currencies [<symbol>, <name>]
let crypto_currencies: string[][] = [['LUNA', 'Terra'], ['LTC', 'Litecoin'], ['SOL', 'Solana'], ['ATOM', 'Cosmos'], ['AVAX', 'Avalanche']];

// Collect numerical data
for (const currency of crypto_currencies) {
    let currency_symbol: string = currency[0];
    getAndSaveCryptoData(currency_symbol, 500);
}

// Collect twitter data
for (const currency of crypto_currencies) {
    let currency_symbol: string = currency[0];
    let currency_name: string = currency[1];

    getAndSaveTweetData(currency_symbol, currency_name, 500);
}

// Collect data
getAndSaveSyntheticData();
