import React from "react";
import {BrowserRouter,Routes,Route,HashRouter} from "react-router-dom"
import SignUp from "./user/Signup"
import SignIn from "./user/Signin";
import CreatorDashboard from "./dashboard/creator_dashboard";
import LearnerDashboard from "./dashboard/learner_dashboard";
import LearnerRoute from "./auth/helper/LearnerRoutes";
import CreatorRoute from "./auth/helper/CreatorRoutes";
import CreateCourse from "./creator/CreateCourse";
import CourseHome from "./creator/CourseHome";
import CreateExam from "./creator/CreateExam"
import Exam from "./Exam/Exam";
import InitiateExam from "./Exam/InitiateExam";
import ContentHome from "./courseContent/ContentHome";
import AddnewContent from "./courseContent/AddNewContent";
import SampleShow from "./courseContent/sample";
import EditContent from "./courseContent/EditCourseContent";
import AddEditQuestions from "./Exam/AddEditQuestions";
import ExamCompletion from "./Exam/ExamCompletion";
import CreatorProfile from "./creator/profile";
import LearnerProfile from "./learner/profile";
import MultipleAttemptError from "./Exam/MultipleAttemptError"

export default function Routers(){
    return(
        <HashRouter>
            <Routes>
                <Route exact path = "/signup" element={<SignUp/>}/>
                <Route exact path = "/" element={<SignIn/>}/>
                <Route path = "/sample/:contentId" element={<SampleShow/>}/>
                <Route
                    path="/dashboard/creator"
                    element={
                        <CreatorRoute>
                        <CreatorDashboard />
                        </CreatorRoute>
                      }
                />
                <Route
                    path="/create/course"
                    element={
                        <CreatorRoute>
                        <CreateCourse />
                        </CreatorRoute>
                      }
                />
                <Route
                    path="/questions/:courseId"
                    element={
                        <CreatorRoute>
                        <AddEditQuestions />
                        </CreatorRoute>
                      }
                />
                <Route path = "/course/:courseId" element={<CourseHome/>}/>
                <Route
                    path="/create/exam/:courseId"
                    element={
                        <CreatorRoute>
                        <CreateExam />
                        </CreatorRoute>
                      }
                />
                <Route
                    path="/home/content/:courseId"
                    element={
                        <ContentHome />
                      }
                />
                <Route
                    path="/create/content/:courseId"
                    element={
                        <CreatorRoute>
                        <AddnewContent />
                        </CreatorRoute>
                      }
                />
                <Route
                    path="/edit/:contentId"
                    element={
                        <CreatorRoute>
                        <EditContent />
                        </CreatorRoute>
                      }
                />
                <Route
                    path="/profile/creator"
                    element={
                        <CreatorRoute>
                        <CreatorProfile />
                        </CreatorRoute>
                      }
                />
                <Route
                    path="/dashboard/learner"
                    element={
                        <LearnerRoute>
                        <LearnerDashboard />
                        </LearnerRoute>
                      }
                />
                <Route
                    path="/exam/:courseId"
                    element={
                        <LearnerRoute>
                        <Exam />
                        </LearnerRoute>
                      }
                />
                <Route
                    path="/exam/instructions/:courseId"
                    element={
                        <LearnerRoute>
                        <InitiateExam />
                        </LearnerRoute>
                      }
                />
                <Route
                    path="/result/:courseId/:usedId"
                    element={
                        <LearnerRoute>
                        <ExamCompletion />
                        </LearnerRoute>
                      }
                />
                <Route
                    path="/profile/learner"
                    element={
                        <LearnerRoute>
                        <LearnerProfile />
                        </LearnerRoute>
                      }
                />
                <Route
                    path="/exam/error/multiattempt"
                    element={
                        <LearnerRoute>
                        <MultipleAttemptError />
                        </LearnerRoute>
                      }
                />

            </Routes>
                
        </HashRouter>
    )
}