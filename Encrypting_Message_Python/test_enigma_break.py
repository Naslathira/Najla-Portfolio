# -*- coding: utf-8 -*-
"""
Create and test an Enigma machine encryption and decoding machine

This code is based on the implementation of the Enigma machine in Python 
called pyEnigma by Christophe Goessen (initial author) and Cédric Bonhomme
https://github.com/cedricbonhomme/pyEnigma

Created on Tue Feb  5 12:17:02 2019

@author: uqscha22
"""
import string
import enigma
import rotor

letters = string.ascii_letters # contains 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
capitalLetters = letters[-26:] # extract uppercase letters
#print(capitalLetters)

# Encrypted message and crib (known plaintext)
ShakesHorribleMessage = "Xm xti ca idjmq Ecokta Rkhoxuu! Kdiu gm xex oft uz yjwenv qik parwc hs emrvm sfzu qnwfg. Gvgt vz vih rlt ly cnvpym xtq sgfvk jp jatrl irzru oubjo odp uso nsty jm gfp lkwrx pliv ojfo rl rylm isn aueuom! Gdwm Qopjmw!"
crib = "Hail Shakes!"
crib_substring = ShakesHorribleMessage[-(len(crib)):]
#print("crib SUbstring:" + crib_substring)

rightKey = ""
count = 0

# Break the code via brute force search
# Iterate through all possible rotor key combinations
for r1 in capitalLetters:
    for r2 in capitalLetters:
        for r3 in capitalLetters:
            key = r1 + r2 + r3
            
            # Create a new Enigma machine with the current key
            engine = enigma.Enigma(rotor.ROTOR_Reflector_A, rotor.ROTOR_I,
                                   rotor.ROTOR_II, rotor.ROTOR_III, key=key,
                                   plugs="AA BB CC DD EE")
            # Decrypt the message using the current key
            decrypted = engine.encipher(ShakesHorribleMessage)
            count+=1  # increment the attempt counter
              
            # Check if the decrypted message ends with the crib
            if decrypted[-12:] == crib:
                rightKey = key # store the correct key
                print("The rotor key is:", rightKey)
                break
        if rightKey:
            break
    if rightKey:
        break
               
        

# Print the Decoded message
# Create a new Enigma machine with the correct key to decode the message
engine2 = enigma.Enigma(rotor.ROTOR_Reflector_A, rotor.ROTOR_I,
                                   rotor.ROTOR_II, rotor.ROTOR_III, key=rightKey,
                                   plugs="AA BB CC DD EE")

print ("Decoded ShakesHorribleMessage: " + engine2.encipher(ShakesHorribleMessage))

# NUMBER OF TRIES (ITERATION)
print("The number of attempts to break the code: " + str(count))

# It takes around 12 seconds for the iteration in my computer

# Section II Part e
"""
If I'm using 5 rotors, the calculation will be:
12 seconds / 11772 = 0.00102 seconds/key

Assuming the number of possible keys is:
26^5 = 11,881,376 possible keys

Hence, the estimated time to crack the message using 5 rotors is:
11,881,376 * 0.00102 = 12,119 seconds = 3.37 hours on my computer.
If we use plugs, it can take more time, maybe a day.
"""

# References
# https://courses.csail.mit.edu/6.857/2018/project/lyndat-nayoung-ssrusso-Enigma.pdf
# https://brilliant.org/wiki/enigma-machine/
# https://medium.com/@goncalorrc/enigma-machine-in-python-part-1-b9e220a8eaf3 


