
/**
 * Write a description of BabyName_MiniProject here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */

import edu.duke.*;
import org.apache.commons.csv.*;
import java.io.File;

public class BabyName_MiniProject {
    public void totalBirths (FileResource fr){
        int totBirth = 0;
        int totF = 0;
        int totM = 0;
        for (CSVRecord rec : fr.getCSVParser(false)){
            int numBorn = Integer.parseInt(rec.get(2));
            if (rec.get(1).equals("F")){
                totF += numBorn;
                
            }
            else{
                totM += numBorn;
            }
            totBirth += numBorn;
        }
        System.out.println("Total Birth is " + totBirth + ", " + totF + " (Female)" + ", " + totM + " (Male)");
    }
    
    public void testTotalBirth(){
        FileResource fr = new FileResource();
        totalBirths(fr);
    }
    
    public void totalNames (FileResource fr){
        int numBorn = 0;
        int totF = 0;
        int totM = 0;
        for (CSVRecord rec : fr.getCSVParser(false)){
            
            if (rec.get(1).equals("F")){
                totF++;
                numBorn++;
                
            }
            else{
                totM++;
                numBorn++;
            
            }
            
        }
        System.out.println("Total name is " + numBorn + ", " + totF + " (Female)" + ", " + totM + " (Male)");
    }
    public void testTotNames(){
        FileResource fr = new FileResource();
        totalNames(fr);
    }
    
    public int getRank (int year,String name, String gender){
        // rank 1 nama paling banyak,2,3 ,str.
        // kalo nama gaada return -1
        int rank = 1;
        FileResource fr = new FileResource("yob"+ year + ".csv");
        for (CSVRecord rec : fr.getCSVParser(false)){
            if (rec.get(1).equals(gender)){
                if (rec.get(0).equals(name)){
                    return rank;
                    
                }
                
                rank++;
                }
                
            }
             return -1;
             
            }
    
    public void testGetRank (){
    
        System.out.println("Rank nya adalah " + getRank(1971, "Frank", "M"));
    }
    
    public String getName (int year, int rank, String gender){
        int currRank= 1;
        
        FileResource fr = new FileResource("yob"+ year +".csv");
        for (CSVRecord rec : fr.getCSVParser(false)){
            if (rec.get(1).equals(gender)){
                if (currRank== (rank)){
                    String name = rec.get(0);
                    return name;
                }
                currRank++;
            }
            
        }
        return "NO NAME";
    }
    
    public void testGetName (){
    
        System.out.println("Namanya adalah " + getName(1982, 450, "M"));
    }
    
    public void whatIsNameInYear(String name, int year, int newYear, String gender){
        
        int rank = 0;
        
        int rankNew = getRank(year, name, gender);
        rank += rankNew;
        
    
        String sameName = "";
        int currRank= 1;
        FileResource f = new FileResource("yob"+ newYear +".csv");
        for (CSVRecord rec : f.getCSVParser(false)){
            if (rec.get(1).equals(gender)){
                
                
                if (currRank == rank){
                    sameName = rec.get(0);
                    
                }
                currRank++;
            }
    
        
    }
    System.out.println(name + " born in " + year + " would be " + sameName + " if she was born in " + newYear);
    }
    
    public void testWhatIsNameInYear(){
        whatIsNameInYear("Susan",1972, 2014, "F");
        
    }
    
    public int yearOfHighestRank (String name, String gender){
        int highestRank = 0;
        int highestYear = -1;
        
        DirectoryResource dr = new DirectoryResource();
        for (File f : dr.selectedFiles()){
            FileResource fr = new FileResource(f);
            String fileName = f.getName();
            int year = Integer.parseInt(fileName.replaceAll("\\D+", ""));
            int currFileRank = getRank(year,name,gender);
            if (currFileRank == -1) {
                continue;
            }
            //misal ada rankk 2
            // masukin ke curr
            //terus kalo misal highest masih kosong
            //masukin curr ke highest
            
                if (highestRank == 0){
                    highestRank = currFileRank;
                    highestYear = year;
                }

                if (currFileRank < highestRank){
                    highestRank = currFileRank;
                    highestYear = year;
    
                }
            
        
        
    }
        
        
        
        return highestYear;
    }

    public void TESTYearOfHinghestRank(){
        int highestYear = yearOfHighestRank("Mich", "M");
        System.out.println("Final Highest Rank Year: " + highestYear);
        
    }   
    
    
    public Double getAverageRank (String name, String gender){
        Double jmlRank = 0.0;
        Double jmlFile = 0.0;
        DirectoryResource dr = new DirectoryResource();
        for (File f : dr.selectedFiles()){
            FileResource fr = new FileResource(f);
            String fileName = f.getName();
            int year = Integer.parseInt(fileName.replaceAll("\\D+", ""));
            int currFileRank = getRank(year,name,gender);
            
            if (currFileRank != -1){
                jmlRank += currFileRank;
                jmlFile++;
            }
            else{
                continue;
            }
        
        }
    Double avgRank = jmlRank/jmlFile;
    return avgRank;


    }
    public void TESTgetAverageRank(){
        Double highestYear2 = getAverageRank("Susan", "F");
        System.out.println("AverageRank: " + highestYear2);
        Double highestYear = getAverageRank("Robert", "M");
        System.out.println("AverageRank: " + highestYear);
    }
    
    public int getTotalBirthsRankedHigher (int year, String name, String gender){
        // pas dimasukin cari jumlah bayi dgn nama lain yang rank nya diatas var name;
        int nameRank = getRank(year,name,gender);
        int jmlOrg = 0;
        FileResource fr = new FileResource("yob"+ year +".csv");
        for (CSVRecord rec : fr.getCSVParser(false)){
            if (rec.get(1).equals(gender)){
                
                
                
                    if (rec.get(0).equals(name)){
                        break;
                    
                    }
                int org = Integer.parseInt(rec.get(2));
                jmlOrg += org;
                
                }
          
        }
        return jmlOrg;

    }
    
    public void testTotalBirthRankesHigher(){
        int tot =  getTotalBirthsRankedHigher(1990, "Emily", "F");
        System.out.println("hasilnya: "+ tot);
        int tot2 =  getTotalBirthsRankedHigher(1990, "Drew", "M");
        System.out.println("hasilnya: "+ tot2);
    }
}

    
    
