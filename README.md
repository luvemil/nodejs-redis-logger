# redis-nodejs-logger

## Warning

The database adapters are a mess: in order to interface with the mongodb driver I had to write a lot of async/await in the adapter and, as a consequence, the main app now expects promises.

## Database adapters

### nedb

Runs in memory, simply use `config/nedb.json.sample` as a config example

### MongoDB

Add your configurations to `config/mongodb.json.sample`, namely host, port, username and password.

You can also spin a MongoDB database using `docker stack deploy` or `docker-compose` with `config/mongodb.yml.sample`
