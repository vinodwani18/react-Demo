import React from 'react';
import '../App.css';

export default function Header(props) {
  const {restaurantDetails, handleBackButtonClick} = props;
  if(restaurantDetails && restaurantDetails.name){
    return (
      <div className="header">
        <span className="backbtn" onClick={ handleBackButtonClick } >Back</span>
        <h1>{restaurantDetails.name}</h1>
      </div>
    );
  }
  return null;
  
}

