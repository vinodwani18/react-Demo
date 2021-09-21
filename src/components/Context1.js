import React from 'react';
import {ZomatoContextProvider} from "./ZomatoContext";
import Context2 from "./Context2";
export default class Context1 extends React.Component {
  state ={
    name: "vinod"
  }
  render(){
  return (
    <ZomatoContextProvider value={this.state}>
      <Context2 />
    </ZomatoContextProvider>
  );
  }
}