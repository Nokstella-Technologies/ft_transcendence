

all:
	docker-compose up -d --build

clean:
	docker-compose down --rmi 

.PHONY: all clean