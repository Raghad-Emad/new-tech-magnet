 # create student
DELIMITER $$
CREATE PROCEDURE create_student (fName varchar(60),lName varchar(60), sEmail varchar(255), sPassword varchar(60))
BEGIN
    INSERT INTO students (Email,FirstName,LastName,Password) VALUES(sEmail,fName,lName,sPassword);
END$$
DELIMITER ;

# execute
CALL create_student ("firstname", "lastname", "email2@email.com", "password")

 
 
 # update student
DELIMITER $$
CREATE PROCEDURE update_student (oEmail varchar(255),oPassword varchar(60),nfName varchar(60),nlName varchar(60), nEmail varchar(255))
BEGIN
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = oEmail AND password = oPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE email = oEmail AND password = oPassword) THEN
        UPDATE students SET Email = nEmail, FirstName = nfName, LastName = nlName WHERE studentID = theStudentID AND password = oPassword LIMIT 1;
    ELSE
    ROLLBACK;
    END IF;
END$$
DELIMITER ;

# execute
CALL update_student ( "email2@email.com", "password", "changedFirst", "changedLast", "email2@email.com", "password")
CALL update_student ( "email2@email.com", "$2b$10$.a6c8qVWQm8oZ77bJDVQnupa8oI3Mrhg4K8yZSfKjEfeZtpbEByoG", "changedfirst3", "changedlast", "email2@email.com")


 # update profile picture
DELIMITER $$
CREATE PROCEDURE update_profile_picture (nProfilePicture varchar(255),sEmail varchar(255),sPassword varchar(60))
BEGIN
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE email = sEmail AND password = sPassword) THEN
        UPDATE students SET ProfilePicture = nProfilePicture  WHERE studentID = theStudentID AND password = sPassword LIMIT 1;
    ELSE
    ROLLBACK;
    END IF;
END$$
DELIMITER ;

# execute
CALL update_profile_picture ( "email2@email.com", "password", "changedFirst", "changedLast", "email2@email.com", "password")

 # update banner
DELIMITER $$
CREATE PROCEDURE update_banner (nBanner varchar(255),sEmail varchar(255),sPassword varchar(60))
BEGIN
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE email = sEmail AND password = sPassword) THEN
        UPDATE students SET Banner = nBanner  WHERE studentID = theStudentID AND password = sPassword LIMIT 1;
    ELSE
    ROLLBACK;
    END IF;
END$$
DELIMITER ;

# execute
CALL update_banner ( "email2@email.com", "password", "changedFirst", "changedLast", "email2@email.com", "password")


 # update xp and level
DELIMITER $$
CREATE PROCEDURE update_xp_level (nXp int, nLevel int, sEmail varchar(255),sPassword varchar(60))
BEGIN
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE email = sEmail AND password = sPassword) THEN
        UPDATE students SET Xp = nXp, Level = nLevel WHERE studentID = theStudentID AND password = sPassword LIMIT 1;
    ELSE
    ROLLBACK;
    END IF;
END$$
DELIMITER ;

# execute
CALL update_banner ( "email2@email.com", "password", "changedFirst", "changedLast", "email2@email.com", "password")




# delete student
DELIMITER $$
CREATE PROCEDURE delete_student (sEmail varchar(255),sPassword varchar(60))
BEGIN
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE email = sEmail AND password = sPassword) THEN
        DELETE FROM students WHERE studentID = theStudentID;
    ELSE
    ROLLBACK;
    END IF;
END$$
DELIMITER ;

# execute 
CALL delete_student ( "email2@email.com", "password")


#get student details
DELIMITER $$
CREATE PROCEDURE get_student_details (sEmail varchar(255),sPassword varchar(60))
BEGIN
    /* DECLARE theStudentID int; */
    /* SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1); */
    IF EXISTS (SELECT * FROM students WHERE email = sEmail AND password = sPassword) THEN
        SELECT FirstName, LastName, Email, Xp, Level, Coins, ProfilePicture, Banner FROM students WHERE email = sEmail AND password = sPassword;
    ELSE
    ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL get_student_details ( "email2@email.com", "password")


# get students from class
DELIMITER $$
CREATE PROCEDURE get_students_by_class (classID int, sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #check student is in class
    IF EXISTS (SELECT * FROM classes WHERE StudentID = theStudentID AND ClassDetailsID = classID) THEN
        SELECT FirstName,LastName,Xp,Level,ProfilePicture FROM classes INNER JOIN students ON students.StudentID = classes.StudentID WHERE classes.ClassDetailsID = classID ORDER BY Level DESC,Xp DESC;# join with student name
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL get_students_by_class ("1", "email@email.com", "password")


/* #get xp
DELIMITER $$
CREATE PROCEDURE get_students_xp (sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    SELECT Xp FROM students WHERE email = sEmail AND password = sPassword LIMIT 1;
END$$
DELIMITER ;

#get coins
DELIMITER $$
CREATE PROCEDURE get_students_coins (sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    SELECT Coins FROM students WHERE email = sEmail AND password = sPassword LIMIT 1;
END$$
DELIMITER ; */



#get all students
DELIMITER $$
CREATE PROCEDURE get_all_students (tEmail varchar(255), tPassword varchar(60))
BEGIN
    #check if teacher
    IF EXISTS (SELECT * FROM teachers WHERE email = tEmail AND password = tPassword) THEN
        SELECT StudentID, Email, FirstName, LastName 
        FROM Students;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

#search students
DELIMITER $$
CREATE PROCEDURE search_students (tEmail varchar(255), tPassword varchar(60), sTerm TEXT)
BEGIN
    IF EXISTS (SELECT * FROM teachers WHERE email = tEmail AND password = tPassword) THEN
        SELECT StudentID, Email, FirstName, LastName 
        FROM Students 
        WHERE Email LIKE CONCAT('%', sTerm , '%') 
        OR FirstName LIKE CONCAT('%', sTerm , '%') 
        OR LastName LIKE CONCAT('%', sTerm , '%');
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL search_students ("email2@email.com", "password", "e")


# edit password student
DELIMITER $$
CREATE PROCEDURE student_edit_password (aEmail varchar(255), aPassword varchar(60), nPassword varchar(60) )
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM Students WHERE email = aEmail AND password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM Students WHERE email = aEmail AND password = aPassword) THEN
        #edit password
        Update Students SET Password = nPassword WHERE StudentID = theStudentID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL student_edit_password ('admin2@email.com','password','password2')
