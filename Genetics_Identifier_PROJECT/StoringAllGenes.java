
/**
 * Write a description of StoringAllGenes here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
import edu.duke.*;

public class StoringAllGenes {
    public int findStopCodon (String dna, int startIndex, String stopCodon){
        //nyari apakah stopcodon ada?? di index berapa
        int currIndex = dna.indexOf(stopCodon, startIndex+3);
        //terus cek apakah mereka kelipatan 3
        
        while (currIndex != -1){
            int diff = currIndex - startIndex;
            if (diff % 3 == 0){
                return currIndex;
            } else{
            currIndex = dna.indexOf(stopCodon, currIndex+1);
            
        }
        
        //returns the index of the first occurrence of stopCodon that appears past startIndex and is a multiple of 3 away from startIndex.
        //If there is no such stopCodon, this method returns the length of the dna strand.
    }
    return dna.length();
}
public String findGene(String dna, int start){
    int startIndex = dna.indexOf("ATG", start);
    if (startIndex == -1){
        return "";
    }
    int taaIndex = findStopCodon(dna, startIndex, "TAA");
    int tagIndex = findStopCodon(dna, startIndex, "TAG");
    int tgaIndex = findStopCodon(dna, startIndex, "TGA");
    
    int minIndex = dna.length();;
    if (taaIndex == -1 || tagIndex != -1 && (tagIndex < taaIndex)){
        minIndex = tagIndex;
    }else{
        minIndex = taaIndex;
    }
    
    if (minIndex == -1 || tgaIndex !=-1 && (tgaIndex < minIndex)){
        minIndex = tgaIndex;
    }
    
    if (minIndex == dna.length()){
        return "";
    }
    int endIndex = Math.min(minIndex + 3, dna.length());
    return dna.substring(startIndex, endIndex);
    }


public StorageResource getAllGenes (String dna){
    StorageResource genes = new StorageResource();
    int startIndex = 0;
    while (true){
        
        String currGene = findGene(dna, startIndex);
        if (currGene.isEmpty()){
            break;
        }
        genes.add(currGene);
        
        startIndex = dna.indexOf(currGene, startIndex)+ currGene.length();
    }
    return genes;
}

public void testOn (String dna) {
        System.out.println("testing printAllGenes on " + dna);
        StorageResource genes = getAllGenes(dna);
        for (String g : genes.data()){
            System.out.println(g);
        }
    }
    
    public void test(){
        testOn ("ATGATCTAATTTATGCTGCAACGGTGAAGA");
        testOn("");

        testOn ("ATGATCATAAGAAGATAATAGAGGGCCATGTAA");
    }

//PART 2-------------------
public double cgRatio(String dna) {
    int c = 0, g = 0;
    int indexC = dna.indexOf("C"); // cari index pertama C
    while (indexC != -1) {  // jika C ditemukan
        c++;  // tambahkan hitungan C
        indexC = dna.indexOf("C", indexC + 1); // cari C berikutnya setelah indexC
    }

    int indexG = dna.indexOf("G"); // cari index pertama G
    while (indexG != -1) {  // jika G ditemukan
        g++;  // tambahkan hitungan G
        indexG = dna.indexOf("G", indexG + 1); // cari G berikutnya setelah indexG
    }

    // Kembalikan rasio C-G jika panjang dna lebih dari 0
    double ratio = (double) (c + g) / dna.length();
        return ratio;
    }
    
//PART 3-------------------
public void processGenes(StorageResource sr){
    //Strings in sr that are longer than 9 characters
    System.out.println("Gene that longer than 9 characters: ");
    int countGene = 0;
    for (String gene : sr.data()){
        countGene++;
    }
    System.out.println(countGene);
    
    
    //number of Strings in sr that are longer than 9 characters
    System.out.println("Number of gene that longer than 9 characters: ");
    int count9=0;
    for (String gene : sr.data()){
        
        if (gene.length() > 60){
            
            count9++;
            
        }
        
    }
    System.out.println(count9);
    
    System.out.println("Gene with CG ratio above 0.35: ");
    for (String gene : sr.data()){
        double ratio = cgRatio(gene);
        if (ratio > 0.35){
            System.out.println(gene + ", ratio : " + ratio);
        }
    }
    //Strings in sr whose C-G-ratio is higher than 0.35
    
    System.out.println("Number of gene with CG ratio above 3.5: ");
    int countCG = 0;
    for (String gene : sr.data()){
        double ratio = cgRatio(gene);
        if (ratio > 0.35){
            countCG++;          
        }
        
    }
    System.out.println(countCG);
    
    
    //print the length of the longest gene in sr
    int maxLength= 0;
    for (String gene : sr.data()){
        if(gene.length() > maxLength){
            maxLength = gene.length();
        }
        
    }
    System.out.println("The length of the longest gene: " + maxLength);
    
    
    
    
    

}

public int CTGpiro(String dna){
    int countCTG = 0;
    int indexCTG = dna.indexOf("CTG");
    while (indexCTG != -1) {  // jika C ditemukan
        countCTG++;  // tambahkan hitungan C
        indexCTG = dna.indexOf("CTG", indexCTG + 3); // cari C berikutnya setelah indexC
    }
       return countCTG;
    }

public void testProcessGenes() {
    System.out.println("_____________________________________________________");
       
        //KALO PAKE FILE:
       FileResource fr = new FileResource("GRch38dnapart.fa");
        String dna = fr.asString().toUpperCase();
        StorageResource sr2 = new StorageResource();
        
        // Assume we have a method getAllGenes that extracts genes from DNA
       // sr2 = getAllGenes(dna);
        
       System.out.println("Test Case 2: Real DNA from file");
        //processGenes(sr2);
        int count = CTGpiro(dna);
    System.out.println("Jumlah CTG dalam DNA: " + count);
        
        
        
       
       //KALO PAKE LINK
       /* URLResource url = new URLResource ("https://www.cs.duke.edu/~rodger/GRch38dnapart.fa");
       String dna = url.asString();
       StorageResource sr2 = new StorageResource();
       
       sr2 = getAllGenes(dna);
       System.out.println("Test Case 2: Real DNA from file");
        processGenes(sr2);
        */

    
        
}

}

