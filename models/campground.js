const mongoose = require ('mongoose');
const Review = require ('./review')
const Schema = mongoose.Schema;


const CampgroundSchema = new Schema ({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//delete campground qyery middlewear when we delet campground there is still reviews in the database we solve this problem here
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    // console.log(doc) this doc shows the campgrounds information that was recently deleted
    if(doc){
        // await Review.remove({ removes and shows in db
            await Review.deleteMany({ //deletes automatically
            _id:  {
                $in: doc.reviews
                //doc has reviews and delet all review where their id in doc that wass just deleted and its review arrays 
            }
        })
    }
})


module.exports = mongoose.model('Campground',CampgroundSchema)