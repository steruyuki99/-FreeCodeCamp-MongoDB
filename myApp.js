require('dotenv').config();
const mongoose = require('mongoose');

// Connection options with writeConcern and useUnifiedTopology
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: {
    w: 'majority',
    wtimeout: 5000
  }
};

// mongoose.connect(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, options)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });


const personScheme = new mongoose.Schema({
    name:{
      type: String,
      required: true
    },
    age: Number,
    favoriteFoods: [String]
});


var Person = mongoose.model('Person', personScheme);

const createAndSavePerson = (done) => {
  var janeFonda = new Person({name: "Jane Fonda", age: 84, favoriteFoods: ["eggs", "fish", "fresh fruit"]}); 

  janeFonda.save(function(err, data){
    if(err){
      return console.error(err);
    } else{
      
      done(null , data);
    }
  })
};

// 4. Create Many Records with model.create()
const arrayOfPeople = [
  { name: 'Adam', age: 24, favoriteFoods: ['indomie noodle'] },
  { name: 'Sola', age: 36, favoriteFoods: ['roasted yam'] },
  { name: 'Colins', age: 48, favoriteFoods: ['Red wine'] },
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if (err) return console.log(err);
    done(null, people);
  });
};


const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (error, results) =>{
    if(error){
      return console.log(error);
    } else {
      done(null, results);
    }
  }) 
};

const findOneByFood = (food, done) => {
  Person.findOne ({favoriteFoods: food}, (error, results) =>{
    if(error){
      return console.log(error);
    } else {
      done(null, results);
    }
  }) 
};

const findPersonById = (personId, done) => {
  // done(null /*, data*/);
  Person.findById({_id: personId}, (error, results) => {
    if(error) {
      return console.log(error);
    } else{
      console.log(results);
      done(null, results);
    }
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, (error, result) => {
    if(error){
      console.log(error)
    }else{
      result.favoriteFoods.push(foodToAdd)
      result.save((error, updatedResult) => {
        if(error){
          console.log(error)
        }else{
          done(null, updatedResult)
        }
      })
    }
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true},  (error, result) =>{
    if(error){
      console.log(error);
    } else{
      done(null, result)
    }
  })
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (error, result) => {
    if(error) {
      console.log(error);
    } else{
      done(null, result);
    }
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.deleteMany({name: nameToRemove}, (error, result) => {
    if(error) {
      console.log(error);
    } else{
      done(null, result)
    }
  })
  // done(null /*, data*/);
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods: foodToSearch}).sort({name: 'asc'}).limit(2).select('-age').exec((error, result) => {
    if(error ){
      console.log(error);
    } else{
      done(null, result);
    }
  })
  // done(null /*, data*/);
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
