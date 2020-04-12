const initcourse = {}
const courseSelectedReducer = (state = initcourse, action) => {
    switch (action.type) {
        case "SET_COURSE_SELECTED":
            state = action.data;
            break;
        case "UPDATE_COURSE_SELECTED":
            state = action.data;
            break;
        case "RESET_COURSE_SELECTED":
            state = initcourse;
            break;
            
    }
    return state;
}
export default courseSelectedReducer;