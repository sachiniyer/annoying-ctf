##
# CTF
#
# @file
# @version 0.1
build:
	python db/gen_topics.py
	python db/seed_db.py
	python dns1/seed_addresses.py
clean:
	rm db/entries*
	rm db/migrations/2_data.sql
	rm dns1/dnsmasq.conf
# end
