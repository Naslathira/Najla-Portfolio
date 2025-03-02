import fs from 'fs';
import fetch from 'node-fetch';

/**
 * Fetches data from a given API URL and caches it to a local file.
 * 
 * @async
 * @function fetchAndCache
 * @param {string} url - The API endpoint to fetch data from.
 * @param {string} cacheFile - The local file path where the fetched data will be cached.
 * @returns {Promise<Object>} The JSON data fetched from the API.
 * @throws Will throw an error if the fetch operation fails.
 */
export async function fetchAndCache(url, cacheFile) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Save the JSON data to a local cache file
        fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
        console.log(`Data cached to ${cacheFile}`);

        return data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
    }
}

/**
 * Checks if the cache file is still valid based on its age.
 * 
 * The cache is considered valid if it is less than 5 minutes old.
 * 
 * @function isCacheValid
 * @param {string} cacheFile - The local file path of the cached data.
 * @returns {boolean} True if the cache is valid, false otherwise.
 */
export function isCacheValid(cacheFile) {
    if (fs.existsSync(cacheFile)) {
        const stats = fs.statSync(cacheFile);
        const now = new Date().getTime();
        const fileAge = (now - new Date(stats.mtime).getTime()) / 1000; // age in seconds

        return fileAge < 300; // cache is valid if less than 5 minutes old
    }
    return false;
}

/**
 * Retrieves data either from a cache file or by fetching it from the API.
 * 
 * If the cache is valid, the data is read from the cache; otherwise, it is fetched
 * from the API and cached.
 * 
 * @async
 * @function getData
 * @param {string} url - The API endpoint to fetch data from if the cache is invalid.
 * @param {string} cacheFile - The local file path where the fetched data is cached.
 * @returns {Promise<Object>} The JSON data from either the cache or the API.
 */
export async function getData(url, cacheFile) {
    if (isCacheValid(cacheFile)) {
        console.log(`Reading data from cache: ${cacheFile}`);
        return JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
    } else {
        console.log(`Cache invalid or not found. Fetching new data from ${url}`);
        return await fetchAndCache(url, cacheFile);
    }
}
