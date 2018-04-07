import React from 'react'

const userOutput = (props)=>{
    const style = {
        backgroundColor: 'white',
        font: 'inherit',
        border: '1px solid blue',
        padding: '8px'
    };
return (
    <div>
        <p style={style}>{props.username}</p>
        <p>p2</p>
    </div>
);

};


export default userOutput;