import { callApiAsPromise, api_base } from "../api";

const initlesson = {}
const lessonSelectedReducer = (state = initlesson, action) => {
    switch (action.type) {
        case "SET_LESSON_SELECTED":
            state =action.lesson;
            break;
    }
    return state;
}
export default lessonSelectedReducer;