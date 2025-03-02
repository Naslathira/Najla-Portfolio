PROJECT TITLE:
CSVParser_Export - A Java Program for Analyzing Export Data

PURPOSE OF PROJECT:
This project is designed to read and analyze export data from a CSV file. It allows users to retrieve country-specific export information, list countries exporting certain products, count exporters of a specific product, and identify major exporters based on export value.

HOW TO START THIS PROJECT:
1. Ensure you have Java installed on your system.
2. Install the edu.duke library and Apache Commons CSV (org.apache.commons.csv).
3. Download the project files, including CSV_Parser.java and exportdata.csv.
4. Compile and run the program using a compatible IDE (e.g., VSCode, IntelliJ) or the command line (javac CSVParser_Export.java and java CSVParser_Export).

AUTHORS:
Najla Athira Anggoro Putri

USER INSTRUCTIONS:
1. tester() - Reads and prints all records from the CSV file, displaying country names, exports, and export values.
2. countryInfo(CSVParser parser, String country) - Displays the export details of a specific country.
3. listExportersTwoProducts(CSVParser parser, String exportItem1, String exportItem2) - Lists countries that export both specified products.
4. numberOfExporters(CSVParser parser, String exportItem) - Returns the number of countries exporting a given product.
5. bigExporters(CSVParser parser, String amount) - Identifies countries with export values larger than the given amount.
6. Run test2(), test3(), test4(), or test5() to test different functionalities with sample data from exportdata.csv.
