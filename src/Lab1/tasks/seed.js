import { closeConnection } from "../config/mongoConnection.js";
import { movieData } from "../data/index.js";

const exampleMovie = {
    title: "Bill and Ted Face the Music",
    cast: [
        { firstName: "Keanu", lastName: "Reeves" },
        { firstName: "Alex", lastName: "Winter" }
    ],
    info: { director: "Dean Parisot", yearReleased: 2020 },
    plot: "Once told they'd save the universe during a time-traveling adventure, 2 would-be rockers from San Dimas, California find themselves as middle-aged dads still trying to crank out a hit song and fulfill their destiny.",
    rating: 4.5
};

const exampleComments = [
    {
        name: "Patrick",
        comment: "Most Excellent Movie!"
    },
    {
        name: "Jason",
        comment: "Bogus.. Most Heinous"
    },
    {
        name: "Mark",
        comment: "Put them in the iron maiden"
    },
    {
        name: "Bill & Ted",
        comment: "Excellent!!"
    },
    {
        name: "Mark",
        comment: "Execute them!"
    },
    {
        name: "Bill & Ted",
        comment: "Bogus!"
    }
];

for (let i = 0; i < 200; i++) {
    const { _id } = await movieData.createMovie(
        `${i + 1} -> ${exampleMovie.title}`,
        exampleMovie.cast,
        exampleMovie.info,
        exampleMovie.plot,
        exampleMovie.rating,
        exampleMovie.comments
    );
    for (const cmt of exampleComments) {
        await movieData.createComment(_id.toString(), cmt.name, cmt.comment);
    }
}

await closeConnection();
