const { Client } = require('pg');

// const dbConn = () => {
    const client = new Client({
            user: 'RecipeDB',
            host: 'localhost',
            database: 'RecipeDB',
            password: '1234',
            port: '5432'
        });
    
    client.connect((err, client, done) => {
        if (!err) {
            console.log('PostgreSQL Database Server Connected...');
        } else {
            console.log("PostgreSQL Database Server Can't Connect!!! " + err.stack);
        }
        // done();
    });
    // next();  
// }

// module.exports = dbConn;
module.exports = client;