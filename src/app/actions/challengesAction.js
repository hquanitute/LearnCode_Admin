export function getAllChallenge(){
    return {
        type: "GET_ALL"
    }
}

export function getOneChallenge(nameChallenge){
    return {
        type: "GET_ONE",
        data: nameChallenge
    }
}