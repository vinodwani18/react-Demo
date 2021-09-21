import React, {useState, useEffect} from 'react';
import LendingForm from './LendingForm';
import LendingHistory from './LendingHistory';
import { LENDING_DATA_KEY } from './LendingForm';


function Users() {

  const [lendingData, setLendingData] = useState([]);

  useEffect(() => {
      const list = localStorage.getItem(LENDING_DATA_KEY);
      if(list) {
          setLendingData(JSON.parse(list))
      }
  }, []);

  const handleDelete = (id) => {
    let currentList = [];
    currentList = lendingData.filter((item, index) => index !== id);
    setLendingData(currentList);
    localStorage.setItem(LENDING_DATA_KEY, JSON.stringify(currentList));
  }

  return (
  <div className="App">
     <h2>ReactJS</h2>
     <LendingForm setLendingData={setLendingData}/>
     <LendingHistory lendingData={lendingData} handleDelete={handleDelete} />
    </div>
  );
}

export default Users;