import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { updateCourseAction, setCourses } from "../../actions/coursesAction";
import { getLessons } from "../../actions/lessonsAction";
import { callApiAsPromise, api_base } from "../../api";
import "./style.css";
import { getAllChallenge } from "../../actions/challengesAction";
function LessonComponent(props) {
    const [listOrderLesson, setListOrderLesson] = useState([]);
    const [courseId, setCourseId] = useState([]);
    const [lessonSelected, setLessonSelected] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [searchText, setSearch] = useState("");
    const [update, forceUpdate] = React.useState(0);

    useEffect(() => {
        props.updateLessons();
        props.updateCourses();
        props.getChallenges();
    }, []);

    useEffect(() => {
        let listLesson = [...props.lessons];
        setListOrderLesson([])

        setCourseId([])
        for (let i = 0; i < props.courses.length; i++) {
            setCourseId(prevArray => [...prevArray, props.courses[i]._id])
            props.courses[i].lessons.forEach((lessonInCourse) => {
                props.lessons.forEach((lesson) => {
                    if (lessonInCourse._id === lesson._id) {
                        setListOrderLesson(prevArray => [...prevArray, { "courseId": props.courses[i]._id, "lesson": lesson }])
                        listLesson = listLesson.filter((x) => {
                            return x._id !== lesson._id
                        })
                    }
                })
            });
        }
        // if(listLesson.length>0){
        //     setCourseId(prevArray => [...prevArray, "rest"])
        // }

        listLesson.forEach((lesson) => {
            setListOrderLesson(prevArray => [...prevArray, { "courseId": "rest", "lesson": lesson }])
        })
    }, [props.courses, props.lessons])

    useEffect(() => {
        if (Object.keys(lessonSelected).length !== 0) {
            setName(lessonSelected.name)
            setPublished(lessonSelected.isPublished == false ? false : true)
            setOrder(lessonSelected.order)
        }
    }, [lessonSelected])

    const addLesson = () => {
        callApiAsPromise("post", api_base+'lessons/', null, JSON.stringify({ "name": "Change Lesson name", "dashName": "sample name", "order": -1, "isPublished": "false" })).then(() => {
            props.updateLessons();
            alert("Add new lesson successfully. Please edit infor for new lesson")
        })
    }
    const deleteLesson = () => {
        callApiAsPromise("delete", api_base+'lessons/' + lessonSelected._id, null, null).then(() => {
            props.updateLessons();
            setLessonSelected({})
            alert("deleted selected course successfully.")
        })
    }
    let delButton;
    const selectLesson = (e, lessonInfo) => {
        setLessonSelected(lessonInfo.lesson)
    }

    const changeName = (e) => {
        setName(e.target.value)
    }
    const [name, setName] = useState("")

    const changePublished = (e) => {
        setPublished(!published)
    }
    const [published, setPublished] = useState(false)

    let publishedButton;
    if (published) {
        publishedButton = <button className="bg-green-500 border border-gray-300 rounded-lg py-2 px-4 my-4 text-white font-bold"
            onClick={changePublished}
            disabled={isEdit ? false : true}>
            {published.toString()}
        </button>
    } else {
        publishedButton = <button className="bg-red-500 border border-gray-300 rounded-lg py-2 px-4 my-4 text-white font-bold"
            onClick={changePublished}
            disabled={isEdit ? false : true}>
            {published.toString()}
        </button>
    }

    const changeOrder = (e) => {
        setOrder(e.target.value)
    }
    const [order, setOrder] = useState(-1)

    const cancleButtonChange = () => {
        console.log(isEdit);
        setName(lessonSelected.name)
        setPublished(lessonSelected.isPublished == false ? false : true)
        setOrder(lessonSelected.order)
        setIsEdit(!isEdit)
    }
    let listLessonComponent = listOrderLesson.map((lessonInfor) => (
        <div className={lessonInfor.lesson._id === lessonSelected._id ? "selectedLesson hover:bg-gray-700 hover:text-white font-bold py-1 px-1 rounded" : "hover:bg-gray-700 hover:text-white font-bold py-1 px-1 rounded"}
            groupLesson={courseId.indexOf(lessonInfor.courseId)}
            onClick={(e) => selectLesson(e, lessonInfor)}>
            <div className="lesson text-left p-2" item={lessonInfor.lesson._id}>
                <b>Lesson :  </b>{lessonInfor.lesson.name} <br />
            </div>
            <hr></hr>
        </div>

    ))
    const changeLessonButton = () => {
        callApiAsPromise("put", api_base+'lessons/' + lessonSelected._id, null, JSON.stringify({ "name": name, "dashName": name, "order": order, "isPublished": published.toString() })).then(() => {
            props.updateLessons();
            setIsEdit(false);
            forceUpdate(x=>!x)
            alert("Edited successfully")
        })
    }

    let editButton = isEdit ?
        (<div className="grid grid-cols-7 gap-2 mx-2 my-2">
            <button className="cols-span-1 col-start-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => cancleButtonChange()}>
                Cancel
            </button>
            <button className="cols-span-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => changeLessonButton()}>
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

    const selectChallenge = (e, challenge) => {
        if (!challenge) {
            console.log("null");
            return
        }
        callApiAsPromise("put", api_base+'lessons/' + lessonSelected._id + '/add', null, JSON.stringify({ "challenge": challenge._id })).then(() => {
            lessonSelected.challenges.push(challenge)
            forceUpdate(x=>!x)
            console.log(lessonSelected.challenges);
        })

    }

    const removeChallenges = (e, challengeId) => {
        if (!challengeId) {
            console.log("null");
            return
        }
        callApiAsPromise("put", api_base+'lessons/' + lessonSelected._id + '/remove', null, JSON.stringify({ "challenge": challengeId })).then(() => {
            lessonSelected.challenges=lessonSelected.challenges.filter((x)=>{
                return x._id !==challengeId
            })
            forceUpdate(x=>!x)
            console.log(lessonSelected.challenges);
            
        })

    }
    if (Object.keys(lessonSelected).length === 0) {
        return (
            <div className="grid grid-cols-10 gap-4">
                <div className="listLesson col-span-3">
                    <div className="flex justify-between my-2">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => addLesson()}>
                            New Lesson
                </button>
                        {
                            lessonSelected.name ? (<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => deleteLesson()}>
                                Delete Lesson
                            </button>) : (delButton)
                        }
                    </div>
                    {/* {
                        listOrderLesson.map((lessonInfor) => (
                            <div className={lessonInfor.lesson._id === lessonSelected._id ? "bg-teal-300 hover:bg-gray-700 hover:text-white font-bold py-1 px-1 rounded" : "bg-white hover:bg-gray-700 hover:text-white font-bold py-1 px-1 rounded"}
                                groupLesson={courseId.indexOf(lessonInfor.courseId)}
                                onClick={(e) => selectLesson(e, lessonInfor)}>
                                <div className="lesson text-left p-2" item={lessonInfor.lesson._id}>
                                    <b>Lesson :  </b>{lessonInfor.lesson.name} <br />
                                </div>
                                <hr></hr>
                            </div>

                        ))
                    } */}
                    {
                        listLessonComponent
                    }
                </div>
                <div className="col-span-7">Choose a lesson</div>
            </div>
        )
    }    
    return (
        <div className="grid grid-cols-10 gap-4">

            <div className="listLesson col-span-3">
                <div className="flex justify-between my-2">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => addLesson()}>
                        New Lesson
                </button>
                    {
                        lessonSelected.name ? (<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => deleteLesson()}>
                            Delete Lesson
                        </button>) : (delButton)
                    }
                </div>
                {
                    listLessonComponent
                }
            </div>
            <div className="lessonInfor col-span-7">
                <div className="text-left p-4 border-solid border-4 border-gray-600 mx-2 my-2 px-2 py-2">
                    <b>Lesson name:</b>
                    <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4  w-full appearance-none leading-normal"
                        value={name}
                        readOnly={isEdit ? false : true}
                        onChange={changeName}
                    />
                    <br />
                    <b>Is published:</b> {publishedButton}
                    <br />
                    <b>Order:</b>
                    <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 mx-2"
                        value={order}
                        onChange={changeOrder}
                        readOnly={isEdit ? false : true}
                        type="number" />
                    <br /><br />
                    {editButton}
                </div>

                <div className="">
                    Add challenge to this lesson
                    <br />
                    <input placeholder="input search text" value={searchText} onChange={(e) => setSearch(e.target.value)} />
                    <br />
                    <b>Challenges: </b>

                    <div className="flex">
                        <div className="flex-1">
                            <b>Current challenges</b>
                            {
                                lessonSelected.challenges.map(x => (
                                    <div className="text-left p-2 hover:bg-red-500 hover:text-white" key={x._id} onClick={(e) => removeChallenges(e, x._id)}>
                                        {x.title}
                                    </div>
                                )
                                )
                            }
                        </div>
                        <div className="flex-1">
                            <b>Available challenges</b>
                            <div className="overflow-auto p-2 customHeight ">
                                {
                                    props.challenges.map((challenge => {
                                        let flag = false;
                                        if (!challenge.title.includes(searchText)) {
                                            return
                                        }
                                        if (lessonSelected.challenges.length > 0) {
                                            for (let i = 0; i < lessonSelected.challenges.length; i++) {
                                                if (challenge._id == lessonSelected.challenges[i]._id) {

                                                    flag = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (flag) {
                                            return
                                        } else {
                                            return (
                                                <div key={challenge._id}  >
                                                    <div className="text-left p-2 hover:bg-green-500 hover:text-white" item={challenge._id} onClick={(e) => selectChallenge(e, challenge)}>
                                                        {challenge.title} <br />
                                                    </div>
                                                    <hr />
                                                </div>
                                            )
                                        }
                                    }
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        courses: state.courses,
        lessons: state.lessons,
        challenges: state.challenges
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateCourses: () => {
            dispatch(updateCourseAction());
        },
        updateLessons: () => {
            dispatch(getLessons());
        },
        setCourses: (data) => {
            dispatch(setCourses(data));
        },
        getChallenges: () => {
            dispatch(getAllChallenge());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LessonComponent);
