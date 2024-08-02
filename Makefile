run:
	docker-compose up

rund:
	docker-compose up -d

npm-install:
	docker-compose run --rm app npm install $(package)

