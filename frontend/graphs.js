// Building traces for each crypto coin
function plotNumericalGraph(numerical_data) {
    let traces = [];

    // Trace a line for each crypto
    for (let symbol of numerical_data.crypto_symbols) {
        // Get timestamps for x axis
        let x_data = numerical_data.data.filter(crypto_object => crypto_object.FromSymbol === symbol).map(crypto_object => {
            return new Date(parseInt(crypto_object.Timestamp) * 1000);
        })

        // Get average values for y axis
        let y_data = numerical_data.data.filter(crypto_object => crypto_object.FromSymbol === symbol).map(crypto_object => {
            return crypto_object.DailyAvg;
        })

        // Create trace
        let trace = {
            x: x_data, // time
            y: y_data, // price
            mode: 'scatter',
            name: symbol,
        };

        // save in an array
        traces.push(trace);
    }

    // Setting up data dataset for graph
    let chart_data = traces;

    // Setting up layout
    let layout = {
        title: 'Cryptocurrency prices',
        xaxis: {
            title: 'Time'
        },
        yaxis: {
            title: 'Price (USD)'
        },
        font: {
            size: 10,
            color: 'white'
        },
        plot_bgcolor: 'black',
        paper_bgcolor: 'black'
    };

    //Draw graph
    Plotly.newPlot('numerical-graph', chart_data, layout);
}

function plotSentimentBarChart(sentiment_data) {
    const crypto_symbols = sentiment_data.crypto_symbols;
    const sentiment_types = ['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED'];
    let symbol_sentiments = {};  // stores count of sentiments for each crypto symbol

    // Counting sentiments for each symbol
    for (const symbol of crypto_symbols) {
        let symbol_data = sentiment_data.data.filter(sentiment_object => sentiment_object.CurrencySymbol === symbol);

        // Creating object for counting sentiments
        let sentiments_count = {};
        for (const sentiment_type of sentiment_types) {
            sentiments_count[sentiment_type] = 0;
        }

        // Counting sentimets
        for (let sentiment_object of symbol_data) {
            sentiments_count[sentiment_object.Sentiment]++;
        }

        // Saving sentiment count for a crypto
        symbol_sentiments[symbol] = sentiments_count;
    }

    // array for storing traces
    let traces = [];

    // Create separate traces for each sentiment
    for (let sentiment of sentiment_types) {
        let xValue = [];
        let yValue = [];
        for (let symbol in symbol_sentiments) {
            xValue.push(symbol);  // push value for x axis
            yValue.push(symbol_sentiments[symbol][sentiment]);  // push value for y axis
        }

        let trace = {
            x: xValue,
            y: yValue,
            type: 'bar',
            name: sentiment.toLowerCase(),
        };

        // save trace in an array
        traces.push(trace);
    }

    // Setting up dataset for graph
    let chart_data = traces;

    // Setting up layout
    let layout = {
        title: "Sentiment analysis for cryptocurrencies",
        barmode: 'group',
        font: {
            size: 10,
            color: 'white'
        },
        plot_bgcolor: 'black',
        paper_bgcolor: 'black'
    };

    // Drawing pie chart
    Plotly.newPlot('sentiment-bar-chart', chart_data, layout);
}

function plotSyntheticGraph(synthetic_data) {
    // Main data
    x_data_main = [];
    y_data_main = [];

    for (const item of synthetic_data.data) {
        x_data_main.push(item.Hour);
        y_data_main.push(item.Value);
    }

    main_trace = {
        x: x_data_main, // hour
        y: y_data_main, // value
        mode: 'scatter',
        name: 'Synthetic data'
    }

    // Prediction data
    x_data_predicted = [];
    y_data_predicted = [];

    for (const item of synthetic_data.predicted_data) {
        x_data_predicted.push(item.Hour);
        y_data_predicted.push(item.Value);
    }

    predicted_trace = {
        x: x_data_predicted, // hour
        y: y_data_predicted, // value
        mode: 'scatter',
        name: 'Prediction'
    }

    // Setting up data dataset for graph
    let chart_data = [main_trace, predicted_trace];

    // Setting up layout
    let layout = {
        title: 'Synthetic Data with predictions',
        xaxis: {
            title: 'Time (Hour)'
        },
        yaxis: {
            title: 'Value'
        },
        font: {
            size: 10,
            color: 'white'
        },
        plot_bgcolor: 'black',
        paper_bgcolor: 'black'
    };

    //Draw graph
    Plotly.newPlot('synthetic-graph', chart_data, layout);
}