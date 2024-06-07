 # get monthly signups
DELIMITER $$
CREATE PROCEDURE Monthly_signups ()
BEGIN
    SELECT CONCAT(UPPER(DATE_FORMAT(SignUpDate, '%b')),'-',year(SignUpDate)) AS Month, count(*) AS Num
    FROM studentsignups
    GROUP BY CONCAT(UPPER(DATE_FORMAT(SignUpDate, '%b')),'-',year(SignUpDate));
END$$
DELIMITER ;

 /* # get total users by month
DELIMITER $$
CREATE PROCEDURE Monthly_signups ()
BEGIN

    SELECT *  SUM(Num) OVER FROM studentsignups,
    (SELECT CONCAT(UPPER(DATE_FORMAT(SignUpDate, '%b')),'-',year(SignUpDate)) AS Month, count(*) AS Num
    FROM studentsignups
    GROUP BY CONCAT(UPPER(DATE_FORMAT(SignUpDate, '%b')),'-',year(SignUpDate))) AS montly;
END$$
DELIMITER ; */


 # get Assignment Progress
DELIMITER $$
CREATE PROCEDURE all_assignment_progress(tEmail varchar(255), tPassword varchar(60))
BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    #check is teachers class
    SELECT * FROM 
    (
        SELECT 'Complete' Caption, COUNT(*) AS Number,ClassDetailsID, Name as ClassName,TeacherID FROM (
        SELECT Email, FirstName, LastName,Classes.ClassDetailsID, classdetails.Name,ClassDetails.TeacherID FROM QuizClassAssignments 
        INNER JOIN Classes ON Classes.ClassDetailsID = QuizClassAssignments.ClassDetailsID
        INNER JOIN ClassDetails ON ClassDetails.ClassDetailsID = QuizClassAssignments.ClassDetailsID
        INNER JOIN Students ON Classes.StudentID = Students.StudentID 
        WHERE quizclassassignments.QuizID IN (SELECT QuizID FROM QuizSubmissions WHERE StudentID = Students.StudentID)) AS Students 
         GROUP BY ClassDetailsID
        UNION ALL
        SELECT 'Incomplete' Caption, COUNT(*) AS Number,ClassDetailsID, Name as ClassName,TeacherID FROM (
        SELECT Email, FirstName, LastName,Classes.ClassDetailsID, classdetails.Name,ClassDetails.TeacherID FROM QuizClassAssignments 
        INNER JOIN Classes ON Classes.ClassDetailsID = QuizClassAssignments.ClassDetailsID
        INNER JOIN ClassDetails ON ClassDetails.ClassDetailsID = QuizClassAssignments.ClassDetailsID
        INNER JOIN Students ON Classes.StudentID = Students.StudentID 
        WHERE quizclassassignments.QuizID NOT IN (SELECT QuizID FROM QuizSubmissions WHERE StudentID = Students.StudentID)) AS Students 
         GROUP BY ClassDetailsID
    )subquery
    WHERE TeacherID = theTeacherID ORDER BY ClassName, FIELD(Caption, 'Complete', 'Incomplete');
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE assignment_ratings_by_teacher(tEmail varchar(255), tPassword varchar(60))
BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);

    SELECT Quizzes.QuizID, Quizzes.QuizName, AVG(Rating) AS AverageRating,Quizzes.TeacherID FROM Quizzes
    INNER JOIN QuizRatings ON QuizRatings.QuizID = Quizzes.QuizID
    WHERE quizzes.TeacherID = theTeacherID
    GROUP BY Quizzes.QuizID;
END$$
DELIMITER ;
