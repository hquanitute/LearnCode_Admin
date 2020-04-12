const initcourse = []
const coursesReducer = (state = initcourse, action) => {
    switch (action.type) {
        case "SET_COURSES":
            state = action.data;
            break;
        case "UPDATE_COURSE":
            state = action.data;
    }
    return state;
}
export default coursesReducer;