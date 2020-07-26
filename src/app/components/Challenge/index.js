import React, { useState, useEffect } from 'react';
import { getAllChallenge } from '../../actions/challengesAction';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import './style.css';
import { callApiAsPromise, api_base } from '../../api';

const ReactMarkdown = require('react-markdown')

function ChallengeComponent(props) {

    const [challengeSelected, setChallengeSelected] = useState({});
    const [searchText, setSearch] = useState("");
    const [isEdit, setIsEdit] = useState(false);

    const [title, setTitle] = useState("")
    const [challengeOrder, setChallengeOrder] = useState(-1)
    const [challengeType, setChallengeType] = useState(-1)
    const [time, setTime] = useState(-1)
    const [forumTopicId, setForumTopicId] = useState(-1)
    const [isPublished, setIsPublished] = useState(false)
    const [isRequired, setIsRequired] = useState(true)

    const [afterTest, setAfterTest] = useState("")
    const [beforeTest, setBeforeTest] = useState("")
    const [description, setDescription] = useState("")
    const [instructions, setInstructions] = useState("")
    const [tests, setTests] = useState("")
    const [content, setContent] = useState("")
    const [solutions, setSolution] = useState("")
    const [runResult, setRunResult] = useState("")

    useEffect(() => {
        props.getChallenges();
    }, [])

    useEffect(() => {
        setTitle(challengeSelected.title)
        setChallengeOrder(challengeSelected.challengeOrder)
        setChallengeType(challengeSelected.challengeType)
        setTime(challengeSelected.time)
        setForumTopicId(challengeSelected.forumTopicId)
        setIsPublished(challengeSelected.isPublished)
        setIsRequired(challengeSelected.isRequired)

        setAfterTest(challengeSelected.afterTest)
        setBeforeTest(challengeSelected.beforeTest)
        setDescription(challengeSelected.description)
        setInstructions(challengeSelected.instructions)
        setTests(challengeSelected.tests)
        setContent(challengeSelected.contents)
        setSolution(challengeSelected.solutions)
        setRunResult(challengeSelected.runResult)
    }, [challengeSelected])
    const addChallenge = () => {
        callApiAsPromise("post", api_base + 'challenges/', null, JSON.stringify({ "title": "Change challenge name", "challengeOrder": -1, "isPublished": "false", "isRequired": "true" })).then(() => {
            props.getChallenges();
            alert("Add new challenge successfully. Please edit infor for new challenge")
        })
    }
    const deleteChallenge = () => {
        callApiAsPromise("delete", api_base + 'challenges/' + challengeSelected._id, null, null).then(() => {
            props.getChallenges();
            setChallengeSelected({})
            alert("deleted selected challenge successfully.")
        })
    }
    let delButton;
    let listChallengeComponent = props.challenges.map((challenge) => {
        if (!challenge.title.includes(searchText)) {
            return
        }
        return (
            <div className={challenge._id === challengeSelected._id ? "selectedChallenge hover:bg-gray-700 hover:text-white font-bold py-1 px-1 rounded" : "hover:bg-gray-700 hover:text-white font-bold py-1 px-1 rounded"}
                onClick={(e) => setChallengeSelected(challenge)}
                key={challenge._id}>
                <div className="challenge text-left p-2" item={challenge._id}>
                    <b>Challenge :  </b>{challenge.title} <br />
                </div>
                <hr></hr>
            </div>

        )
    })
    const cancleButtonChange = () => {
        setTitle(challengeSelected.title)
        setChallengeOrder(challengeSelected.challengeOrder)
        setChallengeType(challengeSelected.challengeType)
        setTime(challengeSelected.time)
        setForumTopicId(challengeSelected.forumTopicId)
        setIsPublished(challengeSelected.isPublished)
        setIsRequired(challengeSelected.isRequired)

        setAfterTest(challengeSelected.afterTest)
        setBeforeTest(challengeSelected.beforeTest)
        setDescription(challengeSelected.description)
        setInstructions(challengeSelected.instructions)
        setTests(challengeSelected.tests)
        setContent(challengeSelected.contents)
        setSolution(challengeSelected.solutions)
        setRunResult(challengeSelected.runResult)

        setIsEdit(!isEdit)
    }

    const changeChallengeButton = () => {

        callApiAsPromise("put", api_base + 'challenges/' + challengeSelected._id, null,
            JSON.stringify(
                {
                    "title": title,
                    "challengeOrder": challengeOrder,
                    "challengeType": challengeType,
                    "time": time,
                    "forumTopicId": forumTopicId,
                    "isRequired": isRequired.toString(),
                    "isPublished": isPublished.toString(),
                    "afterTest": afterTest,
                    "beforeTest": beforeTest,
                    "description": description,
                    "instructions": instructions,
                    "tests": tests,
                    "contents": content,
                    "solutions": solutions,
                    "runResult": runResult
                })).then((response) => {
                    props.getChallenges();
                    setIsEdit(false);
                    console.log(response.data.challenge);

                    // forceUpdate(x=>!x)
                    setChallengeSelected(response.data.challenge)
                    alert("Edited successfully")
                })
    }

    const generateRunResult = () => {
        let language = "";
        if(challengeType >-1 && challengeType <100){
            language = "NodejsTest"
        } else if (challengeType >=100 && challengeType <200){
            language = "JavaTest"
        } else if (challengeType >=200 && challengeType <300){
            language = "Python2"
        }
        callApiAsPromise("post", process.env.REACT_APP_COMPILE_SERVER2 + "code", null, JSON.stringify({
            "codeSubmit": {
                "code": language === 'NodejsTest' ? tests+" "+ solutions : language === 'Python2' ? tests : solutions //java is last one
            },
            "language": language,
            "test": {
                "code": tests
            }
        })).then((response) => {
            console.log(response.data);
            if(response.data.errorMessage.errorComplieMessage){
                alert("response.data.errorMessage.errorComplieMessage")
                setRunResult(response.data.successMessage.successComplieMessage);                
                return
            } else {
                setRunResult(response.data.successMessage.successComplieMessage);
            }
            // forceUpdate(x=>!x)
            
        })
    }
    let editButton = isEdit ?
        (<div className="grid grid-cols-7 gap-2 mx-2 my-2">
            <button className="cols-span-1 col-start-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => cancleButtonChange()}>
                Cancel
        </button>
            <button className="cols-span-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => changeChallengeButton()}>
                Change
        </button>
        </div>)
        :
        (<div className="grid grid-cols-7 gap-2 mx-2 my-2">
            <button className="cols-span-1 col-start-7 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsEdit(!isEdit)}>
                Edit
        </button>
        </div>)

    let publishedButton;
    if (isPublished) {
        publishedButton = <button className="col-span-1 bg-green-500 border border-gray-300 rounded-lg py-2 px-4 my-4 text-white font-bold"
            onClick={(e) => setIsPublished(!isPublished)}
            disabled={isEdit ? false : true}>
            True
        </button>
    } else {
        publishedButton = <button className="col-span-1 bg-red-500 border border-gray-300 rounded-lg py-2 px-4 my-4 text-white font-bold"
            onClick={(e) => setIsPublished(!isPublished)}
            disabled={isEdit ? false : true}>
            False
        </button>
    }
    let requiredButton
    if (isRequired) {
        requiredButton = <button className="col-span-1 bg-green-500 border border-gray-300 rounded-lg py-2 px-4 my-4 text-white font-bold"
            onClick={(e) => setIsRequired(!isRequired)}
            disabled={isEdit ? false : true}>
            True
        </button>
    } else {
        requiredButton = <button className="col-span-1 bg-red-500 border border-gray-300 rounded-lg py-2 px-4 my-4 text-white font-bold"
            onClick={(e) => setIsRequired(!isRequired)}
            disabled={isEdit ? false : true}>
            False
        </button>
    }
    let challengeInfor = (
        <div className="lessonInfor col-span-7">
            <div className="text-left p-4 border-solid border-4 border-gray-600 mx-2 my-2 px-2 py-2">
                {editButton}
                <div className="mx-2 my-2 grid grid-cols-10">
                    <b className="col-span-2">Challenge name:</b>
                    <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 w-full col-span-8 "
                        value={title}
                        readOnly={isEdit ? false : true}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mx-2 my-2 grid grid-cols-10">
                    <b className="col-span-2">Challenge Order:</b>
                    <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4"
                        value={challengeOrder}
                        onChange={(e) => setChallengeOrder(e.target.value)}
                        readOnly={isEdit ? false : true}
                        type="number" />
                </div>
                <div className="mx-2 my-2 grid grid-cols-10">
                    <b className="col-span-2">Challenge Type:</b>
                    <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4"
                        value={challengeType}
                        onChange={(e) => setChallengeType(e.target.value)}
                        readOnly={isEdit ? false : true}
                        type="number" />
                </div>
                <div className="mx-2 my-2 grid grid-cols-10">
                    <b className="col-span-2">Time:</b>
                    <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        readOnly={isEdit ? false : true}
                        type="number" />
                </div>
                <div className="mx-2 my-2 grid grid-cols-10">
                    <b className="col-span-2">Forum topic ID:</b>
                    <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4"
                        value={forumTopicId}
                        onChange={(e) => setForumTopicId(e.target.value)}
                        readOnly={isEdit ? false : true}/>
                </div>
                <br />
                <div className="mx-2 my-2 grid grid-cols-10">
                    <b className="col-span-2">Is published:</b> {publishedButton}
                    <b className="col-span-2 col-start-5">Is required:</b> {requiredButton}
                </div>

                {/* {editButton} */}

                <hr></hr>
                <div className="beforeTest grid grid-cols-6">
                    <b className="col-span-6">BeforeTest</b>
                    <div className="markdown-block col-span-3">
                        <TextareaAutosize readOnly={isEdit ? false : true}
                            className="w-full p-4"
                            value={beforeTest}
                            onChange={(e) => setBeforeTest(e.target.value)} />
                    </div>
                    <div className="previous col-span-3">
                        <ReactMarkdown source={beforeTest} escapeHtml={false} />
                    </div>
                </div>
                <hr></hr>
                <div className="afterTest grid grid-cols-6">
                    <b className="col-span-6">AfterTest</b>
                    <div className="markdown-block col-span-3">
                        <TextareaAutosize readOnly={isEdit ? false : true}
                            className="w-full p-4"
                            value={afterTest}
                            onChange={(e) => setAfterTest(e.target.value)} />
                    </div>
                    <div className="previous col-span-3">
                        <ReactMarkdown source={afterTest} escapeHtml={false} />
                    </div>
                </div>
                <hr></hr>
                <div className="description grid grid-cols-6">
                    <b className="col-span-6">Description</b>
                    <div className="markdown-block col-span-3">
                        <TextareaAutosize readOnly={isEdit ? false : true}
                            className="w-full p-4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="previous col-span-3">
                        <ReactMarkdown source={description} escapeHtml={false} />
                    </div>
                </div>
                <hr></hr>
                <div className="instructions grid grid-cols-6">
                    <b className="col-span-6">Instructions</b>
                    <div className="markdown-block col-span-3">
                        <TextareaAutosize readOnly={isEdit ? false : true}
                            className="w-full p-4"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)} />
                    </div>
                    <div className="previous col-span-3">
                        <ReactMarkdown source={instructions} escapeHtml={false} />
                    </div>
                </div>
                <hr></hr>
                <div className="tests grid grid-cols-6">
                    <b className="col-span-6">Tests</b>
                    <div className="markdown-block col-span-3">
                        <TextareaAutosize readOnly={isEdit ? false : true}
                            className="w-full p-4"
                            value={tests}
                            onChange={(e) => setTests(e.target.value)} />
                    </div>
                    <div className="previous col-span-3">
                        <ReactMarkdown source={tests} escapeHtml={false} />
                    </div>
                </div>
                <hr></hr>
                <div className="content grid grid-cols-6">
                    <b className="col-span-6">Content</b>
                    <div className="markdown-block col-span-3">
                        <TextareaAutosize readOnly={isEdit ? false : true}
                            className="w-full p-4"
                            value={content}
                            onChange={(e) => setContent(e.target.value)} />
                    </div>
                    <div className="previous col-span-3">
                        <ReactMarkdown source={content} escapeHtml={false} />
                    </div>
                </div>
                <hr></hr>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={() => generateRunResult()}
                    disabled ={isEdit ? false : true}>
                        Generate Result Console
                </button>
                <div className="reunResult grid grid-cols-6">
                    <b className="col-span-6">Run Result</b>
                    <div className="markdown-block col-span-3">
                        <TextareaAutosize readOnly={isEdit ? false : true}
                            className="w-full p-4"
                            value={runResult}
                            onChange={(e) => setRunResult(e.target.value)} />
                    </div>
                    <div className="previous col-span-3">
                        <ReactMarkdown source={runResult} escapeHtml={false} />
                    </div>
                </div>
                <hr></hr>
                <div className="solutions grid grid-cols-6">
                    <b className="col-span-6">Solutions</b>
                    <div className="markdown-block col-span-3">
                        <TextareaAutosize readOnly={isEdit ? false : true}
                            className="w-full p-4"
                            value={solutions}
                            onChange={(e) => setSolution(e.target.value)} />
                    </div>
                    <div className="previous col-span-3">
                        <ReactMarkdown source={solutions} escapeHtml={false} />
                    </div>
                </div>
            </div>
        </div>
    )
    if (Object.keys(challengeSelected).length === 0) {
        return (
            <div className="grid grid-cols-10 gap-4">
                <div className="listLesson col-span-3">
                    <div className="flex justify-between my-2">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => addChallenge()}>
                            New Challenge
                </button>
                        {/* {
                            challengeSelected.title ? (<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => deleteChallenge()}>
                                Delete Challenge
                            </button>) : (delButton)
                        } */}
                    </div>
                    <div className="">
                        <input className="h-10 w-full block text-gray-700 border-red-800 text-lg font-bold mx-2 my-2 p-2 rounded"
                            placeholder="Input search text" value={searchText} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    {
                        listChallengeComponent
                    }
                </div>
                <div className="col-span-7">Choose a Challenge</div>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-10 gap-4">

            <div className="listLesson col-span-3">
                <div className="flex justify-between my-2">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => addChallenge()}>
                        New Challenge
                </button>
                    {
                        challengeSelected.title ? (<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => deleteChallenge()}>
                            Delete Challenge
                        </button>) : (delButton)
                    }
                </div>
                <div className="">
                    <input className="h-10 w-full block text-gray-700 border-red-800 text-lg font-bold mx-2 my-2 p-2 rounded"
                        placeholder="Input search text" value={searchText} onChange={(e) => setSearch(e.target.value)} />
                </div>
                {
                    listChallengeComponent
                }
            </div>
            {
                challengeInfor
            }
        </div>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        challenges: state.challenges
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getChallenges: () => {
            dispatch(getAllChallenge());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeComponent);