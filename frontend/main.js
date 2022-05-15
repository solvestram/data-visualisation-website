let data = {
    numerical_data: {
        crypto_symbols: [],
        data: []
    },
    sentiment_data: {
        crypto_symbols: [],
        data: []
    },
    synthetic_data: {
        data: [],
        predicted_data: []
    }
}

// Create connection
let connection = new WebSocket("<websocket_url>");

// Log connected response and send actions
connection.onopen = (event) => {
    console.log("Connected: " + JSON.stringify(event));

    let actions = ['getNumericalData', 'getSentimentData', 'getSyntheticData'];

    for (let action of actions) {
        connection.send(JSON.stringify({
            action: action
        }))
    }
}

// Process incoming messages
connection.onmessage = (event) => {
    console.log("Received message: " + event.data);

    let event_data = JSON.parse(event.data)

    // Check if numerical_data key exists in event data
    if ("numerical_data" in event_data) {
        // Update crypto symbols list
        data.numerical_data.crypto_symbols = event_data.numerical_data.crypto_symbols;

        // Merge old and new data
        data.numerical_data.data = data.numerical_data.data.concat(event_data.numerical_data.data);

        // Sort by timestamp
        data.numerical_data.data.sort((a, b) => {
            let a_timestamp = parseInt(a.Timestamp);
            let b_timestamp = parseInt(b.Timestamp);

            if (a_timestamp > b_timestamp) {
                return 1;
            } else {
                return -1;
            }
        });

        // Plot graph
        plotNumericalGraph(data.numerical_data);
    }

    // Check if sentiment_data key exists in event data
    if ("sentiment_data" in event_data) {
        // Update crypto symbols list
        data.sentiment_data.crypto_symbols = event_data.sentiment_data.crypto_symbols;

        // Update sentiment data
        data.sentiment_data.data = data.sentiment_data.data.concat(event_data.sentiment_data.data);        

        // Sort by timestamp
        data.numerical_data.data.sort((a, b) => {
            let a_timestamp = parseInt(a.TweetTs);
            let b_timestamp = parseInt(b.TweetTs);

            if (a_timestamp > b_timestamp) {
                return 1;
            } else {
                return -1;
            }
        });

        // Plot graph
        plotSentimentBarChart(data.sentiment_data);
    }

    // Check if synthetic_data key exists in event data
    if ("synthetic_data" in event_data) {
        // Update synthetic data
        data.synthetic_data.data = data.synthetic_data.data.concat(event_data.synthetic_data.data);
        data.synthetic_data.predicted_data = data.synthetic_data.predicted_data.concat(event_data.synthetic_data.predicted_data);

        // Sort main data by hour
        data.synthetic_data.data.sort((a, b) => {
            let a_hour = parseInt(a.Hour);
            let b_hour = parseInt(b.Hour);

            if (a_hour > b_hour) {
                return 1;
            } else {
                return -1;
            }
        });

        // Sort predicted data by hour
        data.synthetic_data.predicted_data.sort((a, b) => {
            let a_hour = parseInt(a.Hour);
            let b_hour = parseInt(b.Hour);

            if (a_hour > b_hour) {
                return 1;
            } else {
                return -1;
            }
        });

        // Plot pie chart
        plotSyntheticGraph(data.synthetic_data);
    }

    console.log(data)
}

// Log errors
connection.onerror = (event) => {
    console.log("Websocket Error: " + JSON.stringify(event));
}

// Log disconnected response
connection.close = (event) => {
    console.log("Disconnected: " + event);
}