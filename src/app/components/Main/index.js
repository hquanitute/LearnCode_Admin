import React from 'react';
import { Link, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Row, Col } from 'antd';
import { Input } from 'antd';
import CourseComponent from '../Course';
import LessonComponent from '../Lesson';
import ChallengeComponent from '../Challenge';

const { Search } = Input;
function Main(props) {
    return (
        <div>
            <Router>
                <div className="h-screen">
                    <Row className="p-0 font-bold bg-blue-700 flex justify-end">
                        <div className="flex justify-between">
                            <Link to="/courses" className="px-4 py-2 m-2">Courses</Link>
                            <Link to="/lessons" className="px-4 py-2 m-2">Lessons</Link>
                            <Link to="/challenges" className="px-4 py-2 m-2">Challenges</Link>
                        </div>
                    </Row>
                    <Switch>
                        <Route exat path="/courses">
                            <CourseComponent />
                        </Route>
                        <Route path="/lessons">
                            <LessonComponent />
                        </Route>
                        <Route path="/challenges">
                            <ChallengeComponent />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

function Home() {
    return <h2>Home</h2>;
}

export default Main;