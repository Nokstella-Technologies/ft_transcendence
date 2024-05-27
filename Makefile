DOCKER_EXEC= docker exec -it

all:
	docker-compose up -d --build

stop:
	docker-compose stop

clean: stop
	docker-compose down --rmi all

# exemplo: make exec c=container_name exec="ls -la"
log:
	docker logs -f $(c)

exec:
	$(DOCKER_EXEC) $(c) $(exec)

create_service:
	@if [ -z "$(name)" ]; then \
		echo "Usage: make create_service name=<service-name>"; \
	else \
		./setup_service.sh $(name); \
	fi

re: clean all

.PHONY: all clean create_service log exec
