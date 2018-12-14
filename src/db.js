import datastore from 'nedb-promise';

const db = {};

db.messages = datastore({
  filename: 'db/messages.nedb',
  autoload: true
});

db.messages.ensureIndex({fieldName: 'timestamp' })

db.streams = datastore({
  filename: 'db/streams.nedb',
  autoload: true
});

db.streams.ensureIndex({fieldName: 'name', unique: true});

export { db };
