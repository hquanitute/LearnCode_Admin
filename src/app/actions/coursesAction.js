import { callApiAsPromise } from "../api";

export function setCourses(courses){
    return {
        type: "SET_COURSES",
        data: courses
    }
}

export function setCourseSelectedAction(course){
    return {
        type: "SET_COURSE_SELECTED",
        data: course
    }
}

export function updateCourseSelectedAction(courseID){
    const request = callApiAsPromise("GET", "http://127.0.0.1:5000/api/courses/" +courseID, null, null)
    return dispatch =>
        request.then(response =>
            dispatch({
                data: response.data.content,
                type: "UPDATE_COURSE_SELECTED"
            })
        );
}

export function resetCourseSelectedAction(){
    return {
        type: "RESET_COURSE_SELECTED",
    }
}

export function updateCourseAction(){
    const request = callApiAsPromise("GET", "http://127.0.0.1:5000/api/courses/", null, null)
    return dispatch =>
        request.then(response =>
            dispatch({
                data: response.data.content,
                type: "UPDATE_COURSE"
            })
        );
}