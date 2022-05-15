interface CryptoData {
    Timestamp: string,
    FromSymbol: string,
    DailyHigh: number,
    DailyLow: number,
    DailyAvg: number
}

interface TweetData {
    TweetId: string,
    TweetTs: string,
    CurrencySymbol: string,
    Text: string
}

interface SyntheticData {
    Hour: string,
    Value: number
}