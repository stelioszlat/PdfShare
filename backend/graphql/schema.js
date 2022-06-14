const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Search {
        file: String
        author: String
    }
    
    schema {
        query: Search
    }
`)