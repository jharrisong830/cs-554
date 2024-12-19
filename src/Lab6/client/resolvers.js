import { gql } from "@apollo/client";

// queries

export const GET_AUTHORS_LIST = gql`
    query {
        authors {
            _id
            name
        }
    }
`;

export const GET_BOOKS_LIST = gql`
    query {
        books {
            _id
            title
        }
    }
`;

export const GET_PUBLISHERS_LIST = gql`
    query {
        publishers {
            _id
            name
        }
    }
`;

export const GET_BOOK_BY_ID = gql`
    query ($id: String!) {
        getBookById(_id: $id) {
            _id
            title
            publicationDate
            genre
            author {
                _id
                name
            }
            publisher {
                _id
                name
            }
            chapters
        }
    }
`;

export const GET_AUTHOR_BY_ID = gql`
    query ($id: String!) {
        getAuthorById(_id: $id) {
            _id
            bio
            books {
                _id
                title
            }
            dateOfBirth
            name
            numOfBooks
        }
    }
`;

export const GET_PUBLISHER_BY_ID = gql`
    query ($id: String!) {
        getPublisherById(_id: $id) {
            _id
            books {
                _id
                title
            }
            establishedYear
            location
            name
            numOfBooks
        }
    }
`;

export const BOOKS_BY_GENRE = gql`
    query ($genre: Genre!) {
        booksByGenre(genre: $genre) {
            _id
            title
        }
    }
`;

export const PUBLISHERS_BY_ESTABLISHED_YEAR = gql`
    query ($min: Int!, $max: Int!) {
        publishersByEstablishedYear(min: $min, max: $max) {
            _id
            name
        }
    }
`;

export const SEARCH_AUTHOR_BY_NAME = gql`
    query ($searchTerm: String!) {
        searchAuthorByName(searchTerm: $searchTerm) {
            _id
            name
        }
    }
`;

export const SEARCH_BOOK_BY_TITLE = gql`
    query ($searchTerm: String!) {
        searchBookByTitle(searchTerm: $searchTerm) {
            _id
            title
        }
    }
`;

// mutations

export const EDIT_BOOK = gql`
    mutation (
        $id: String!
        $title: String
        $publicationDate: String
        $genre: Genre
        $chapters: [String!]
        $authorId: String
        $publisherId: String
    ) {
        editBook(
            _id: $id
            title: $title
            publicationDate: $publicationDate
            genre: $genre
            chapters: $chapters
            authorId: $authorId
            publisherId: $publisherId
        ) {
            _id
        }
    }
`;

export const EDIT_AUTHOR = gql`
    mutation ($id: String!, $name: String, $bio: String, $dateOfBirth: String) {
        editAuthor(
            _id: $id
            name: $name
            bio: $bio
            dateOfBirth: $dateOfBirth
        ) {
            _id
        }
    }
`;

export const EDIT_PUBLISHER = gql`
    mutation (
        $id: String!
        $name: String
        $establishedYear: Int
        $location: String
    ) {
        editPublisher(
            _id: $id
            name: $name
            establishedYear: $establishedYear
            location: $location
        ) {
            _id
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation ($id: String!) {
        removeBook(_id: $id) {
            _id
        }
    }
`;

export const REMOVE_AUTHOR = gql`
    mutation ($id: String!) {
        removeAuthor(_id: $id) {
            _id
        }
    }
`;

export const REMOVE_PUBLISHER = gql`
    mutation ($id: String!) {
        removePublisher(_id: $id) {
            _id
        }
    }
`;

export const ADD_BOOK = gql`
    mutation (
        $title: String!
        $publicationDate: String!
        $genre: Genre!
        $chapters: [String!]!
        $authorId: String!
        $publisherId: String!
    ) {
        addBook(
            title: $title
            publicationDate: $publicationDate
            genre: $genre
            chapters: $chapters
            authorId: $authorId
            publisherId: $publisherId
        ) {
            _id
        }
    }
`;

export const ADD_AUTHOR = gql`
    mutation ($name: String!, $dateOfBirth: String!, $bio: String) {
        addAuthor(name: $name, dateOfBirth: $dateOfBirth, bio: $bio) {
            _id
        }
    }
`;

export const ADD_PUBLISHER = gql`
    mutation ($name: String!, $establishedYear: Int!, $location: String!) {
        addPublisher(
            name: $name
            establishedYear: $establishedYear
            location: $location
        ) {
            _id
        }
    }
`;
