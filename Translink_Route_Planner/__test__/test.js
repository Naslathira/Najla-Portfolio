import path from 'path';
import prompt from 'prompt-sync';
import { loadCSV, filterData } from './dataframe';
import { getData } from './cache';
import { runRoutePlanner } from './translink-parser';
import { jest } from '@jest/globals'; // Import jest for mocking

jest.mock('prompt-sync', () => jest.fn(() => jest.fn()));
jest.mock('./dataframe', () => ({
    loadCSV: jest.fn(),
    filterData: jest.fn()
}));
jest.mock('./cache', () => ({
    getData: jest.fn()
}));

describe('runRoutePlanner', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        console.log = jest.fn();
        console.table = jest.fn(); // Mock console.table to verify table output
    });

    test('should prompt for route number and handle valid input', async () => {
        prompt.mockImplementation(() => {
            const inputs = ['66', '1 - 2', '2024-08-30', '12:00'];
            return () => inputs.shift();
        });

        loadCSV.mockImplementation((filePath) => {
            if (filePath === './static-data/routes.txt') {
                return Promise.resolve([{ route_short_name: '66', route_id: '1' }]);
            }
            if (filePath === './static-data/trips.txt') {
                return Promise.resolve([{ trip_id: '1', route_id: '1', trip_headsign: 'Downtown' }]);
            }
            if (filePath === './static-data/stop_times.txt') {
                return Promise.resolve([{ trip_id: '1', stop_id: '101', stop_sequence: 1 }]);
            }
            if (filePath === './static-data/stops.txt') {
                return Promise.resolve([{ stop_id: '101', stop_name: 'Main St', platform_code: 'A' }]);
            }
            return Promise.resolve([]);
        });

        filterData.mockImplementation((data, criteria) => {
            if (criteria.route_short_name === '66') {
                return [{ route_id: '1', route_short_name: '66' }];
            }
            if (criteria.route_id === '1') {
                return [{ trip_id: '1', trip_headsign: 'Downtown' }];
            }
            return [];
        });

        getData.mockImplementation((url, cacheFile) => Promise.resolve({
            entity: [
                { tripUpdate: { trip: { tripId: '1' }, stopTimeUpdate: [{ stopId: '101', arrival: { time: 1700000000 } }] } }
            ]
        }));

        await runRoutePlanner();

        // Check console.log for expected messages
        expect(console.log).toHaveBeenCalledWith("Welcome to the South East Queensland Route Planner!");
        expect(console.log).toHaveBeenCalledWith("Loading and processing data, please wait...");
        expect(console.log).toHaveBeenCalledWith("1. Main St, platform A");
        expect(console.log).toHaveBeenCalledWith("Thanks for using the Route tracker!");

        // Verify table output
        expect(console.table).toHaveBeenCalledWith([{
            route_short_name: '66',
            route_long_name: 'Route 66',
            service_id: 'N/A',
            trip_headsign: 'Downtown',
            scheduled_arrival_time: '12:00:00 PM',
            live_arrival_time: 'N/A',
            live_position: 'N/A',
            estimated_travel_time: '5 min'
        }]);
    });

    test('should handle invalid route input', async () => {
        prompt.mockImplementation(() => {
            const inputs = ['999', '66', '1 - 2', '2024-08-30', '12:00'];
            return () => inputs.shift();
        });

        loadCSV.mockImplementation((filePath) => {
            if (filePath === './static-data/routes.txt') {
                return Promise.resolve([{ route_short_name: '66', route_id: '1' }]);
            }
            return Promise.resolve([]);
        });

        filterData.mockImplementation((data, criteria) => {
            if (criteria.route_short_name === '66') {
                return [{ route_id: '1', route_short_name: '66' }];
            }
            return [];
        });

        getData.mockImplementation((url, cacheFile) => Promise.resolve({
            entity: []
        }));

        await runRoutePlanner();

        // Check console.log for error messages
        expect(console.log).toHaveBeenCalledWith("Please enter a valid bus route.");
        expect(console.log).toHaveBeenCalledWith("Loading and processing data, please wait...");
        expect(console.log).toHaveBeenCalledWith("No stops found for this route.");
        expect(console.log).toHaveBeenCalledWith("Thanks for using the Route tracker!");
    });

    test('should handle invalid stop range format', async () => {
        prompt.mockImplementation(() => {
            const inputs = ['66', '1 - 2a', '1 - 2', '2024-08-30', '12:00'];
            return () => inputs.shift();
        });

        loadCSV.mockImplementation((filePath) => {
            if (filePath === './static-data/routes.txt') {
                return Promise.resolve([{ route_short_name: '66', route_id: '1' }]);
            }
            if (filePath === './static-data/trips.txt') {
                return Promise.resolve([{ trip_id: '1', route_id: '1', trip_headsign: 'Downtown' }]);
            }
            if (filePath === './static-data/stop_times.txt') {
                return Promise.resolve([{ trip_id: '1', stop_id: '101', stop_sequence: 1 }]);
            }
            if (filePath === './static-data/stops.txt') {
                return Promise.resolve([{ stop_id: '101', stop_name: 'Main St', platform_code: 'A' }]);
            }
            return Promise.resolve([]);
        });

        filterData.mockImplementation((data, criteria) => {
            if (criteria.route_short_name === '66') {
                return [{ route_id: '1', route_short_name: '66' }];
            }
            if (criteria.route_id === '1') {
                return [{ trip_id: '1', trip_headsign: 'Downtown' }];
            }
            return [];
        });

        getData.mockImplementation((url, cacheFile) => Promise.resolve({
            entity: []
        }));

        await runRoutePlanner();

        // Check console.log for error messages
        expect(console.log).toHaveBeenCalledWith("Please follow the format and enter a valid number for the stop.");
        expect(console.log).toHaveBeenCalledWith("Loading and processing data, please wait...");
        expect(console.log).toHaveBeenCalledWith("1. Main St, platform A");
        expect(console.log).toHaveBeenCalledWith("Thanks for using the Route tracker!");
    });

    test('should handle invalid date and time format', async () => {
        prompt.mockImplementation(() => {
            const inputs = ['66', '1 - 2', '2024-08-30a', '2024-08-30', '12:00a'];
            return () => inputs.shift();
        });

        loadCSV.mockImplementation((filePath) => {
            if (filePath === './static-data/routes.txt') {
                return Promise.resolve([{ route_short_name: '66', route_id: '1' }]);
            }
            if (filePath === './static-data/trips.txt') {
                return Promise.resolve([{ trip_id: '1', route_id: '1', trip_headsign: 'Downtown' }]);
            }
            if (filePath === './static-data/stop_times.txt') {
                return Promise.resolve([{ trip_id: '1', stop_id: '101', stop_sequence: 1 }]);
            }
            if (filePath === './static-data/stops.txt') {
                return Promise.resolve([{ stop_id: '101', stop_name: 'Main St', platform_code: 'A' }]);
            }
            return Promise.resolve([]);
        });

        filterData.mockImplementation((data, criteria) => {
            if (criteria.route_short_name === '66') {
                return [{ route_id: '1', route_short_name: '66' }];
            }
            if (criteria.route_id === '1') {
                return [{ trip_id: '1', trip_headsign: 'Downtown' }];
            }
            return [];
        });

        getData.mockImplementation((url, cacheFile) => Promise.resolve({
            entity: []
        }));

        await runRoutePlanner();

        // Check console.log for error messages
        expect(console.log).toHaveBeenCalledWith("Incorrect date format. Please use YYYY-MM-DD");
        expect(console.log).toHaveBeenCalledWith("Incorrect time format. Please use HH:mm");
        expect(console.log).toHaveBeenCalledWith("Loading and processing data, please wait...");
        expect(console.log).toHaveBeenCalledWith("1. Main St, platform A");
        expect(console.log).toHaveBeenCalledWith("Thanks for using the Route tracker!");
    });
});
