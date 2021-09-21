import React, { Component } from "react";
import { connect } from "react-redux";
import RestaurantsList from "./RestaurantsList";
import store from "../js/store";
import Header from "./Header";
import DetailsHeader from "./DetailsHeader";
import RestaurantDetails from "./RestaurantDetails";
import { getRestaurants, getRestaurantDetails } from "../js/actions";
import Context1 from "./Context1";
import EmployeeList from "./EmployeeList";
import EmployeeClass from "./EmployeeClass";
import Circle from './Circle';
import Users from './Users';

import {Route, Router,browserHistory } from 'react-router';

export class App extends Component {
  constructor() {
    super();
    this.state = {
      value: '5',
      selectedCity: 'Pune',
      isDetailsClicked: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.restaurantsDetails = this.restaurantsDetails.bind(this);
  }
  componentDidMount() {
    this.props.getRestaurants(this.props.location);
  }

  handleChange(event) {
    store.dispatch({ type: "CLEAR_DATA"});
    console.log('event.target.value', event.target.options[event.target.options.selectedIndex].innerText);
    this.setState({value: event.target.value,
    selectedCity: event.target.options[event.target.options.selectedIndex].innerText});
    this.props.getRestaurants(event.target.value);
  }

  handleBackButtonClick(event) {
    this.setState ({
      isDetailsClicked: false
    });
  } 

  restaurantsDetails(e){
    this.props.getRestaurantDetails(e.id);
    this.setState ({
      isDetailsClicked: true
    });
  }

  render() {
    if(this.state.isDetailsClicked) {
      console.log(this.props);
      return (
        <div class="container">
          <DetailsHeader {...this.props} handleBackButtonClick={this.handleBackButtonClick}/>
          <RestaurantDetails restaurantDetails={this.props.restaurantDetails} />
        </div>);
    }

    return (
      <div className="container">
        {/* <EmployeeList /> */}
        <EmployeeClass />
        {/* <Header />
        <Context1 />
        <Router history={browserHistory}> 

            <Route path="/" component={App} /> 
            <Route path="/Circle" component={Circle} />
            <Route path="/Users" component={Users} />

        </Router>
        <div className="row rowmargin">
          <div class="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="search"
                placeholder="Search for Restaurant"
              />
          </div>
          <div class="col-sm-4">
              <select className="custom-select" value={this.state.value} onChange={this.handleChange}>
                <option value="1">Delhi</option>
                <option value="3">Mumbai</option>
                <option value="5" selected="selected">Pune</option>
                <option value="7">Chennai</option>
                <option value="2">Kolkatta</option>
              </select>
          </div>
        </div>
        <RestaurantsList 
          selectedCity={this.state.selectedCity}
          restaurantsDetails={this.restaurantsDetails}
          restaurants={this.props.restaurants}
          clickedRestaurant={this.state.clickedRestaurant}/>
      </div> */}
      </div>
      );
  }
}

function mapStateToProps(state) {
  return {
    restaurants: state.restaurants[0],
    restaurantDetails: state.restaurantDetails[0]
  };
}
export default connect(
  mapStateToProps,
  { getRestaurants, getRestaurantDetails },
)(App);

