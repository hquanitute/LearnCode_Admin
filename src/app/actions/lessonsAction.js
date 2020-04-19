import { callApiAsPromise } from "../api";

export function getLessons() {
    const request = callApiAsPromise("GET", "http://127.0.0.1:5000/api/lessons", null, null)
    return dispatch =>
        request.then(response =>
            dispatch({
                data: response.data.content,
                type: "GET_LESSONS"
            })
        );
}

export function setLessonSelectedAction(lesson) {
    return {
        type: "SET_LESSON_SELECTED",
        lesson: lesson, 
    }
}
