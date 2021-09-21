const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('user-key', '78ec888b2af6d738adb748c6ded6a089');

export function getRestaurants(city=5) {
  return function(dispatch) {
    return fetch(`https://developers.zomato.com/api/v2.1/search?entity_id=${city}&entity_type=city&count=20`, {
      method: 'GET',
      headers: myHeaders
    })
      .then(response => response.json())
      .then(json => {
        dispatch({ type: "SEARCH_LOADED", payload: json });
      });
  };
}

export function getRestaurantDetails(resId) {
  return function(dispatch) {
    return fetch(`https://developers.zomato.com/api/v2.1/restaurant?res_id=${resId}`, {
      method: 'GET',
      headers: myHeaders
    })
      .then(response => response.json())
      .then(json => {
        dispatch({ type: "DETAILS_LOADED", payload: json });
      });
  };
}