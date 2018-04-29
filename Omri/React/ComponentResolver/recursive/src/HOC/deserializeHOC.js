import React, {Component, createElement} from 'react';

import {graphql,Query} from 'react-apollo';

import gql from 'graphql-tag';

import ComponentMapper from '../Components/ComponentMapper/ComponentMapper';

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


const compMapper =  (components)=>{return components.map((comp)=>{
    const RetComp = ComponentMapper[comp.type]({id:comp._id});
    return (<RetComp key = {comp._id}/>);   
    });
};




const deserializeHOC = (WrappedComponent,query,variables)=> {
     return class Deserialize extends Component{
         

         resolveComp(WrappedComponent,children){
             return (<WrappedComponent/>)}
             render() {
                return (<Query query={query} variables={variables}>
                        {({ loading, error, data }) => {
                            if (loading) return (<p>Loading...</p>);
                            if (error) return `Error!: ${error}`;
                            console.log(data)
                            const children =  compMapper(data.component.children);
                            
                            return (
                                <WrappedComponent {...this.props} query={data.component} children={children}/>
                            );
                            }}
        
                        </Query>);
        }
    }
}


export default deserializeHOC;