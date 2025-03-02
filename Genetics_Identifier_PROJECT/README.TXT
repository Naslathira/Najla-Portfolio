PROJECT TITLE:
StoringAllGenes - A Java Program for Gene Extraction and Analysis

PURPOSE OF PROJECT:
This project is designed to analyze DNA sequences, identify genes based on start and stop codons, and extract them into a structured format. Additionally, it calculates the C-G ratio, counts specific codon occurrences, and processes gene sequences based on length and composition.

HOW TO START THIS PROJECT:
1. Ensure you have Java installed on your system.
2. Download the project files, including StoringAllGenes.java and necessary dependencies from Duke's edu.duke library.
3. Compile and run the Java program using a compatible IDE (e.g., VSCode, IntelliJ) or the command line (javac StoringAllGenes.java and java StoringAllGenes).

AUTHORS:
Najla Athira Anggoro Putri
USER INSTRUCTIONS:
1. The program analyzes DNA sequences provided as input strings or from files.
2. It identifies and extracts genes based on start (ATG) and valid stop codons (TAA, TAG, TGA).
3. Use getAllGenes(dna) to retrieve all genes in a DNA sequence.
4. Run processGenes(StorageResource sr) to analyze extracted genes, including length filtering and CG ratio evaluation.
5. Use CTGpiro(dna) to count occurrences of the CTG codon in the DNA sequence.
6. To test the program, run test() or testProcessGenes() to verify functionality with sample and real DNA data.
7. This project provides a fundamental approach to bioinformatics analysis using Java.
