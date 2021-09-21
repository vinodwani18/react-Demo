import React, { useState, useEffect } from 'react';
import {ZomatoContextConsumer} from "./ZomatoContext";


export default function Context3() {
 return (
   <ZomatoContextConsumer>
    {ZomatoContext => ZomatoContext && (
        <div>
          Name: {ZomatoContext.name} <br />
        </div>
      )
    }
   </ZomatoContextConsumer>
  );
}