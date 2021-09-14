var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");
var {data} = require('./restaurants')
// Construct a schema, using GraphQL schema language
var restaurants = data.restaurants
console.log(restaurants)
console.log(data)
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) => {
    // Your code goes here
   return restaurants[arg.id]
  },
  restaurants: () => {
    // Your code goes here
   return restaurants
  },
  setrestaurant: ({ input }) => {
    // Your code goes here
    new_restaurant = {...input}
    restaurants.push(new_restaurant)
    return new_restaurant
  },
  deleterestaurant: ({ id }) => {
    // Your code goes here
    let ok = false
    _restaurant = restaurants.filter(rest => rest.id === id)
    if(_restaurant.length > 0){
        restaurants = restaurants.filter(rest => rest.id !== id)    
        ok = true
    }
    return {ok}
  },
  editrestaurant: ({ id, ...restaurant }) => {
    // Your code goes here
    if(!restaurants[id]) {
        throw new Error("Restaurant doesn't exist")
      }
      restaurants[id] = {
      ...restaurants[id],...restaurant
      }
      return restaurants[id]
    }
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));
