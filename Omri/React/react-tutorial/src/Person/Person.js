 import React from 'react';

import './Person.css';

 const person = (props) => {
     return (
     <div className="Person">
         <p onClick={props["click"]}>I`m {props["name"]} im {props["age"]} years old {props.children}</p>
         <input type="text" onChange={props.changed} value={props.name}/>
     </div>
    );

 }

 export default person;