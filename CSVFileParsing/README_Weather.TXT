PROJECT TITLE: CSV Weather Data Parser

PURPOSE OF PROJECT:
This project processes and analyzes weather data from CSV files. It extracts key weather information such as the coldest temperature, lowest humidity, and average temperature from a given dataset. The project also supports finding the file with the coldest temperature and calculating average temperature based on humidity conditions.

HOW TO START THIS PROJECT:
1. Ensure you have Java installed and a compatible IDE (e.g., Eclipse, IntelliJ, or VS Code).
2. Install the required dependencies: Duke Library (edu.duke), Apache Commons CSV (org.apache.commons.csv)
3. Place the weather CSV files in the appropriate directory.
4. Run the main test methods to analyze the weather data.

AUTHORS:
Najla Athira Anggoro Putri

USER INSTRUCTIONS:
1. Run testColdestHourInFile() to find the coldest temperature in a single file.
2. Run testFileWithColdestTemperature() to determine which file contains the coldest temperature and list all temperatures from that day.
3. Run testLowestHumidityInFile() to find the lowest humidity in a single file.
4. Run testLowestHumidityInManyFiles() to determine the lowest humidity across multiple files.
5. Run testAverageTemperatureInFile() to calculate the average temperature in a given dataset.
6. Run testAverageTemperatureWithHighHumidityInFile() to compute the average temperature for records with a humidity level above a specified threshold.
