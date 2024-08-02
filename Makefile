run:
	docker-compose up -d

destroy:
	docker-compose down

destroy-image: destroy
	docker-compose down --rmi all -v --remove-orphans

runb:
	docker-compose up

test:	
	docker-compose run --rm app npm run test


tcoverage:	
	docker-compose run --rm app npm run coverage

npm-install:
	docker-compose run --rm app npm install $(package)

