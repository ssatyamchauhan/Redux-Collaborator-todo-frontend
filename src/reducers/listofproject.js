



const listofpoject = (state = [], action) =>{

    switch(action.type){
        case 'listofproject':
            return action.payload
        default:
            return state;
    }
}

export default listofpoject;