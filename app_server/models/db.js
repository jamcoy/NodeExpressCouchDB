var db = require("nano")("http://192.168.148.134:5984").use("testdb");

// test we have a connection and report to console
db.info(function(err, body, header) {
    if (err) {
        console.log('[Error connecting to DB]', err.message);
        return;
    }
    console.log('[Connected to DB]', body.db_name);
});
