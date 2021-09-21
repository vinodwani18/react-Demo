import React from 'react';

export default class EmployeeClass extends React.Component {
 //const apiURL = "http://dummy.restapiexample.com/api/v1/employees";
  constructor(props){
    super(props);
    this.state = {
      employeeData: []
    }
  }
 componentDidMount() {
   const getEmployeeData = async () => {
    const apiURL = "http://dummy.restapiexample.com/api/v1/employees";
     const response = await fetch(apiURL)
     const json = await response.json();
     console.log(json);
     this.setState({ employeeData : json.data});
   };
   getEmployeeData();
 }

 render(){
   const {employeeData} = this.state;
   return (
    //<div>Employee class</div>
    // {employeeData && employeeData.map((emp, index) =>{
    //   return (<div key={index}> {emp.employee_name}  -  {emp.employee_age}</div>)
    // })
    //}
    
    employeeData.length ?  employeeData.map((emp, index) => {
      return (<div key={index}> {emp.employee_name}  -  {emp.employee_age}</div>)
    }) : <div> data not found</div>
    
   )
 }

  // useEffect(() =>{
  //   const getEmployeeData = async () => {
  //     try {
  //         const response = await fetch(apiURL);
  //         const json = await response.json();
  //         console.log(json);
  //         setEmployeeList(json.data);
  //     } catch (error) {
  //         console.log("error", error);
  //     }
  //  };
  //   getEmployeeData();
    
  // }, []);

  // return (
  //   <div>
  //     <div>Employee List</div>
  //     <table>
  //       <thead>
  //         <tr>
  //           <th>Age</th>
  //         <th>Name</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //     {employeeList && employeeList.map((emp,index) => {
  //       return (
  //         <tr key={index}>
  //           <td>{emp.employee_age}</td>   
  //           <td>{emp.employee_name}</td>
  //         </tr> );    
  //     })}
  //     </tbody>
  //     </table>
  //   </div>
  // );
}