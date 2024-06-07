# get students from class
DELIMITER $$
CREATE PROCEDURE teacher_get_students_by_class (classID int, tEmail varchar(255), tPassword varchar(60))
BEGIN
    #get student id
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    #check student is in class
    IF EXISTS (SELECT * FROM classes INNER JOIN classdetails ON classdetails.ClassDetailsID = classes.ClassDetailsID WHERE TeacherID = 2 AND classes.ClassDetailsID=1) THEN
        SELECT classes.StudentID, FirstName,LastName FROM classes INNER JOIN students ON students.StudentID = classes.StudentID WHERE classes.ClassDetailsID = classID;# join with student name
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL teacher_get_students_by_class ("1", "email@email.com", "password")



# add student to a class
DELIMITER $$
CREATE PROCEDURE add_student_to_class(cDetailsID int,sID int, tEmail varchar(255), tPassword varchar(60))
BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    # check if teacher owns class
    IF EXISTS (SELECT * FROM classdetails WHERE TeacherID = theTeacherID AND ClassDetailsID = cDetailsID) THEN
            INSERT INTO classes(ClassDetailsID,StudentID)
            VALUES(cDetailsID,sID);
    ELSE
    ROLLBACK;
    # return error code
    END IF;
END$$
DELIMITER ;

# execute
CALL add_student_to_class (1, 1, "testEmail", "password")
CALL add_student_to_class (1, 1, "email2@email.com", "password")



#Remove student from class
DELIMITER $$
CREATE PROCEDURE remove_student_from_class(cDetailsID int,sID int, tEmail varchar(255), tPassword varchar(60))
BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    # check if teacher owns class
    IF EXISTS (SELECT * FROM classdetails WHERE TeacherID = theTeacherID AND ClassDetailsID = cDetailsID) THEN
            DELETE FROM classes
            WHERE StudentID = sID AND ClassDetailsID = cDetailsID;
    ELSE
    ROLLBACK;
    # return error code
    END IF;
END$$
DELIMITER ;

CALL remove_student_from_class (1, 1, "email2@email.com", "password")

