import { callApiAsPromise, api_base } from "../api";

export function getAllChallenge(){
    const request = callApiAsPromise("GET", api_base +"challenges", null, null)
    return dispatch =>
        request.then(response =>
            dispatch({
                data: response.data.content,
                type: "GET_CHALLENGES"
            })
        );
}

export function getOneChallenge(nameChallenge){
    return {
        type: "GET_ONE",
        data: nameChallenge
    }
}