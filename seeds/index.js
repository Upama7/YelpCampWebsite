
const mongoose = require("mongoose");
const  cities  = require('./cities');  //object destructure if we pass a module.exports directly then we dont need to onject destructure it can directly access to properties of cities
const { places, descriptors } = require('./seedHelpers'); //here in this case we are passing module.exports object thus object destructuring is required
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random()*array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() *20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            // image: 'https://img.freepik.com/free-vector/set-object-element-camping-vacation-cartoon-vector_24797-2099.jpg?w=996&t=st=1669547037~exp=1669547637~hmac=91d5c9f9c54a887f6e088752187358e2bca41e437d5b2f1fa13678a98721f85f',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}



seedDB().then(() => {
    mongoose.connection.close();
})