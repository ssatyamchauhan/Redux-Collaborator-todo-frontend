const projectid = (state=null, action) => {

    console.log(action.payload)
    switch(action.type){
        case 'projectid':
            return action.payload
        default:
            return state
    }
}

export default projectid;