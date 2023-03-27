#!/usr/bin/env python3
import random
from vigenere import encrypt, decrypt, random_key
import sys

sys.setrecursionlimit(5000)

wordlist = open("wordlist/words.txt", "r")
words = wordlist.readlines()
used = []

def generate_word():
    index = random.randint(0, len(words)-1)
    if index not in used:
        used.append(index)
        return words[index][0:len(words[index]) - 1]
    return generate_word()

entries = []
entries_plain = []
entries_cipher = []
cipher_key:str = "topics"
for i in range(2000):
    word = generate_word()
    cipher = encrypt(generate_word(), cipher_key)
    entries.append(word + ", " + cipher + "\n")
    entries_plain.append(word + "\n")
    entries_cipher.append(cipher + "\n")

f = open('db/entries_cipher.txt', 'w')
f.writelines(entries_cipher)
f = open('db/entries_plain.txt', 'w')
f.writelines(entries_plain)
f = open('db/entries.txt', 'w')
f.writelines(entries)
