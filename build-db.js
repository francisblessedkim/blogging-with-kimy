const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, 'database.db');
const schemaFilePath = path.join(__dirname, 'db_schema.sql');

const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
        console.error('Error opening database', err);
        process.exit(1);
    } else {
        console.log('Database connected');
        db.exec(fs.readFileSync(schemaFilePath, 'utf8'), (err) => {
            if (err) {
                console.error('Error executing schema', err);
            } else {
                console.log('Database schema applied successfully');
            }
            db.close();
        });
    }
});
