# redis-nodejs-logger

## Database adapters

### nedb

Runs in memory, simply use `config/nedb.json.sample` as a config example

### MongoDB

Add your configurations to `config/mongodb.json.sample`, namely host, port, username and password.

You can also spin a MongoDB database using `docker stack deploy` or `docker-compose` with `config/mongodb.yml.sample`
