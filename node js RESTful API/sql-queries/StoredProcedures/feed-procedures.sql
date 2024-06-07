# students feed
DELIMITER $$
CREATE PROCEDURE feed_get (sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM Students WHERE email = sEmail AND password = sPassword LIMIT 1);
        SELECT * FROM
        (
            SELECT 'Submission' Caption, students.studentID,firstname,lastname, profilePicture, score, subDate,
            quizzes.QuizID, quizzes.QuizName,COUNT(Quizzes.QuizID) AS 'Total',classdetails.Name AS className,
            NULL as ModuleName, NULL as DueDate 
            FROM QuizSubmissions 
            INNER JOIN quizclassassignments ON quizclassassignments.quizID = quizsubmissions.QuizID 
            INNER JOIN students ON students.StudentID = quizsubmissions.StudentID
            INNER JOIN quizzes ON quizzes.quizID = quizsubmissions.quizID
            INNER JOIN ClassDetails ON ClassDetails.ClassDetailsID = quizclassassignments.ClassDetailsID
            INNER JOIN QuizQuestions ON QuizQuestions.QuizID = quizzes.QuizID
            WHERE ClassDetails.ClassDetailsID IN (SELECT ClassDetailsID FROM Classes WHERE Classes.StudentID = theStudentID)
            AND QuizSubmissions.IsShared = 1 GROUP BY studentID, quizzes.QuizID
            UNION
            SELECT 'Assignment' Caption, NULL as studentID, teachers.firstname, teachers.lastname, NULL as profilePicture, NULL as score, NULL as subDate, 
            quizclassassignments.QuizID, QuizName, NULL as Total, classdetails.Name AS className, ModuleName, DueDate
            FROM quizclassassignments
            INNER JOIN quizzes 
            ON quizclassassignments.QuizID = quizzes.QuizID 
            LEFT JOIN modules 
            ON quizzes.ModuleID = modules.ModuleID 
            INNER JOIN teachers 
            ON quizzes.TeacherID = teachers.TeacherID
            INNER JOIN Classes
            ON quizclassassignments.ClassDetailsID = classes.ClassDetailsID
            INNER JOIN Students
            ON classes.StudentID = students.StudentID
            INNER JOIN classdetails
            ON classdetails.ClassDetailsID = classes.ClassDetailsID
            WHERE students.studentID = theStudentID AND quizclassassignments.QuizID NOT IN (SELECT QuizID FROM QuizSubmissions WHERE StudentID = theStudentID)
        )subquery
        ORDER BY Caption asc, FIELD(Caption, 'Submission', 'Assignment');
END$$
DELIMITER ;