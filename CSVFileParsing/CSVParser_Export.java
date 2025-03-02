import edu.duke.*;
import org.apache.commons.csv.*;

public class CSV_Parser {
    public void tester (){
        FileResource fr = new FileResource();
        CSVParser parser = fr.getCSVParser();
        for (CSVRecord record : parser){
            System.out.print(record.get("Country") + " ");
            System.out.print(record.get("Exports") + " ");
            System.out.println(record.get("Value (dollars)"));
        }
    }
    
    public void countryInfo (CSVParser parser, String country){
        for(CSVRecord record : parser){
            String ctr = record.get("Country");
            if (ctr.contains(country)){
            System.out.println(ctr + ": " + record.get("Exports") + ": " + record.get("Value (dollars)"));
            }
        }
        
    }
    public void test2 (){
        FileResource fr = new FileResource("exportdata.csv");
        CSVParser parser = fr.getCSVParser();
        System.out.println("hasil: " );
        countryInfo(parser,"Nauru");
        
            
        
    }

    public void listExportersTwoProducts(CSVParser parser, String exportItem1, String exportItem2){
        for(CSVRecord record : parser){
            
            String exp = record.get("Exports");
            if (exp.contains(exportItem1) && exp.contains(exportItem2)){
                    String country = record.get("Country");
                    System.out.println (country);
                }
            }
            
    }
    
    public void test3 (){
        FileResource fr = new FileResource("exportdata.csv");
        CSVParser parser = fr.getCSVParser();
        System.out.println("hasil: " );
        listExportersTwoProducts(parser,"cotton", "flowers");
        
            
        
    }
    public int numberOfExporters (CSVParser parser, String exportItem){
        int CountExp = 0;
        for (CSVRecord record : parser){
            String exp = record.get("Exports");
            if (exp.contains(exportItem)){
                String country = record.get("Country");
                CountExp++;
            }
            
        }
        return CountExp;
    }
    
    public void test4 (){
        FileResource fr = new FileResource("exportdata.csv");
        CSVParser parser = fr.getCSVParser();
        System.out.println("Number of Exporters: " + numberOfExporters(parser,"cocoa"));
        
            
        
    }
    
    public void bigExporters (CSVParser parser, String amount){
        for (CSVRecord record : parser){
            String country = record.get("Country");
            String value = record.get("Value (dollars)");
            if (value.length() > amount.length()){
                System.out.println(country + " " + value);
            }
    }
    }
    
    public void test5() {
    FileResource fr = new FileResource("exportdata.csv");

    System.out.println("Biggest exporters: ");
    bigExporters(fr.getCSVParser(), "$999,999,999,999"); // Buat parser baru
}

    
    

}
    
    

