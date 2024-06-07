# add quiz submission
DELIMITER $$
CREATE PROCEDURE quiz_submission_add (qID int, qScore int,nXp int, nLevel int, nCoins int, sEmail varchar(255), sPassword varchar(60))
BEGIN
    #DECLARE TotalXp int;
    DECLARE TotalCoins int;
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
        IF EXISTS (SELECT * FROM QuizSubmissions WHERE StudentID = theStudentID AND QuizID = qID) THEN
        ROLLBACK;
    ELSE
        #insert submission
        INSERT INTO QuizSubmissions(StudentID,QuizID,Score)
        VALUES (theStudentID, qID, qScore);
    END IF;
    #get xp
    #SET TotalXp = (SELECT Xp FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #get coins
    SET TotalCoins = (SELECT Coins FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #add to total
    UPDATE Students
    SET Xp = nXp, Coins = TotalCoins + nCoins, level = nLevel
    WHERE StudentID = theStudentID;
END$$
DELIMITER ;



# get quiz submission
DELIMITER $$
CREATE PROCEDURE quiz_submission_get_by_assignment (qID int,cID int, tEmail varchar(255), tPassword varchar(60))
BEGIN
    #get student id
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    IF EXISTS (SELECT * FROM ClassDetails WHERE TeacherID = theTeacherID AND ClassDetailsID = cID) THEN
        SELECT * FROM
        (
            SELECT 'Completed' Caption, students.studentID,email,firstname,lastname, score, subDate, rating FROM QuizSubmissions 
            INNER JOIN quizclassassignments ON quizclassassignments.quizID = quizsubmissions.QuizID 
            INNER JOIN students ON students.StudentID = quizsubmissions.StudentID
            LEFT JOIN quizratings ON students.StudentID = quizratings.StudentID AND quizratings.QuizID= quizclassassignments.QuizID
            /* INNER JOIN quizratings ON students.StudentID = quizratings.StudentID AND quizratings.QuizID= quizclassassignments.QuizID */
            WHERE quizclassassignments.ClassDetailsID = cID AND QuizSubmissions.QuizID = qID 
            AND students.StudentID IN (SELECT StudentID FROM Classes WHERE ClassDetailsID = cID)
            UNION
            SELECT 'Incompleted' Caption, students.studentID,email,firstname,lastname, Null as score, Null as subDate, Null as rating FROM classes
            INNER JOIN students ON students.StudentID = classes.StudentID
            WHERE students.StudentID NOT IN (SELECT StudentID FROM QuizSubmissions WHERE QuizID = qID) AND classes.ClassDetailsID = cID 
        )subquery
        ORDER BY Caption asc, FIELD(Caption, 'Completed', 'Incompleted');
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;


CALL quiz_submission_add(1,1,"e@email.com","password")



# add share submission
DELIMITER $$
CREATE PROCEDURE quiz_submission_share (qID int, sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    UPDATE QuizSubmissions 
    SET IsShared = 1
    WHERE StudentID = theStudentID AND QuizID = qID;
END$$
DELIMITER ;


# add share submission
DELIMITER $$
CREATE PROCEDURE quiz_submission_share_delete (qID int, sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    UPDATE QuizSubmissions 
    SET IsShared = 0
    WHERE StudentID = theStudentID AND QuizID = qID;
END$$
DELIMITER ;










# get quiz submission by student
DELIMITER $$
CREATE PROCEDURE quiz_submission_get_by_student (sID int,cID int, tEmail varchar(255), tPassword varchar(60))
BEGIN
    #get student id
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    IF EXISTS (SELECT * FROM ClassDetails WHERE TeacherID = theTeacherID AND ClassDetailsID = cID) THEN
        SELECT * FROM
        (
            SELECT 'Completed' Caption, score, subDate, rating, quizzes.QuizName, COUNT(quizquestions.QuizID) AS total
            FROM QuizSubmissions 
            INNER JOIN quizclassassignments ON quizclassassignments.quizID = quizsubmissions.QuizID 
            INNER JOIN quizzes ON quizclassassignments.quizID = quizzes.QuizID 
            INNER JOIN students ON students.StudentID = quizsubmissions.StudentID
            LEFT JOIN quizratings ON students.StudentID = quizratings.StudentID AND quizratings.QuizID= quizclassassignments.QuizID
            RIGHT JOIN quizquestions ON quizsubmissions.QuizID = quizquestions.QuizID
            WHERE quizclassassignments.ClassDetailsID = cID AND Students.StudentID = sID GROUP BY quizzes.QuizID 
            UNION
            SELECT 'Incomplete' Caption, NULL AS score, NULL AS subDate, NULL AS rating, quizzes.QuizName, COUNT(quizquestions.QuizID) AS total
            FROM quizclassassignments
            INNER JOIN quizzes ON quizclassassignments.quizID = quizzes.QuizID 
            INNER JOIN classes ON classes.ClassDetailsID = quizclassassignments.ClassDetailsID
            RIGHT JOIN quizquestions ON quizclassassignments.QuizID = quizquestions.QuizID
            WHERE classes.StudentID NOT IN (SELECT StudentID FROM QuizSubmissions WHERE QuizID = quizzes.QuizID) AND quizclassassignments.ClassDetailsID = cID AND classes.StudentID = sID 			
            GROUP BY quizzes.QuizID 
        )subquery
        ORDER BY Caption asc, FIELD(Caption, 'Completed', 'Incompleted');
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;


CALL quiz_submission_get_by_student(1,1,"e@email.com","password")