import React, { useState, useEffect } from 'react';

export default function EmployeeList() {
  const [employeeList, setEmployeeList] = useState();
   //const apiURL = "https://api.adviceslip.com/advice";
const apiURL = "http://dummy.restapiexample.com/api/v1/employees";
  
  useEffect(() =>{
    const getEmployeeData = async () => {
      try {
          const response = await fetch(apiURL);
          const json = await response.json();
          console.log(json);
          setEmployeeList(json.data);
      } catch (error) {
          console.log("error", error);
      }
   };
    getEmployeeData();
    
  }, []);

  return (
    <div>
      <div>Employee List</div>
      <table>
        <thead>
          <tr>
            <th>Age</th>
          <th>Name</th>
          </tr>
        </thead>
        <tbody>
      {employeeList && employeeList.map((emp,index) => {
        return (
          <tr key={index}>
            <td>{emp.employee_age}</td>   
            <td>{emp.employee_name}</td>
          </tr> );    
      })}
      </tbody>
      </table>
    </div>
  );
}