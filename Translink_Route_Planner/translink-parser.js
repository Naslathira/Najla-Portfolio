import path from 'path';
import prompt from 'prompt-sync';
import { loadCSV, filterData } from './dataframe.js';
import { getData } from './cache.js';

const tripUpdatesCacheFile = path.join('./cached-data', 'trip_updates.json');
const vehiclePositionsCacheFile = path.join('./cached-data', 'vehicle_positions.json');

/**
 * Runs the South East Queensland Route Planner.
 * 
 * This function prompts the user for route details, validates the inputs,
 * loads relevant data, and processes it to display upcoming buses for the
 * selected route within a specific time frame.
 * 
 * @async
 * @function runRoutePlanner
 * @returns {Promise<void>} This function does not return a value.
 */
async function runRoutePlanner() {
    console.log("Welcome to the South East Queensland Route Planner!");

    const input = prompt();

    // Load routes data
    const routes = await loadCSV('./static-data/routes.txt');
    const availableRoutes = routes.map(route => route.route_short_name);

    // Prompt for route number and validate it
    let routeNumber = input("What Bus Route would you like to take? ");

    while (!availableRoutes.includes(routeNumber)) {
        console.log("Please enter a valid bus route.");
        routeNumber = input("What Bus Route would you like to take? ");
    }

    console.log("Loading and processing data, please wait...");

    // Load trips, stop times, and stops data
    const trips = await loadCSV('./static-data/trips.txt'); 
    const stopTimes = await loadCSV('./static-data/stop_times.txt');
    const stops = await loadCSV('./static-data/stops.txt'); 

    // Filter routes by selected route number
    const selectedRoute = filterData(routes, { 'route_short_name': routeNumber });
    const routeId = selectedRoute[0]?.route_id;

    if (!routeId) {
        console.log("No stops found for this route.");
        return;
    }

    // Filter trips and stop times by route ID
    const tripsForRoute = filterData(trips, { 'route_id': routeId });
    const tripIds = tripsForRoute.map(trip => trip.trip_id);
    const stopTimesForRoute = stopTimes.filter(stopTime => tripIds.includes(stopTime.trip_id));
    const stopIds = [...new Set(stopTimesForRoute.map(stopTime => stopTime.stop_id))];
    const stopsForRoute = stops.filter(stop => stopIds.includes(stop.stop_id));

    // Create a list of stops with sequence and platform details
    const stopList = stopTimesForRoute.map(stopTime => {
        const stop = stopsForRoute.find(stop => stop.stop_id === stopTime.stop_id);
        return {
            stop_name: `${stop.stop_name}, platform ${stop.platform_code || ''}`.trim().replace(/,\s*$/, ''),
            stop_sequence: stopTime.stop_sequence
        };
    });

    stopList.sort((a, b) => a.stop_sequence - b.stop_sequence);

    // Remove duplicate stops
    const uniqueStops = [...new Map(stopList.map(item => [item['stop_name'], item])).values()];

    uniqueStops.forEach((stop, index) => {
        console.log(`${index + 1}. ${stop.stop_name}`);
    });

    // Prompt for stop range and validate it
    let stopRange = input("What is your start and end stop on the route? (e.g. 1 - 2) ");
    
    while (!/^\d+\s*-\s*\d+$/.test(stopRange)) {
        console.log("Please follow the format and enter a valid number for the stop.");
        stopRange = input("What is your start and end stop on the route? (e.g. 1 - 2) ");
    }

    const [startStop, endStop] = stopRange.split('-').map(num => num.trim());

    // Prompt for travel date and validate it
    let travelDate = input("What date will you take the route? (YYYY-MM-DD) ");
    
    while (!/^\d{4}-\d{2}-\d{2}$/.test(travelDate)) {
        console.log("Incorrect date format. Please use YYYY-MM-DD");
        travelDate = input("What date will you take the route? (YYYY-MM-DD) ");
    }

    // Prompt for travel time and validate it
    let travelTime = input("What time will you leave? (HH:mm) ");
    
    while (!/^\d{2}:\d{2}$/.test(travelTime)) {
        console.log("Incorrect time format. Please use HH:mm");
        travelTime = input("What time will you leave? (HH:mm) ");
    }

    // Load trip updates and vehicle positions data
    const tripUpdatesData = await getData('http://127.0.0.1:5343/gtfs/seq/trip_updates.json', tripUpdatesCacheFile);
    const vehiclePositionsData = await getData('http://127.0.0.1:5343/gtfs/seq/vehicle_positions.json', vehiclePositionsCacheFile);

    // Process the data and map it to relevant information
    const processedData = tripUpdatesData.entity.map(update => {
        const matchingTrip = tripsForRoute.find(trip => trip.trip_id === update.tripUpdate.trip.tripId);
        const matchingVehicle = vehiclePositionsData.entity.find(vehicle => vehicle.vehicle.trip.tripId === update.tripUpdate.trip.tripId);

        if (!matchingTrip) {
            return null;
        }

        const stopTimeUpdates = update.tripUpdate.stopTimeUpdate;
        const relevantStop = stopTimeUpdates.find(st => stopIds.includes(st.stopId));

        if (!relevantStop) return null;

        const timeToUse = relevantStop.arrival?.time || relevantStop.departure?.time;
        if (!timeToUse) return null;

        const liveArrivalTime = matchingVehicle ? new Date(matchingVehicle.vehicle.timestamp * 1000).toLocaleTimeString() : "N/A";
        const livePosition = matchingVehicle ? `${matchingVehicle.vehicle.position.latitude}, ${matchingVehicle.vehicle.position.longitude}` : "N/A";

        return {
            route_short_name: routeNumber,
            route_long_name: selectedRoute[0].route_long_name,
            service_id: update.tripUpdate.trip.serviceId || 'N/A',
            trip_headsign: matchingTrip.trip_headsign || 'N/A',
            scheduled_arrival_time: new Date(timeToUse * 1000).toLocaleTimeString(),
            live_arrival_time: liveArrivalTime,
            live_position: livePosition,
            estimated_travel_time: `${Math.abs(endStop - startStop) * 5} min`  // Assuming 5 minutes between stops
        };
    }).filter(data => data !== null);

    // Filter the processed data to include buses arriving within 10 minutes of the current time
    const currentTime = new Date(`${travelDate}T${travelTime}`).getTime();
    const filteredData = processedData.filter(row => {
        const scheduledArrival = Date.parse(`${travelDate} ${row.scheduled_arrival_time}`);
        return scheduledArrival >= currentTime && scheduledArrival <= currentTime + 10 * 60 * 1000;
    });

    // Display the filtered data in a table format
    console.table(filteredData);

    console.log("Thanks for using the Route tracker!");
}

runRoutePlanner();
