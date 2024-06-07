#create class assignment
DELIMITER $$
CREATE PROCEDURE assignment_quiz_create_class(cID int,qID int,dDate DATE, qXp int, qCoins int,tEmail varchar(255), tPassword varchar(60))
BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    #check is teachers class
    /* IF EXISTS (SELECT * FROM classes
    INNER JOIN ClassDetails ON classes.classdetailsID = classdetails.classDetailsID 
    WHERE ClassDetails.TeacherID = theTeacherID AND classes.classDetailsID = cID) THEN */
    IF EXISTS (SELECT * FROM  ClassDetails 
    WHERE TeacherID = theTeacherID AND classDetailsID = cID) THEN

        #check if exists
        IF EXISTS (SELECT * FROM QuizClassAssignments 
            WHERE ClassDetailsID = cID AND QuizID = qID) THEN
            UPDATE QuizClassAssignments
            SET DueDate = dDate, xp = qXp, coins = qCoins
            WHERE ClassDetailsID = cID AND QuizID = qID; 
        ELSE
        #does not attempt to insert if duplicate
            INSERT IGNORE INTO QuizClassAssignments(ClassDetailsID, QuizID, DueDate, Xp,Coins)
            VALUES (cID,qID,dDate,qXp,qCoins);
        END IF;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL assignment_quiz_create_class(1,1,"date-here",100,"email","password")


DELIMITER $$
CREATE PROCEDURE assignment_quiz_delete(qID int, cID int,tEmail varchar(255), tPassword varchar(60))
BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    #check is teachers class
    IF EXISTS (SELECT * FROM QuizClassAssignments INNER JOIN ClassDetails ON classdetails.classDetailsID = QuizClassAssignments.classDetailsID WHERE QuizClassAssignments.ClassDetailsID = cID AND classdetails.TeacherID = theTeacherID) THEN
        DELETE FROM QuizClassAssignments
        WHERE ClassDetailsID = cID AND QuizID = qID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL assignment_quiz_delete(1,1,"email","password")



# get assement class
DELIMITER $$
CREATE PROCEDURE assignment_class_progress(qID int, cID int,tEmail varchar(255), tPassword varchar(60))
BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    #check is teachers class
    IF EXISTS (SELECT * FROM QuizClassAssignments INNER JOIN ClassDetails ON classdetails.classDetailsID = QuizClassAssignments.classDetailsID WHERE QuizClassAssignments.ClassDetailsID = cID AND classdetails.TeacherID = theTeacherID) THEN
        SELECT * FROM 
        (
            SELECT 'Complete' Caption, COUNT(*) AS Number FROM (
            SELECT Email, FirstName, LastName FROM QuizClassAssignments 
            INNER JOIN Classes ON Classes.ClassDetailsID = QuizClassAssignments.ClassDetailsID
            INNER JOIN Students ON Classes.StudentID = Students.StudentID 
            WHERE Classes.ClassDetailsID = cID AND QuizClassAssignments.QuizID = qID
            AND quizclassassignments.QuizID IN (SELECT QuizID FROM QuizSubmissions WHERE StudentID = Students.StudentID)) AS Students
            UNION ALL
            SELECT 'Incomplete' Caption, COUNT(*) AS Number FROM (
            SELECT Email, FirstName, LastName FROM QuizClassAssignments 
            INNER JOIN Classes ON Classes.ClassDetailsID = QuizClassAssignments.ClassDetailsID
            INNER JOIN Students ON Classes.StudentID = Students.StudentID 
            WHERE Classes.ClassDetailsID = cID AND QuizClassAssignments.QuizID = qID
            AND quizclassassignments.QuizID NOT IN (SELECT QuizID FROM QuizSubmissions WHERE StudentID = Students.StudentID)) AS Students
        )subquery
        ORDER BY Number, FIELD(Caption, 'Complete', 'Incomplete');

    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;









# get overal class
DELIMITER $$
CREATE PROCEDURE assignment_overall_class_progress(cID int,tEmail varchar(255), tPassword varchar(60))
BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    #check is teachers class
    IF EXISTS (SELECT * FROM QuizClassAssignments INNER JOIN ClassDetails ON classdetails.classDetailsID = QuizClassAssignments.classDetailsID WHERE QuizClassAssignments.ClassDetailsID = cID AND classdetails.TeacherID = theTeacherID) THEN
        SELECT * FROM 
        (
            SELECT 'Complete' Caption, COUNT(*) AS Number FROM (
            SELECT Email, FirstName, LastName FROM QuizClassAssignments 
            INNER JOIN Classes ON Classes.ClassDetailsID = QuizClassAssignments.ClassDetailsID
            INNER JOIN Students ON Classes.StudentID = Students.StudentID 
            WHERE Classes.ClassDetailsID = cID
            AND quizclassassignments.QuizID IN (SELECT QuizID FROM QuizSubmissions WHERE StudentID = Students.StudentID)) AS Students
            UNION ALL
            SELECT 'Incomplete' Caption, COUNT(*) AS Number FROM (
            SELECT Email, FirstName, LastName FROM QuizClassAssignments 
            INNER JOIN Classes ON Classes.ClassDetailsID = QuizClassAssignments.ClassDetailsID
            INNER JOIN Students ON Classes.StudentID = Students.StudentID 
            WHERE Classes.ClassDetailsID = cID
            AND quizclassassignments.QuizID NOT IN (SELECT QuizID FROM QuizSubmissions WHERE StudentID = Students.StudentID)) AS Students
        )subquery
        ORDER BY Number, FIELD(Caption, 'Complete', 'Incomplete');

    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;


#get students havent completed assignment
DELIMITER $$
CREATE PROCEDURE assignment_get_students_by_incomplete(qID int, cID int,tEmail varchar(255), tPassword varchar(60))
BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    #check is teachers class
    IF EXISTS (SELECT * FROM QuizClassAssignments INNER JOIN ClassDetails ON classdetails.classDetailsID = QuizClassAssignments.classDetailsID WHERE QuizClassAssignments.ClassDetailsID = cID AND classdetails.TeacherID = theTeacherID) THEN
        SELECT Email, FirstName, LastName FROM QuizClassAssignments 
        INNER JOIN Classes ON Classes.ClassDetailsID = QuizClassAssignments.ClassDetailsID
        INNER JOIN Students ON Classes.StudentID = Students.StudentID 
        WHERE Classes.ClassDetailsID = cID AND QuizClassAssignments.QuizID = qID
        AND quizclassassignments.QuizID NOT IN (SELECT QuizID FROM QuizSubmissions WHERE StudentID = Students.StudentID);
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

/* #create indivisual assignment
DELIMITER $$
CREATE PROCEDURE assignment_quiz_create_indivisual(sID int,qID int,tEmail varchar(255), tPassword varchar(60))
BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    #check student in teachers class
    IF EXISTS (SELECT * FROM classes 
    INNER JOIN classdetails ON classes.ClassDetailsID = classdetails.ClassDetailsID
    WHERE StudentID = sID AND TeacherID = theTeacherID) THEN
    #does not attempt to insert if duplicate
        INSERT IGNORE INTO quizassignments(StudentID, QuizID)
        VALUES (sID,qID);
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL assignment_quiz_create_indivisual(1,1,"email","password") */