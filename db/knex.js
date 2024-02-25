const knex = require("knex");

const connectedKnex = knex({
    client: "sqlite3",
    connection: {
        filename: "totalLifedb.sqlite3"
    },
    useNullAsDefault: true // Add this line to set the useNullAsDefault flag
});

module.exports = connectedKnex;