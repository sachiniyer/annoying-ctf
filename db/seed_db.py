#!/usr/bin/env python3
import random

wordlist = open("db/entries_cipher.txt", "r")
words = wordlist.readlines()
outline = "INSERT INTO public.info (id, topic, title, meta, user_id, uuid) VALUES('{}', '{}' , '{}', '{}', '{}', '{}');\n"

def generate_random():
    random_string = ''

    l = random.randint(7, 20)
    for _ in range(l):
        random_integer = random.randint(97, 97 + 26 - 1)
        flip_bit = random.randint(0, 1)
        random_integer = random_integer - 32 if flip_bit == 1 else random_integer
        random_string += (chr(random_integer))

    i = random.randint(4, 6)
    eqs = ""
    e = random.randint(1, 3)
    for i in range(e):
        eqs += "="
    return "w" + str(i) + random_string + eqs

entries = []
for i in words:
    entries.append(outline.format(generate_random(), i[0:len(i)-1], generate_random(), generate_random(), generate_random(), generate_random()))


f = open('db/migrations/2_data.sql', 'w')
f.writelines(entries)
