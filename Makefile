REACT=frontend/node_modules/

all: $(REACT)
	docker-compose up -d --build


$(REACT):
	cd frontend && yarn install

clean:
	docker-compose down --rmi 

.PHONY: all clean