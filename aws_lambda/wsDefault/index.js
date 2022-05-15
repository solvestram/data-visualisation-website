exports.handler = async (event) => {
    console.log("EVENT INFO: " + JSON.stringify(event));  // Log event info
    
    // Return error
    return {
        statusCode: 400,
        body: "Error. Message not recognized."
    };
};
