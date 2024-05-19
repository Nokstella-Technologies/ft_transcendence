
all: 
	docker-compose up -d --build


clean:
	docker-compose down --rmi all

re: clean all

.PHONY: all clean