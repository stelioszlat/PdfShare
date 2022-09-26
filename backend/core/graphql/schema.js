const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Search {
        file: String
        author: String
        keywords: [Keyword]
    }

    type Keyword {
        keyword: String
        appeared: Int
    }
    
    schema {
        query: Search
    }
`)