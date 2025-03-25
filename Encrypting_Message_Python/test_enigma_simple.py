# -*- coding: utf-8 -*-
"""
Create and test an Enigma machine encryption and decoding machine

This code is based on the implementation of the Enigma machine in Python 
called pyEnigma by Christophe Goessen (initial author) and Cédric Bonhomme
https://github.com/cedricbonhomme/pyEnigma

Created on Tue Feb  5 12:17:02 2019

@author: uqscha22
"""
import enigma
import rotor

engine = enigma.Enigma(rotor.ROTOR_Reflector_A, rotor.ROTOR_I,
                                rotor.ROTOR_II, rotor.ROTOR_III, key="ABC",
                                plugs="AA BB CC DD EE")

#print(engine)

message = "Hello World"
print("Message:", message)
secret = engine.encipher(message)
print("Encoded Message:", secret)

# Decrypt the message
engine_decrypt = enigma.Enigma(rotor.ROTOR_Reflector_A, rotor.ROTOR_I,
                               rotor.ROTOR_II, rotor.ROTOR_III, key="ABC",
                               plugs="AA BB CC DD EE")

decoded_message = engine_decrypt.encipher(secret)
print("Decoded Message:", decoded_message)


ShakesHorribleMessage = "Vxye ajgh D yf? Ptn uluo yjgco L ws nznde czidn. Bsj ccj qdbk qjph wpw ypxvu!"

# Decrypt the message
engine = enigma.Enigma(rotor.ROTOR_Reflector_A, rotor.ROTOR_I,
                                rotor.ROTOR_II, rotor.ROTOR_III, key="SSC",
                                plugs="AA BB CC DD EE")

decoded = engine.encipher(ShakesHorribleMessage)
print("Decoded ShakesHorribleMessage: ", decoded)

