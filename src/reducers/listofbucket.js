



const listofbucket = (state = [], action) =>{

    switch(action.type){
        case 'listofbucket':
            return action.payload
        default:
            return state;
    }
}

export default listofbucket;