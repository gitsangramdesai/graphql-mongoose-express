const graphql = require("graphql")
const { GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = graphql

const Book = require("../models/book.model")
const Author = require("../models/author.model")
const mongoose = require("mongoose")

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        genre: { type: GraphQLString },
        bookCover: { type: GraphQLString },
        summary: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorID)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        bio: { type: GraphQLString },
        picture: { type: GraphQLString },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({ authorID: parent._id })               
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({})
            }
        },
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Author.findById(args.id);
            }
        }
    }
});


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                bio: { type: new GraphQLNonNull(GraphQLString) },
                picture: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age,
                    bio: args.bio,
                    picture: args.picture
                });

                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                bookCover: { type: new GraphQLNonNull(GraphQLString) },
                summary: { type: new GraphQLNonNull(GraphQLString) },
                authorID: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let book = new Book({
                    title: args.title,
                    genre: args.genre,
                    bookCover: args.bookCover,
                    authorID: args.authorID,
                    summary: args.summary
                });
                return book.save();
            }
        }
    }
});
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});