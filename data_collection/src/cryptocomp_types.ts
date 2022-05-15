interface CryptoCompObject {
    Response: string,
    Message: string,
    HasWarning: boolean,
    Type: number,
    Data: CryptoCompData
};

interface CryptoCompData {
    Aggregated: boolean,
    TimeFrom: number,
    TimeTo: number,
    Data: Array<CryptoCompDataRate>
}

interface CryptoCompDataRate {
    time: number,
    high: number,
    low: number,
    open: number,
    volumefrom: number,
    volumeto: number,
    close: number,
    convertionType: string,
    convertionSymbol: string
}
