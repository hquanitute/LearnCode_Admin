import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Search from 'antd/lib/input/Search';
import { getLessons } from '../../actions/lessonsAction';
import { updateCourseSelectedAction, updateCourseAction } from '../../actions/coursesAction';
import { callApiAsPromise } from '../../api';

function CourseInfo(props) {
    const [searchText,setSearch] = useState("");

    const editCourse = () => {
        callApiAsPromise("put", 'http://localhost:5000/api/courses/' + props.courseSelected._id, null, JSON.stringify({ "name": rename, "dashName": rename, "order": order, "isPublished": published.toString() })).then(() => {
            props.updateCourseSelected(props.courseSelected._id)
            props.updateCourse();
            alert("Edited successfully")
        })
    }
    const selectLesson = (e, lesson) => {
        if (!lesson) {
            console.log("null");
            return
        }
        callApiAsPromise("put", 'http://localhost:5000/api/courses/' + props.courseSelected._id + '/add', null, JSON.stringify({ "lesson": lesson._id })).then(() => {
            props.updateCourseSelected(props.courseSelected._id)
        })

    }

    const removeLesson = (e, lessonId) => {
        if (!lessonId) {
            console.log("null");
            return
        }
        callApiAsPromise("put", 'http://localhost:5000/api/courses/' + props.courseSelected._id + '/remove', null, JSON.stringify({ "lesson": lessonId })).then(() => {
            props.updateCourseSelected(props.courseSelected._id)
        })

    }

    const changeName = (e) => {
        setRename(e.target.value)
    }
    const [rename, setRename] = useState("")

    const changePublished = (e) => {
        setPublished(!published)
    }
    const [published, setPublished] = useState(false)

    let publishedButton ;
    if (published) {
        publishedButton=<button className="bg-green-500 border border-gray-300 rounded-lg py-2 px-4 my-4 text-white font-bold" onClick={changePublished}>{published.toString()}</button>
    } else {
        publishedButton=<button className="bg-red-500 border border-gray-300 rounded-lg py-2 px-4 my-4 text-white font-bold" onClick={changePublished}>{published.toString()}</button>
    }

    const changeOrder = (e) => {
        setOrder(e.target.value)
    }
    const [order, setOrder] = useState(-1)
    useEffect(() => {
        props.getLessons();
    }, [])
    useEffect(() => {
        setRename(props.courseSelected.name)
        setPublished(props.courseSelected.isPublished==false?false:true)
        setOrder(props.courseSelected.order)
    }, [props.courseSelected])
    //check course is empty
    if (Object.keys(props.courseSelected).length === 0) {
        return (
            <div>Choose a course</div>
        )
    }
    return (
        <div>
            <div className="text-left p-4 border-solid border-4 border-gray-600 mx-2 my-2 px-2 py-2">
                <b>Course name:</b>
                <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4  w-full appearance-none leading-normal"
                    value={rename}
                    onChange={changeName} />
                <br />
                <b>Is published:</b> {publishedButton}
                <br />
                <b>Order:</b>
                <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 mx-2" value={order} onChange={changeOrder} />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-right" onClick={() => editCourse()}>
                    Change
                    </button>
                <br /><br />
            </div>
            <div className="">
                Add lesson to this course
            <br />
                <input placeholder="input search text" value={searchText} onChange={(e) => setSearch(e.target.value)}/>
                <br />
                <b>Lessons: </b>

                <div className="flex">
                    <div className="flex-1">
                        <b>Current lessons</b>
                        {
                            props.courseSelected.lessons.map(x => (
                                <div className="text-left p-2 hover:bg-red-500 hover:text-white" key={x._id} onClick={(e) => removeLesson(e, x._id)}>
                                    {x.name}
                                </div>
                            )
                            )
                        }
                    </div>
                    <div className="flex-1">
                        <b>Available lessons</b>
                        <div className="overflow-auto p-2 customHeight ">
                            {
                                props.lessons.map((lesson => {
                                    let flag = false;
                                    if(!lesson.name.includes(searchText)){
                                        return
                                    }
                                    if (props.courseSelected.lessons.length > 0) {
                                        for (let i = 0; i < props.courseSelected.lessons.length; i++) {
                                            if (lesson._id == props.courseSelected.lessons[i]._id) {

                                                flag = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (flag) {
                                        return
                                    } else {
                                        return (
                                            <div key={lesson._id}  >
                                                <div className="text-left p-2 hover:bg-green-500 hover:text-white" item={lesson._id} onClick={(e) => selectLesson(e, lesson)}>
                                                    {lesson.name} <br />
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
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        lessons: state.lessons,
        courseSelected: state.courseSelected
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getLessons: () => {
            dispatch(getLessons())
        },
        updateCourseSelected: (courseID) => {
            dispatch(updateCourseSelectedAction(courseID))
        },
        updateCourse: ()=> {
            dispatch(updateCourseAction())
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CourseInfo)