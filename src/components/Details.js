import React, { useState, useEffect } from 'react';

export default function Details() {
  const [count, setCount] = useState(0);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;

    fetch('https://randomuser.me/api/')
      .then(results => results.json())
      .then(data => {
        const {name} = data.results[0];
        setDetails(name.first);
      });

  }, []);

  {console.log(details)}
  return (
    <div>
      vinod
      <div data-testid="test" >Name: {!details ? 'Loading...' : `${details}`}</div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}