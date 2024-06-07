# create teacher
DELIMITER $$
CREATE PROCEDURE create_teacher (fName varchar(60),lName varchar(60), tEmail varchar(255), tPassword varchar(60),pNumber varchar(13))
BEGIN
    INSERT INTO teachers (Email,FirstName,LastName,Password,PhoneNumber) VALUES(tEmail,fName,lName,tPassword,pNumber);
END$$
DELIMITER ;

# execute
CALL create_teacher ("firstname", "lastname", "email2@email.com", "password","01234666345")

# update teacher
DELIMITER $$
CREATE PROCEDURE update_teacher (oEmail varchar(255),oPassword varchar(60),nfName varchar(60),nlName varchar(60), nEmail varchar(255),nfNumber varchar(13))
BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = oEmail AND password = oPassword LIMIT 1);
    IF EXISTS (SELECT * FROM teachers WHERE email = oEmail AND password = oPassword) THEN
        UPDATE teachers SET Email = nEmail, FirstName = nfName, LastName = nlName, PhoneNumber=nfNumber WHERE teacherID = theTeacherID;
    ELSE
    ROLLBACK;
    END IF;
END$$
DELIMITER ;

# execute
CALL update_teacher ( "email2@email.com", "password", "changedFirst2", "changedLast2", "email2@email.com", "password","1234567890")

# delete teacher
DELIMITER $$
CREATE PROCEDURE delete_teacher (tEmail varchar(255),tPassword varchar(60))
BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    IF EXISTS (SELECT * FROM teachers WHERE email = tEmail AND password = tPassword) THEN
        DELETE FROM teachers WHERE teacherID = theTeacherID;
    ELSE
    ROLLBACK;
    END IF;
END$$
DELIMITER ;

# execute 
CALL delete_teacher ("email2@email.com", "password")

# details teacher
DELIMITER $$
CREATE PROCEDURE details_teacher (tEmail varchar(255),tPassword varchar(60))
BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    IF EXISTS (SELECT * FROM teachers WHERE email = tEmail AND password = tPassword) THEN
        SELECT email, FirstName, LastName, PhoneNumber FROM Teachers WHERE teacherID = theTeacherID LIMIT 1;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

# execute
CALL details_teacher ("email2@email.com", "password")


# edit password teacher
DELIMITER $$
CREATE PROCEDURE teacher_edit_password (aEmail varchar(255), aPassword varchar(60), nPassword varchar(60) )
BEGIN
    #get student id
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = aEmail AND password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM Teachers WHERE email = aEmail AND password = aPassword) THEN
        #edit password
        Update Teachers SET Password = nPassword WHERE TeacherID = theTeacherID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL teacher_edit_password ('admin2@email.com','password','password2')



/* # view quiz -- test
DELIMITER $$
CREATE PROCEDURE quiz_view(IN quid_ID int, OUT quizzes, OUT )
BEGIN 
    SELECT * FROM quizzes WHERE QuizID = quid_ID;
    SELECT * FROM quizquestions WHERE QuizID = quid_ID;
    SELECT * FROM QuizOptions 
    INNER JOIN QuizQuestions 
    ON quizquestions.QuestionID = QuizOptions.QuestionID
    WHERE quizquestions.QuizID = quid_ID;
END$$
DELIMITER ;

# execute
CALL quiz_view (35) */
