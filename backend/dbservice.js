const mysql = require('mysql');

class DbService {
    static getDbServiceInstance() {
        // Use a singleton pattern to manage the database connection
        if (!DbService.instance) {
            DbService.instance = new DbService();
        }
        return DbService.instance;
    }

    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost', // Your DB host
            user: 'librarydb', // Your DB user
            password: 'haribhadrasql', // Your DB password
            database: 'librarydb' // Your DB name
        });

        this.connection.connect(err => {
            if (err) {
                console.error('Error connecting to the database:', err);
            } else {
                console.log('Connected to the database');
            }
        });
    }

    query(sql, params, callback) {
        this.connection.query(sql, params, callback);
    }
}

module.exports = DbService;
