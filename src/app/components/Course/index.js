import React, { useEffect } from 'react';
import { useState } from 'react';
import { callApiAsPromise } from '../../api';
import CourseList from './CourseList';
import CourseInfo from './CourseInfo';

function CourseComponent(props) {
        return (
        <div className="flex">
            <CourseList className="flex-1"/>
            <div className="flex-1">
                <div className="">
                    <CourseInfo />
                </div>
            </div>
        </div>
    );
}

export default CourseComponent