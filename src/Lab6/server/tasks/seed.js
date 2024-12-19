import { authors, books, publishers } from "../config/mongoCollections.js";
import { closeConnection } from "../config/mongoConnection.js";
import { ObjectId } from "mongodb";

const author1Id = new ObjectId();
const publisher1Id = new ObjectId();

const book1Id = new ObjectId();
const sampleBook1 = {
    _id: book1Id,
    title: "Hello, world!",
    publicationDate: "08/30/2003",
    genre: "FICTION",
    authorId: author1Id,
    publisherId: publisher1Id,
    chapters: ["Java", "Script", "Sucks"]
};

const book2Id = new ObjectId();
const sampleBook2 = {
    _id: book2Id,
    title: "The Sequel to 'Hello, world!'",
    publicationDate: "08/31/2003",
    genre: "FICTION",
    authorId: author1Id,
    publisherId: publisher1Id,
    chapters: ["Java", "Script", "Sucks"]
};

const sampleAuthor1 = {
    _id: author1Id,
    name: "Mr. Poopy Butthole",
    bio: "Adventuring buddy of Rick Sanchez.",
    dateOfBirth: "04/20/1969",
    books: [book1Id, book2Id]
};

const author2Id = new ObjectId();

const book3Id = new ObjectId();
const sampleBook3 = {
    _id: book3Id,
    title: "Goodbye, world!",
    publicationDate: "09/01/2003",
    genre: "FICTION",
    authorId: author2Id,
    publisherId: publisher1Id,
    chapters: ["Java", "Script", "Sucks"]
};

const sampleAuthor2 = {
    _id: author2Id,
    name: "Pim Pimling",
    bio: "He works at the place",
    dateOfBirth: "04/22/1969",
    books: [book3Id]
};

const samplePublisher1 = {
    _id: publisher1Id,
    name: "i don't care",
    establishedYear: 2000,
    location: "New Donk City",
    books: [book1Id, book2Id, book3Id]
};

const author3Id = new ObjectId();
const publisher2Id = new ObjectId();

const book4Id = new ObjectId();
const sampleBook4 = {
    _id: book4Id,
    title: "A whole new world",
    publicationDate: "09/02/2003",
    genre: "FICTION",
    authorId: author3Id,
    publisherId: publisher2Id,
    chapters: ["Java", "Script", "Sucks"]
};

const sampleAuthor3 = {
    _id: author3Id,
    name: "Bill Nye the Science Guy",
    bio: "Died in a tragic hot air balloon accident.",
    dateOfBirth: "01/01/1984",
    books: [book4Id]
};

const samplePublisher2 = {
    _id: publisher2Id,
    name: "Mr. Boss Printing",
    establishedYear: 1985,
    location: "Petal Isles",
    books: [book4Id]
};

const authorCol = await authors();
const bookCol = await books();
const publisherCol = await publishers();

await authorCol.insertMany([sampleAuthor1, sampleAuthor2, sampleAuthor3]);
await bookCol.insertMany([sampleBook1, sampleBook2, sampleBook3, sampleBook4]);
await publisherCol.insertMany([samplePublisher1, samplePublisher2]);

await closeConnection();
