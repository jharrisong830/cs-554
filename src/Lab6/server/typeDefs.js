export const typeDefs = `#graphql
    type Author {
        _id: String!
        name: String!
        bio: String
        dateOfBirth: String!
        books: [Book!]!
        numOfBooks: Int
    }

    enum Genre {
        FICTION
        NON_FICTION
        MYSTERY
        FANTASY
        ROMANCE
        SCIENCE_FICTION
        HORROR
        BIOGRAPHY
    }

    type Book {
        _id: String!
        title: String!
        publicationDate: String!
        genre: Genre!
        author: Author!
        publisher: Publisher!,
        chapters: [String!]!
    }

    type Publisher {
        _id: String!
        name: String!
        establishedYear: Int!
        location: String
        books: [Book!]!
        numOfBooks: Int
    }

    type Query {
        authors: [Author],
        books: [Book],
        publishers: [Publisher],
        getAuthorById(_id: String!): Author,
        getBookById(_id: String!): Book,
        getPublisherById(_id: String!): Publisher,
        getChaptersByBookId(_id: String!): [String],
        booksByGenre(genre: Genre!): [Book],
        publishersByEstablishedYear(min: Int!, max: Int!): [Publisher],
        searchAuthorByName(searchTerm: String!): [Author],
        searchBookByTitle(searchTerm: String!): [Book]
    },

    type Mutation {
        addAuthor(name: String!, bio: String, dateOfBirth: String!): Author,
        editAuthor(_id: String!, name: String, bio: String, dateOfBirth: String): Author,
        removeAuthor(_id: String!): Author,
        addPublisher(name: String!, establishedYear: Int!, location: String!): Publisher,
        editPublisher(_id: String!, name: String, establishedYear: Int, location: String): Publisher,
        removePublisher(_id: String!): Publisher,
        addBook(title: String!, publicationDate: String!, genre: Genre!, chapters: [String!]!, authorId: String!, publisherId: String!): Book,
        editBook(_id: String!, title: String, publicationDate: String, genre: Genre, chapters: [String!], authorId: String, publisherId: String): Book,
        removeBook(_id: String!): Book
    }
`;
