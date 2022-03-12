const db = require('./db/connect');
const programInit = require('./utils/programInit');

db.connect(err => {
  if (err) throw err;
  console.log('');
  console.log('Database connected.');
  programInit();
});
