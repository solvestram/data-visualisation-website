const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

// Synthetic data start time
const data_start_time = '2020-03-19 14:00:00';

// Endpoint name
const endpointName = "synth-endpoint";

//AWS class that will query endpoint
let awsRuntime = new AWS.SageMakerRuntime({});

exports.handler = async (event) => {
    // Data for sending to endpoint
    let endpointData = {
        'instances': [await getFormattedSyntheticData(data_start_time)],
        'configuration': {
            "num_samples": 50,
            "output_types": ["mean", "quantiles", "samples"],
            "quantiles": ["0.1", "0.9"]
        }
    };
    
    //Parameters for calling endpoint
    let params = {
        EndpointName: endpointName,
        Body: JSON.stringify(endpointData),
        ContentType: "application/json",
        Accept: "application/json"
    };

    //Call endpoint
    let data = await awsRuntime.invokeEndpoint(params).promise();

    //Convert response data to JSON
    let responseData = JSON.parse(Buffer.from(data.Body).toString('utf8'));
    
    // Get mean predictions data and save
    let prediction_data = responseData.predictions[0].mean;
    await saveSyntheticDataPrediction(500, prediction_data);
};

// Gets data from database and converts to format used in endpoint
async function getFormattedSyntheticData(start_time) {
    let params = {
        TableName: "SyntheticData"
    };

    let data = (await documentClient.scan(params).promise()).Items;

    // Sort by hour
    data.sort((a, b) => {
        let a_hour = parseInt(a.Hour);
        let b_hour = parseInt(b.Hour);

        if (a_hour > b_hour) {
            return 1;
        }
        else {
            return -1;
        }
    });

    // Create target list
    let target_data = data.map(item => item.Value);

    // Formatted data
    let synthetic_data = {
        start: start_time,
        target: target_data
    };

    return synthetic_data;
}

// Converts data to database format and stores it
async function saveSyntheticDataPrediction(start_hour, synthetic_data) {
    let hour = start_hour;
    
    for (const value of synthetic_data) {
        // Table name and data for table
        const params = {
            TableName: "SyntheticDataPredictions",
            Item: {
                Hour: hour.toString(),
                Value: value
            },
        };

        // Storing the data
        await documentClient.put(params).promise();
        console.log("Added item: ", JSON.stringify(synthetic_data));
        
        // Update hour variable
        hour++;
    }
}
