import random

wordlist = open("wordlist/words.txt", "r")
words = wordlist.readlines()
used = []


def generate_word():
    index = random.randint(0, len(words))
    if index not in used:
        used.append(index)
        return words[index][0:len(words[index]) - 1]
    return generate_word()


def generate_address():
    p1 = random.randint(0, 255)
    p2 = random.randint(0, 255)
    p3 = random.randint(0, 255)
    return "/10." + str(p1) + "." + str(p2) + "." + str(p3)


template = "address=/"
entries = []

for i in range(1000):
    word = generate_word()
    address = generate_address()
    full = template + word + address + "\n"
    entries.append(full)

IP = "10.28.191.94"
full = template + generate_word() + "/" + IP + "\n"
entries.append(full)

conf = open('dns1/dnsmasq.conf', 'w')
conf.writelines(entries)
