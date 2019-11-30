const projectid = (state=null, action) => {

    switch(action.type){
        case 'projectid':
            return action.payload
        default:
            return state
    }
}

export default projectid;