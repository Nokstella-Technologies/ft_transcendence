REACT=frontend/node_modules/

all: 
	docker-compose up -d --build


clean:
	docker-compose down --rmi all
	rm -rf $(REACT) 

re: clean all

.PHONY: all clean