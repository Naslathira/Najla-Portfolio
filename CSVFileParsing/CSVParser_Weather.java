
import edu.duke.*;
import org.apache.commons.csv.*;
import java.io.File;

public class CSVParser_Weather {
    
    public CSVRecord coldestHourInFile (CSVParser parser){
        CSVRecord coldest = null;
        
        for (CSVRecord currRow : parser){
            // Ambil suhu sebagai string
            String tempStr = currRow.get("TemperatureF");

            // Lewati suhu tidak valid (-9999) atau nilai kosong
            if (tempStr.equals("-9999") || tempStr.isEmpty()) {
            continue;
            }
        
            double currTemp = Double.parseDouble(currRow.get("TemperatureF"));
            
            
            if (coldest == null){
                coldest = currRow;
                
            }else{
                double coldestTemp = Double.parseDouble(coldest.get("TemperatureF"));
                
                if (currTemp < coldestTemp){
                    coldest = currRow;
                }
                
            }
              
        }
         return coldest;
    }
      
    public void testColdestHourInFile(){
        FileResource fr = new FileResource();
        CSVRecord cold = coldestHourInFile(fr.getCSVParser());
        System.out.println("Coldest temperature: " + cold.get("TemperatureF") +"F, " );
        
    }
    
    public String fileWithColdestTemperature(){
        // cari kolom temperatur, cari temperatur terrendah (dingin)
        DirectoryResource dr = new DirectoryResource();
        CSVRecord coldest = null;
        String coldestFile = null;
        
        for (File f : dr.selectedFiles()){
            FileResource fr = new FileResource(f);
            CSVRecord currColdest = coldestHourInFile(fr.getCSVParser());
            
            
            if (coldest == null){
                coldest = currColdest;
            }
            
            else{ 
                double currTemp = Double.parseDouble(currColdest.get("TemperatureF"));
                double coldestTemp = Double.parseDouble(coldest.get("TemperatureF"));
                if (currTemp < coldestTemp){
                
                coldest = currColdest;
                coldestFile = f.getName();
            }
               
        }
        // akses folder dan buat loop untuk setiap file
        // representasikan setiap baris dalam file dengan csvrecord
        // buat fungsi tentukan mana yang paling rendan dari semua baris di file itu.
        //masukan value ke variable tertinggi, ulangi iterasi hingga baris akhir.
        // lanjut cari di file selanjutnya, setelah dapat value tertinggi di file, compare
        // compare ke var tertinggi.
    }
    

    return coldestFile;
}
public void testFileWithColdestTemperature(){
    String coldFile = fileWithColdestTemperature();
    System.out.println("Coldest day was in file: " + coldFile);
    
    FileResource fr = new FileResource("nc_weather/2014/"+coldFile);
    CSVParser parser = fr.getCSVParser();
    CSVRecord coldestHour = coldestHourInFile(parser);
    System.out.println("Coldest temperature on that day was: " + coldestHour.get("TemperatureF"));
    
    System.out.println("All the Temperatures on the coldest day were: ");
    CSVParser parser2 = fr.getCSVParser();
    for (CSVRecord record : parser2){
        System.out.println(record.get("DateUTC") + ": " + record.get("TemperatureF") + "°F");
        
    }
    
}

public CSVRecord lowestHumidityInFile(CSVParser parser){
    CSVRecord lowestHumid = null;
    for (CSVRecord currRow: parser){
        String humidityStr = currRow.get("Humidity");
        if (humidityStr.equals("N/A") || humidityStr.isEmpty()) {
            continue;
        }
        
        if (lowestHumid == null){
            lowestHumid = currRow;
        
        }else{
            Double mhTemp = Double.parseDouble(lowestHumid.get("Humidity"));
            Double crTemp = Double.parseDouble(currRow.get("Humidity"));
            if(crTemp < mhTemp){
            lowestHumid = currRow;
            }
        
        }
    }
    return lowestHumid;
}

public void testLowestHumidityInFile(){
    FileResource fr = new FileResource();
    CSVParser parser = fr.getCSVParser();
    CSVRecord csv = lowestHumidityInFile(parser);
    
    System.out.println("Lowest humidity was " + csv.get("Humidity") + " at " + csv.get("DateUTC"));
    
    
}

public CSVRecord lowestHumidityInManyFiles(){
        DirectoryResource dr = new DirectoryResource();
        CSVRecord lowHumid = null;
        
        
        for (File f : dr.selectedFiles()){
            FileResource fr = new FileResource(f);
            CSVRecord currlowHumid = lowestHumidityInFile(fr.getCSVParser());
            
            
            if (lowHumid == null){
                lowHumid = currlowHumid;
            }
            
            else{ 
                double currlowHumidTemp = Double.parseDouble(currlowHumid.get("Humidity"));
                double lowHumidTemp = Double.parseDouble(lowHumid.get("Humidity"));
                if (currlowHumidTemp < lowHumidTemp){
                
                lowHumid = currlowHumid;
                }
               
            }
    }
    return lowHumid;
}

public void testLowestHumidityInManyFiles(){
    CSVRecord lowHumid = lowestHumidityInManyFiles();
    System.out.println("Lowest humidity was " + lowHumid.get("Humidity") + " at " + lowHumid.get("DateUTC"));
    
}

public Double averageTemperatureInFile (CSVParser parser){
    Double Temp = 0.0;
    Double jumlah = 0.0;
    for (CSVRecord currTemp : parser){
        Double temperature = Double.parseDouble(currTemp.get("TemperatureF"));
        Temp = Temp + temperature;
        jumlah++;
        
    }
    Double average = Temp / jumlah;
    return average;
}

public void testAverageTemperatureInFile(){
    FileResource fr = new FileResource();
    CSVParser parser = fr.getCSVParser();
    Double average = averageTemperatureInFile(parser);
    System.out.println("Average temperature in file is " + average);
}

public Double averageTemperatureWithHighHumidityInFile (CSVParser parser, int value){
    //looping tiap parser cari humidity > atau = value
    
    Double temper = 0.0;
    Double jml = 0.0;
    
    for (CSVRecord currH : parser){
        Double currHTemp = Double.parseDouble(currH.get("Humidity"));
        if (currHTemp >= value){
            Double Tmp = Double.parseDouble(currH.get("TemperatureF"));
            temper = temper + Tmp;
            jml++;
        } 
    }
    if (jml == 0) {  
        return null;
    }
    Double wantedHumid = temper/jml;
        
    
        // kalo ada tarik temperature, masukin method averageTemperatureInFile 
        // return hasilnya in double (which is average temperaturenya)
        return wantedHumid;
    }


public void testAverageTemperatureWithHighHumidityInFile(){
    FileResource fr = new FileResource();
    CSVParser parser = fr.getCSVParser();
    Double average = averageTemperatureWithHighHumidityInFile(parser, 80);
    if (average == null){
        System.out.println("No temperatures with that humidity");       
    } else {
    System.out.println(average);
}
}
}

    


