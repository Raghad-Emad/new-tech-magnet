



# not ran ///////////////////////////////////////////////////////
# assign activity (to student)
DELIMITER $$
CREATE PROCEDURE assign_activity(studentID int, taskType int, tEmail varchar(255), tPassword varchar(60))
BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    INSERT INTO assignments
    (TeacherID, StudentID, TaskType)
    VALUES(theTeacherID, studentID, taskType)
END$$
DELIMITER ;

