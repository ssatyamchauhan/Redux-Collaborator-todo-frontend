const listoftodo = (state=[], action) =>{

    switch(action.type){
        case 'listoftodo':
            return action.payload
        default:
            return state; 
        }
}

export default listoftodo;