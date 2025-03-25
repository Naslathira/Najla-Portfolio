# -*- coding: utf-8 -*-
"""
Determine the shift of the Caesar Cypher

Created on Sat Feb  2 23:03:02 2019

@author: shakes
"""
from collections import Counter
import string

# Predicting Shift Based on Letter Frequency
"""
In this section, I will identify the most frequently occurring letter in the given text. 
Based on general knowledge, the most common letter in the English language is "e." 
Therefore, I will assume that the most frequently used letter in the encrypted message corresponds to "e" in plaintext. 
Using this assumption, I will determine the necessary shift value to decrypt the message by aligning the most common letter with "e."
"""
message = "Zyp cpxpxmpc ez wzzv fa le esp delcd lyo yze ozhy le jzfc qppe Ehz ypgpc rtgp fa hzcv Hzcv rtgpd jzf xplytyr lyo afcazdp lyo wtqp td pxaej hteszfe te Escpp tq jzf lcp wfnvj pyzfrs ez qtyo wzgp cpxpxmpc te td espcp lyo ozye esczh te lhlj Depaspy Slhvtyr" 

# Frequency of each letter
letter_counts = Counter(message)
print(letter_counts)

# Find the most frequent letter
maxFreq = -1
maxLetter = None
for letter, freq in letter_counts.items(): 
    print(letter, ":", freq) 
    if (letter == ' '):
        continue
    if (freq > maxFreq):
        maxFreq = freq
        maxLetter = letter

print("Max Ocurring Letter:", maxLetter)

# Predict shift (assuming max letter is 'e')
letters = string.ascii_letters
totLetters = 26
shift = 0
letterIndex = 0

for index, letter in enumerate(letters):
    if letter == maxLetter:
        letterIndex = index
        if letterIndex < totLetters:
            shift = (letterIndex - 4) % totLetters
        else:
            shift =(letterIndex - 30) % (totLetters+26) 

print ("Index of Max Letter in letters: ",letterIndex)
print("Predicted Shift:", shift)

# Create cipher dictionaries
keys = {}
invkeys = {}

for index, letter in enumerate(letters):
    if index < totLetters:  # Lowercase
        indexNew = (index + shift) % totLetters
    else:  # Uppercase
        indexNew = (index + shift) % totLetters + 26

    keys[letters[index]] = letters[indexNew]
    invkeys[letters[indexNew]] = letters[index]

#print("Cipher Dictionary:", keys)

# Decrypt message
decryptedMessage = []
for letter in message:
    if letter == ' ': #spaces
        decryptedMessage.append(letter)
    else:
        decryptedMessage.append(invkeys[letter])

print("Decrypted Message:", ''.join(decryptedMessage)) 

# Section I (c) - Brute Force Decryption (Trying All Possible Shifts)
print("\nSection I (c) - Brute Force Attack")

"""
Now, I will no longer assume that the most used letter is 'e'. Instead, I will iterate through
all possible shifts and generate the decrypted message for each one.
"""
message2 = message  # Reusing the same message
shiftnum = 0

for shift in range(totLetters):
    keys2 = {}
    invkeys2 = {}

    for index, letter in enumerate(letters):
        if index < totLetters:
            indexNew = (index + shift) % totLetters
        else:
            indexNew = (index + shift) % totLetters + 26

        keys2[letters[index]] = letters[indexNew]
        invkeys2[letters[indexNew]] = letters[index] 
            
    print("Shift " + str(shiftnum) +" :")
    shiftnum += 1

    decryptedMessage = []
    for letter in message2:
        if letter == ' ': #spaces
            decryptedMessage.append(letter)
        else:
            decryptedMessage.append(invkeys2[letter])
    print(" ", ''.join(decryptedMessage))


#Reference
#https://dev.to/jvon1904/how-to-wrap-around-a-range-of-numbers-with-the-modulo-cdo





