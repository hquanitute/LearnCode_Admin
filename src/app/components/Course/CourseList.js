import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setCourseSelectedAction, updateCourseSelectedAction, setCourses, updateCourseAction, resetCourseSelectedAction } from '../../actions/coursesAction'
import { callApiAsPromise, api_base } from '../../api';

function CourseList(props) {
    const [itemSeleected, setItemSelected] = useState("")
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        callApiAsPromise("GET", api_base+"courses?sort=order", null, null).then((val, err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(val.data.content)
                props.setCoursesRedux(val.data.content)
                setCourses(val.data.content)
            }
        })
    }, [])

    useEffect(() => {
        callApiAsPromise("GET", api_base+"courses?sort=order", null, null).then((val, err) => {
            if (err) {
                console.log(err);
            } else {
                setCourses(val.data.content)
            }
        })
    }, [props.courses])
    const changeBackground = (e) => {
        setItemSelected(e.target.getAttribute('item'))
    }
    const resetBackground = () => {
        setItemSelected("")
    }
    const selectCourse = (e,course) => {
        props.setCourseSelected(course)
        props.updateCourseSelected(course._id)
    }
    const addCourse = () => {
        callApiAsPromise("post", api_base+'courses/', null, JSON.stringify({ "name": "Change Course name", "dashName": "sample name", "order": 0, "isPublished": "false" })).then(() => {
            props.updateCourse();
            alert("Add new course successfully. Please edit infor for new course")
        })
    }
    const deleteCourse = () => {
        callApiAsPromise("delete", api_base+'courses/' + props.courseSelected._id, null, null).then(() => {
            props.updateCourse();
            props.resetCourseSelected();
            alert("deleted selected course successfully.")
        })
    }
    let delButton;
    return (
        <div className="overflow-auto h-screen p-2">
            <div className="flex justify-between my-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => addCourse()}>
                    New Course
            </button>
                {
                    props.courseSelected.name?(<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => deleteCourse()}>
                    Delete Course
            </button>):(delButton)
                }
            </div>
            {
                courses.map((course =>
                    (
                        <div key={course.name} className={course._id === itemSeleected ? "bg-teal-300" : "bg-white"}
                            onMouseLeave={resetBackground}
                            onMouseEnter={changeBackground}
                            onClick={(e) => selectCourse(e,course)}>
                            <div className="text-left p-2" item={course._id}>
                                <b>Course name:  </b> {course.name} <br />
                                <b>Order:        </b> {course.order} <br />
                                <b>Is published: </b> {course.isPublished.toString()} <br />
                                <b>Lessons:      </b> {course.lessons.name} <br />
                            </div>
                            <hr />
                        </div>
                    )
                ))
            }
        </div>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        courseSelected: state.courseSelected,
        courses: state.courses,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setCourseSelected: (course) => {
            dispatch(setCourseSelectedAction(course))
        },
        updateCourseSelected: (courseID) => {
            dispatch(updateCourseSelectedAction(courseID))
        },
        setCoursesRedux: (data) => {
            dispatch(setCourses(data))
        },
        updateCourse: () => {
            dispatch(updateCourseAction())
        },
        resetCourseSelected: () => {
            dispatch(resetCourseSelectedAction())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseList)