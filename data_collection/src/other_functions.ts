import axios from "axios";
import { saveSyntheticData } from "./database_functions";
const AWS = require('aws-sdk');

/**
 * Gets synthetic data from API
 * @returns synthetic data
 */
async function getSyntheticData() {
    let api_url = '<api_url>';
    let student_id = '<student_id>';

    // Make GET request
    const res: any = await axios.get(api_url + '/' + student_id);

    // Return data from response
    return res.data;
}

/**
 * Gets synthetic data and saves it to DynamoDB
 */
export async function getAndSaveSyntheticData(): Promise<void> {
    // Get data
    let data = await getSyntheticData();

    for (const [hour, value] of data.target.entries()) {
        let sythetic_data: SyntheticData = {
            Hour: hour.toString(), // generate hours
            Value: value
        }

        // upload synthetic data to DynamoDB
        saveSyntheticData(sythetic_data);
    }
}
