import React, { Component } from "react";
import '../App.css';
import { browserHistory } from 'react-router';

export default class Header extends Component {
  constructor() {
    super();
    this.gotoCircle = this.gotoCircle.bind(this);
    this.gotoUsers = this.gotoUsers.bind(this);
  }

  gotoCircle() {

    browserHistory.push("/circle");
  }

  gotoUsers() {
    browserHistory.push("/Users");

  }

  render(){
  return (
    <div className="header">
      <h1>Zomato Search</h1>
      <button onClick={this.gotoCircle} >Circle</button>
      <button onClick={this.gotoUsers} >Users</button>
    </div>
  );
  }
}
