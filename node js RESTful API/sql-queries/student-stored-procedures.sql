
# get the students classes
DELIMITER $$
CREATE PROCEDURE get_students_classes (sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #check student is in class
SELECT ClassDetails.Name, ClassDetails.ClassDetailsID, ClassDetails.YearGroup, teachers.FirstName, teachers.LastName FROM classes INNER JOIN ClassDetails ON ClassDetails.classDetailsID = classes.classDetailsID INNER JOIN teachers ON classdetails.TeacherID = teachers.TeacherID  WHERE classes.studentID = theStudentID;# join with student name
END$$
DELIMITER ;

CALL get_students_classes ("email@email.com", "password")



# get the students assignments
DELIMITER $$
CREATE PROCEDURE assignments_by_students (sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);

    #get from both class and indivisual assignments
    SELECT * FROM
    (
        SELECT 'Indivisual' Caption, quizassignments.QuizID, QuizName,null AS 'ClassName', teachers.FirstName, teachers.LastName, ModuleName, DueDate
        FROM quizassignments 
        INNER JOIN quizzes 
        ON quizassignments.QuizID = quizzes.QuizID 
        LEFT JOIN modules 
        ON quizzes.ModuleID = modules.ModuleID 
        INNER JOIN teachers 
        ON quizzes.TeacherID = teachers.TeacherID 
        WHERE quizassignments.studentID = theStudentID AND quizassignments.QuizID NOT IN (SELECT QuizID FROM QuizSubmissions WHERE StudentID = theStudentID)
        UNION ALL
        SELECT 'Class' Caption, quizclassassignments.QuizID, QuizName,classdetails.Name AS 'ClassName', teachers.FirstName, teachers.LastName, ModuleName, DueDate
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

    ) subquery
    ORDER BY DueDate, FIELD(Caption, 'Indivisual', 'Class');


    #SELECT quizassignments.QuizID, QuizName, FirstName, LastName, ModuleName
    #FROM quizassignments 
    #INNER JOIN quizzes 
    #ON quizassignments.QuizID = quizzes.QuizID 
    #LEFT JOIN modules 
    #ON quizzes.ModuleID = modules.ModuleID 
    #INNER JOIN teachers 
    #ON quizzes.TeacherID = teachers.TeacherID 
    #WHERE quizassignments.studentID = theStudentID;

END$$
DELIMITER ;

CALL assignments_by_students ("email@email.com", "password")




/* # add quiz submission
DELIMITER $$
CREATE PROCEDURE quiz_submission_add (qID int, qScore int,qXp int, qCoins int, sEmail varchar(255), sPassword varchar(60))
BEGIN
    DECLARE TotalXp int;
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
    SET TotalXp = (SELECT Xp FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #get coins
    SET TotalCoins = (SELECT Coins FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #add to total
    UPDATE Students
    SET Xp = qXp + TotalXp, Coins = TotalCoins + qCoins
    WHERE StudentID = theStudentID;
END$$
DELIMITER ;

CALL quiz_submission_add(1,1,"e@email.com","password") */





