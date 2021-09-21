const initialState = {
  restaurants: [],
  restaurantDetails:[]
};
function rootReducer(state = initialState, action) {
  if (action.type === "CLEAR_DATA") {
    return state = initialState;
  }
  if (action.type === "SEARCH_LOADED") {
    return Object.assign({}, state, {
      restaurants: state.restaurants.concat(action.payload)
    });
  }
  
  if (action.type === "DETAILS_LOADED") {
    return Object.assign({}, state, {
      restaurantDetails: state.restaurantDetails.concat(action.payload)
      
    });
  }
  return state;
}
export default rootReducer;
