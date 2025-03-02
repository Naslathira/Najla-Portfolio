
PROJECT TITLE:
JavaScript Functional Programming – TransLink Data Parser  

PURPOSE OF PROJECT:
This project is a Node.js-based terminal application that parses and analyzes TransLink data for South East Queensland. It demonstrates functional programming principles in JavaScript by processing GTFS (General Transit Feed Specification) data to provide users with route details, stops, and schedules. The app focuses on immutability, function composition, and modularity while handling both static and real-time transit data.  

HOW TO START THIS PROJECT:
1. Install Node.js (if not already installed).  
2. Download and extract `SEQ_GTFS.zip` (https://drive.google.com/file/d/1tb-fxA6Cflf_6DH-jfg6ztx9ftxBk_VV/view?usp=sharing) into the `static-data/` folder.  
3. Run the API proxy server (if using real-time data):  
   ```sh
   chmod +x assign1_server_macos_m1  # For macOS  
   ./assign1_server_macos_m1  
   ```  
   or  
   ```sh
   chmod +x assign1_server_linux  # For Linux  
   ./assign1_server_linux  
   ```  
4. Run the application in the terminal:  
   ```sh
   node translink-parser.js  
   ```  

AUTHORS:  
Najla Athira Anggoro Putri  

USER INSTRUCTIONS:
1. Start the app in the terminal.  
2. Enter a bus route number** (e.g., 66 or 40).  
3. Select start and end stops** from the listed options.  
4. Enter the travel date and time** in `YYYY-MM-DD` and `HH:mm` formats.  
5. View route details**, including arrival times, live vehicle positions, and estimated travel duration.  
6. Restart or exit the app** based on the provided prompt.  

This project ensures efficient data processing and follows best practices in JavaScript functional programming, including declarative programming, immutability, and asynchronous data fetching.
