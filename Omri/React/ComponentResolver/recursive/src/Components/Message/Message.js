import React,{Fragment} from 'react';

import {graphql,Query} from 'react-apollo';

import gql from 'graphql-tag';

import deserializeHOC from '../../HOC/deserializeHOC';

import {registerComponent} from '../ComponentMapper/ComponentMapper'

const GET_COMP = gql`
  query component($id: String!) {
    component(_id: $id) {
      _id
      children{
          _id
          type
      }
      name
      type
      data
      props
    }
  }
`;


const message = (props)=>{
    console.log(props.query.props.message)
    return (
    <Fragment>
    <ol>
        <li>Message:  {props.query.props.message}</li>
        <li>{props.children}</li>
    </ol>
    </Fragment>
)}

const Message = (root)=>deserializeHOC(message,GET_COMP,root);
export default Message;
registerComponent("message",Message)