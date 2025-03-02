import fs from 'fs';
import { parse } from 'csv-parse';

/**
 * Loads a CSV file into an array of objects.
 * 
 * @param {string} filePath - The path to the CSV file.
 * @returns {Promise<Object[]>} A promise that resolves to an array of objects representing the CSV data.
 * @throws Will throw an error if the file reading or parsing fails.
 */
export function loadCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(parse({ columns: true }))
            .on('data', (row) => results.push(row))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    });
}

/**
 * Loads JSON data into a DataFrame (or returns the JSON data as-is).
 * 
 * @param {Object[]} jsonData - The JSON data to load.
 * @returns {Object[]} The same JSON data passed in.
 */
export function loadJSON(jsonData) {
    return jsonData;
}

/**
 * Joins two data arrays on a common field.
 * 
 * @param {Object[]} data1 - The first array of objects.
 * @param {Object[]} data2 - The second array of objects.
 * @param {string} commonField - The field to join on.
 * @returns {Object[]} An array of joined objects where the common field values match.
 */
export function joinData(data1, data2, commonField) {
    return data1.flatMap(row1 => {
        return data2
            .filter(row2 => row1[commonField] === row2[commonField])
            .map(row2 => ({ ...row1, ...row2 }));
    });
}

/**
 * Selects specific fields from each object in a data array.
 * 
 * @param {Object[]} data - The array of objects to process.
 * @param {string[]} fields - The fields to select.
 * @returns {Object[]} A new array of objects containing only the specified fields.
 */
export function selectFields(data, fields) {
    return data.map(row => {
        const newRow = {};
        fields.forEach(field => {
            if (row.hasOwnProperty(field)) {
                newRow[field] = row[field];
            }
        });
        return newRow;
    });
}

/**
 * Retrieves distinct values from a specific field in a data array.
 * 
 * @param {Object[]} data - The array of objects to process.
 * @param {string} field - The field to get distinct values from.
 * @returns {Array} An array of distinct values from the specified field.
 */
export function distinct(data, field) {
    const values = data.map(row => row[field]);
    return [...new Set(values)];
}

/**
 * Filters data based on specified criteria.
 * 
 * @param {Object[]} data - The array of objects to filter.
 * @param {Object} criteria - The criteria to use for filtering.
 * @returns {Object[]} An array of objects that match the criteria.
 */
export function filterData(data, criteria) {
    return data.filter(row => {
        return Object.keys(criteria).every(key => row[key] === criteria[key]);
    });
}

/**
 * Prints data in a table format to the console.
 * 
 * @param {Object[]} data - The array of objects to print.
 */
export function printData(data) {
    console.table(data);
}
