import datastore from 'nedb-promise';

const db = {};

db.messages = datastore({
  filename: 'db/messages.nedb',
  autoload: true
});

db.messages.ensureIndex({fieldName: 'timestamp'});

db.streams = datastore({
  filename: 'db/streams.nedb',
  autoload: true
});

db.streams.ensureIndex({fieldName: 'name', unique: true});

const get_from_db = async (db,search) => {
  return await db.find(search);
}

const add_to_db = async (db,row) => {
  try {
    return await db.insert(row);
  } catch(e) {
    if ( e.errorType !== 'uniqueViolated') {
      console.error(e);
      return false;
    }
  }
  return true;
}

db.add_stream = row => add_to_db(db.streams,row);

db.get_streams = search => get_from_db(db.streams,search);

db.add_message = row => add_to_db(db.messages,row);

db.get_messages = search => get_from_db(db.messages,search);

export { db };
