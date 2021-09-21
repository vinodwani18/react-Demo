import React, { Component } from "react";
import { connect } from "react-redux";
import logo from '../restaurant.PNG';
import { getData, getCategories, getRestaurants } from "../js/actions";
class RestaurantsList extends Component {
  constructor(props) {
    super(props);
    this.restaurantClicked = this.restaurantClicked.bind(this);
  }

  restaurantClicked(el){
    this.props.restaurantsDetails(el.restaurant);
 }
    
  render() {
    let restaurants, totalResult;
    const {restaurantsDetails, selectedCity} = this.props;
    if (this.props.restaurants){
      totalResult = this.props.restaurants.results_found;
      restaurants = this.props.restaurants.restaurants;
    }

    if (restaurants){
      return (
        <div>
          <div>
            {totalResult} found in {selectedCity}
          </div>
          <div className="row">
          {restaurants.map(el => (
              <div className="col-md-4" key={el.id} onClick={() => {
                this.restaurantClicked(el);
              }} >
              <div className="card">
                <div className="card-body">
                  <div className="container"  >
                      <span className="closebtn">{el.restaurant.user_rating.aggregate_rating}</span>
                      <img className="img-thumbnail" src={logo}  alt="logo" />
                      <h6>{el.restaurant.name}</h6>
                      <div className="text-secondary"><h6>{el.restaurant.location.locality_verbose},
                      <br/>{el.restaurant.cuisines}</h6></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }
}
export default RestaurantsList;
