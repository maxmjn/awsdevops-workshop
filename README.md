# Things to remember
- `docker-compose build` builds image(s) for each service mentioned in `docker-compose.yml`.
- `docker-compose build --no-cache --pull` or `docker-compose build --no-cache --pull <service name>` builds image(s) without using the locally cached images.
- `docker-compose run <service name> <command>` brings up the service i.e.container and executes the command and shutsdown.
- `docker-compose exec <service name> <command>` brings up the service and executes the command. Use this for `ssh`, `DB login`
- `docker-compose up -d` brings up ALL the services in daemon mode
- `docker-compose up -d <service name>` brings up specific service in daemon mode
- `docker-compose logs -f <service name>` for specific service's logs

# docker-compose.yml
- To build image run `docker-compose build api`. This command uses yml file; looks under 'services > api' section and proceeds using 'services > api > build'. Then it goes into '/images', builds image using ApiDevDockerfile.
- To create container run `docker-compose run api lb`. This command will build docker image using section 'services > api > build', start a container and execute `lb` loopback cli.
- Command `docker-compose run api lb` gives an interactive input to create a loopback application. 
- You should see files generated in folder `./api`. This scaffolding is creating files within container folder `/usr/src/api` which is backed by volume `./api`.
- Look at ` WORKDIR` of ApiDevDockerfile and `volumes` of docker-compose.yml 
# package-lock.json
- It is used to keep the dependencies same for Everyone working on your project.
- For this to work Everyone on your project MUST use same version of NodeJS which is quite unlikely.
- YARN: To achieve the goal of dependency lock we will be using YARN which does not require everyone must have the same version of Yarn.
# YARN dependency locking
- Run `docker-compose run api yarn` instructs docker-compose to `yarn` within the container created using `api` block of docker-compose.yml.
- Now you should `yarn.lock` in your folder `api`
# package.json
- Edit `scripts > start` change to `nodemon .` from `node .`. We had added `nodemon` in ApiDevDockerfile.
- `nodemon` watches for file changes and restarts node server. On Windows use `nodemon -L .` to put in legacy mode to by-pass issues.
- `posttest` change to `yarn lint` from `npm run lint` because we use YARN.
- `posttest` remove ` && npm audit` as we have remove `package-lock.json`
# Up the application
- Run `docker-compose up`. Builds image, run container and brings up the application
- All good you should see something similar
```
api_1  | Sat, 16 Nov 2019 20:14:53 GMT hsts deprecated The "includeSubdomains" parameter is deprecated. Use "includeSubDomains" (with a capital D) instead. at node_modules/loopback/lib/server-app.js:74:25
api_1  | Web server listening at: http://localhost:3000
api_1  | Browse your REST API at http://localhost:3000/explorer
``` 
- To see the application in action use port `3001` because above output `http://localhost:3000/explorer` is from inside the container and container port `3000` is mapped to our host port `3001` in docker-compose.yml.
# Daemon mode the application
- use `docker-compose up -d` for daemon
# Logs monitor
- use `docker-compose logs -f`
- To view a specific service mentioned in docker-compose.yml try `docker-compose logs -f <service name>`
# Down the application
- run `docker container ls -a` should list one or more containers spun using the image built by `docker-compose build api`
- use `docker-compose down` removes not just the application container, also any previously spun up containers.
- run `docker container ls -a` should see no containers spun by using your image
#### Windows Only - for Host:Container volume synchronization
- Install python, pip then do `pip install docker-windows-volume-watcher`
- Then open new shell run `docker-volume-watcher`. Open another shell to run docker-compose commands.

# Api - DB
- Now with docker-compose.yml contains 2 services `api` and `devdb`.
- Run `docker-compose down` to make sure its clean slate, no containers running.
- Run `docker-compose up -d` will run both services in the background.
- Run `docker-compose logs -f` will output logs from ALL services.
- Run `docker-compose logs -f <service name>` to see logs from a specific service example `docker-compose logs -f api`.

# docker-compose exec
- Run `docker-compose exec devdb mysql -u root -p` should prompt for a password. This is same like logging into mysql through command-line.
- Docker-compose Exec command is getting `devdb` container because that is the service name we used in docker-compose.yml, then run the command `mysql -u root -p`.

# docker-compose alias
- create alias for docker-compose build, run, exec in some file (can be named anything) example `~/.bash_docker` then source it your bash profile.
- so now `docker-compose exec api mysql -u root -p` will become `dcoe api mysql -u root -p`

# RESET, Rebuild
- if any issues do these
```
1. dco build #rebuild images
2. dco up
```
# loopback - DB
- Make sure application is up `docker-compose down && docker-compose up -d` will bring up all services mentioned in docker-compose.yml.
- Add mysql connector to the Api `dcoe api yarn add loopback-connector-mysql`.
- With docker-compose each service can reference another service by name example service `api` can  reference service `devdb` using name `devdb`.
- -`datasources.json` refers to database `"database": "${MYSQL_DATABASE}"` where `${MYSQL_DATABASE}` is sourced from `/env/dev.env`
- - Here `${MYSQL_DATABASE}` refers to `devdb` which is a service in docker-compose.yml
- - Above is reason we are not using DB connection string.

# React app
- `WebDevDockerfile` defines the container for the React web application
- `env/webdev.env` mentions the api endpoint `localhost:3001`  

