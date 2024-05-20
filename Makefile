DOCKER_EXEC= docker exec -it 


all: 
	docker-compose up -d --build

stop:
	docker-compose stop

clean:
	docker-compose down --rmi all

# exemplo: make exec c=container_name exec="ls -la"
log:
	docker logs $(c)

exec: 
	$(DOCKER_EXEC) $(c) $(exec) 

re: clean all

.PHONY: all clean