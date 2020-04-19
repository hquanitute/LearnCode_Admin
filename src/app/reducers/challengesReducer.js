const initChallenge = []
const challengesReducer = (state = initChallenge, action) => {
    switch (action.type) {
        case "GET_CHALLENGES":
            state = action.data;
            break;
        case "xyz":
            state = [...state, "hihi"];
            break;
    }
    return state;
}
export default challengesReducer;