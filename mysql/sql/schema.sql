-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: proj-mysql.uopnet.plymouth.ac.uk
-- Generation Time: Jun 28, 2022 at 09:54 PM
-- Server version: 8.0.21
-- PHP Version: 7.2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `comp3000_jchurchill`
--

DELIMITER $$
--
-- CREATE PROCEDUREs
--
 CREATE PROCEDURE `add_student_to_class` (`cDetailsID` INT, `sID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE Email = tEmail AND password = tPassword LIMIT 1);
    # check if teacher owns class
    IF EXISTS (SELECT * FROM classdetails WHERE TeacherID = theTeacherID AND ClassDetailsID = cDetailsID) THEN
            INSERT INTO classes(ClassDetailsID,StudentID)
            VALUES(cDetailsID,sID);
    ELSE
    ROLLBACK;
    # return error code
    END IF;
END$$

 CREATE PROCEDURE `Admin_create` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `nEmail` VARCHAR(255), `nPassword` VARCHAR(60), `nFirstname` VARCHAR(60), `nLastname` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theAdminID int;
    SET theAdminID = (SELECT AdminID FROM admins WHERE Email = aEmail AND password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM admins WHERE AdminID = theAdminID) THEN
        #insert new admin
        INSERT INTO admins(Email, Password, Firstname,Lastname) VALUES (nEmail,nPassword,nFirstname,nLastname);
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Admin_delete` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theAdminID int;
    SET theAdminID = (SELECT AdminID FROM admins WHERE Email = aEmail AND Password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM admins WHERE Email = aEmail AND Password = aPassword) THEN
        #Delete admin
        DELETE FROM admins WHERE AdminID = theAdminID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Admin_details` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theAdminID int;
    SET theAdminID = (SELECT AdminID FROM admins WHERE Email = aEmail AND Password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM admins WHERE Email = aEmail AND Password = aPassword) THEN
        #Get details
        SELECT Email, Firstname, Lastname FROM admins WHERE AdminID = theAdminID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Admin_edit` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `nEmail` VARCHAR(255), `nFirstname` VARCHAR(60), `nLastname` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theAdminID int;
    SET theAdminID = (SELECT AdminID FROM admins WHERE Email = aEmail AND Password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM admins WHERE AdminID = theAdminID) THEN
        #edit admin
        Update admins SET Email=nEmail, Firstname=nFirstname, LastName=nLastname WHERE AdminID = theAdminID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Admin_edit_password` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `nPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theAdminID int;
    SET theAdminID = (SELECT AdminID FROM admins WHERE Email = aEmail AND Password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM admins WHERE Email = aEmail AND Password = aPassword) THEN
        #edit password
        Update admins SET Password = nPassword WHERE AdminID = theAdminID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `all_assignment_progress` (`tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE Email = tEmail AND Password = tPassword LIMIT 1);
    #check is teachers class
    SELECT * FROM 
    (
        SELECT 'Complete' Caption, COUNT(*) AS Number,ClassDetailsID, Name as ClassName,TeacherID FROM (
        SELECT Email, FirstName, LastName,classes.ClassDetailsID, classdetails.Name,classdetails.TeacherID FROM quizclassassignments 
        INNER JOIN classes ON classes.ClassDetailsID = quizclassassignments.ClassDetailsID
        INNER JOIN classdetails ON classdetails.ClassDetailsID = quizclassassignments.ClassDetailsID
        INNER JOIN students ON classes.StudentID = students.StudentID 
        WHERE quizclassassignments.QuizID IN (SELECT QuizID FROM quizsubmissions WHERE StudentID = students.StudentID)) AS students 
         GROUP BY ClassDetailsID
        UNION ALL
        SELECT 'Incomplete' Caption, COUNT(*) AS Number,ClassDetailsID, Name as ClassName,TeacherID FROM (
        SELECT Email, FirstName, LastName,classes.ClassDetailsID, classdetails.Name,classdetails.TeacherID FROM quizclassassignments 
        INNER JOIN classes ON classes.ClassDetailsID = quizclassassignments.ClassDetailsID
        INNER JOIN classdetails ON classdetails.ClassDetailsID = quizclassassignments.ClassDetailsID
        INNER JOIN students ON classes.StudentID = students.StudentID 
        WHERE quizclassassignments.QuizID NOT IN (SELECT QuizID FROM quizsubmissions WHERE StudentID = students.StudentID)) AS students 
         GROUP BY ClassDetailsID
    )subquery
    WHERE TeacherID = theTeacherID ORDER BY ClassName, FIELD(Caption, 'Complete', 'Incomplete');
END$$

 CREATE PROCEDURE `assignments_by_students` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE Email = sEmail AND Password = sPassword LIMIT 1);

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
        WHERE quizassignments.StudentID = theStudentID AND quizassignments.QuizID NOT IN (SELECT QuizID FROM quizsubmissions WHERE StudentID = theStudentID)
        UNION ALL
        SELECT 'Class' Caption, quizclassassignments.QuizID, QuizName,classdetails.Name AS 'ClassName', teachers.FirstName, teachers.LastName, ModuleName, DueDate
        FROM quizclassassignments 
        INNER JOIN quizzes 
        ON quizclassassignments.QuizID = quizzes.QuizID 
        LEFT JOIN modules 
        ON quizzes.ModuleID = modules.ModuleID 
        INNER JOIN teachers 
        ON quizzes.TeacherID = teachers.TeacherID
        INNER JOIN classes
        ON quizclassassignments.ClassDetailsID = classes.ClassDetailsID
        INNER JOIN students
        ON classes.StudentID = students.StudentID
        INNER JOIN classdetails
        ON classdetails.ClassDetailsID = classes.ClassDetailsID
        WHERE students.StudentID = theStudentID AND quizclassassignments.QuizID NOT IN (SELECT QuizID FROM quizsubmissions WHERE StudentID = theStudentID)

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

 CREATE PROCEDURE `assignment_class_progress` (`qID` INT, `cID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE Email = tEmail AND Password = tPassword LIMIT 1);
    #check is teachers class
    IF EXISTS (SELECT * FROM quizclassassignments INNER JOIN classdetails ON classdetails.ClassDetailsID = quizclassassignments.ClassDetailsID WHERE quizclassassignments.ClassDetailsID = cID AND classdetails.TeacherID = theTeacherID) THEN
        SELECT * FROM 
        (
            SELECT 'Complete' Caption, COUNT(*) AS Number FROM (
            SELECT Email, FirstName, LastName FROM quizclassassignments 
            INNER JOIN classes ON classes.ClassDetailsID = quizclassassignments.ClassDetailsID
            INNER JOIN students ON classes.StudentID = students.StudentID 
            WHERE classes.ClassDetailsID = cID AND quizclassassignments.QuizID = qID
            AND quizclassassignments.QuizID IN (SELECT QuizID FROM quizsubmissions WHERE StudentID = students.StudentID)) AS students
            UNION ALL
            SELECT 'Incomplete' Caption, COUNT(*) AS Number FROM (
            SELECT Email, FirstName, LastName FROM quizclassassignments 
            INNER JOIN classes ON classes.ClassDetailsID = quizclassassignments.ClassDetailsID
            INNER JOIN students ON classes.StudentID = students.StudentID 
            WHERE classes.ClassDetailsID = cID AND quizclassassignments.QuizID = qID
            AND quizclassassignments.QuizID NOT IN (SELECT QuizID FROM quizsubmissions WHERE StudentID = students.StudentID)) AS students
        )subquery
        ORDER BY Number, FIELD(Caption, 'Complete', 'Incomplete');

    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `assignment_get_students_by_incomplete` (`qID` INT, `cID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE Email = tEmail AND Password = tPassword LIMIT 1);
    #check is teachers class
    IF EXISTS (SELECT * FROM quizclassassignments INNER JOIN classdetails ON classdetails.ClassDetailsID = quizclassassignments.ClassDetailsID WHERE quizclassassignments.ClassDetailsID = cID AND classdetails.TeacherID = theTeacherID) THEN
        SELECT Email, FirstName, LastName FROM quizclassassignments 
        INNER JOIN classes ON classes.ClassDetailsID = quizclassassignments.ClassDetailsID
        INNER JOIN students ON classes.StudentID = students.StudentID 
        WHERE classes.ClassDetailsID = cID AND quizclassassignments.QuizID = qID
        AND quizclassassignments.QuizID NOT IN (SELECT QuizID FROM quizsubmissions WHERE StudentID = students.StudentID);
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `assignment_overall_class_progress` (`cID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE Email = tEmail AND Password = tPassword LIMIT 1);
    #check is teachers class
    #IF EXISTS (SELECT * FROM quizclassassignments INNER JOIN classdetails ON classdetails.ClassDetailsID = quizclassassignments.ClassDetailsID WHERE quizclassassignments.ClassDetailsID = cID AND classdetails.TeacherID = theTeacherID) THEN
        SELECT * FROM 
        (
            SELECT 'Complete' Caption, COUNT(*) AS Number FROM (
            SELECT Email, FirstName, LastName FROM quizclassassignments 
            INNER JOIN classes ON classes.ClassDetailsID = quizclassassignments.ClassDetailsID
            INNER JOIN students ON classes.StudentID = students.StudentID 
            WHERE classes.ClassDetailsID = cID
            AND quizclassassignments.QuizID IN (SELECT QuizID FROM quizsubmissions WHERE StudentID = students.StudentID)) AS students
            UNION ALL
            SELECT 'Incomplete' Caption, COUNT(*) AS Number FROM (
            SELECT Email, FirstName, LastName FROM quizclassassignments 
            INNER JOIN classes ON classes.ClassDetailsID = quizclassassignments.ClassDetailsID
            INNER JOIN students ON classes.StudentID = students.StudentID 
            WHERE classes.ClassDetailsID = cID
            AND quizclassassignments.QuizID NOT IN (SELECT QuizID FROM quizsubmissions WHERE StudentID = students.StudentID)) AS students
        )subquery
        ORDER BY Number, FIELD(Caption, 'Complete', 'Incomplete');

    #ELSE
        #ROLLBACK;
    #END IF;
END$$

 CREATE PROCEDURE `assignment_quiz_create_class` (`cID` INT, `qID` INT, `dDate` DATE, `qXp` INT, `qCoins` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE Email = tEmail AND Password = tPassword LIMIT 1);
    #check is teachers class
    /* IF EXISTS (SELECT * FROM classes
    INNER JOIN classdetails ON classes.ClassDetailsID = classdetails.ClassDetailsID 
    WHERE classdetails.TeacherID = theTeacherID AND classes.ClassDetailsID = cID) THEN */
    IF EXISTS (SELECT * FROM  classdetails 
    WHERE TeacherID = theTeacherID AND ClassDetailsID = cID) THEN

        #check if exists
        IF EXISTS (SELECT * FROM quizclassassignments 
            WHERE ClassDetailsID = cID AND QuizID = qID) THEN
            UPDATE quizclassassignments
            SET DueDate = dDate, Xp = qXp, Coins = qCoins
            WHERE ClassDetailsID = cID AND QuizID = qID; 
        ELSE
        #does not attempt to insert if duplicate
            INSERT IGNORE INTO quizclassassignments(ClassDetailsID, QuizID, DueDate, Xp,Coins)
            VALUES (cID,qID,dDate,qXp,qCoins);
        END IF;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `assignment_quiz_delete` (`qID` INT, `cID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE Email = tEmail AND Password = tPassword LIMIT 1);
    #check is teachers class
    IF EXISTS (SELECT * FROM quizclassassignments INNER JOIN classdetails ON classdetails.ClassDetailsID = quizclassassignments.ClassDetailsID WHERE quizclassassignments.ClassDetailsID = cID AND classdetails.TeacherID = theTeacherID) THEN
        DELETE FROM quizclassassignments
        WHERE ClassDetailsID = cID AND QuizID = qID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `assignment_ratings_by_teacher` (`tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE Email = tEmail AND Password = tPassword LIMIT 1);

    SELECT quizzes.QuizID, quizzes.QuizName, AVG(Rating) AS AverageRating,quizzes.TeacherID FROM quizzes
    INNER JOIN quizratings ON quizratings.QuizID = quizzes.QuizID
    WHERE quizzes.TeacherID = theTeacherID
    GROUP BY quizzes.QuizID;
END$$

 CREATE PROCEDURE `Banners_add` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `bName` VARCHAR(60), `bDetails` TEXT, `bImage` TEXT, `bCost` INT, `bReqLev` INT)  BEGIN
    #get student id
    IF EXISTS (SELECT AdminID FROM admins WHERE Email = aEmail AND Password = aPassword LIMIT 1) THEN
        # add banner
        INSERT INTO banners (Name, Details, Image, Cost, RequiredLevel) VALUES (bName, bDetails, bImage, bCost, bReqLev);
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Banners_delete` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `bID` INT)  BEGIN
    #get student id
    IF EXISTS (SELECT AdminID FROM admins WHERE Email = aEmail AND Password = aPassword LIMIT 1) THEN
        # get all banners
        DELETE FROM banners WHERE BannerID = bID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Banners_edit` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `bID` INT, `nName` VARCHAR(60), `nDetails` TEXT, `nImage` TEXT, `nCost` INT, `nReqLev` INT)  BEGIN
    #get student id
    IF EXISTS (SELECT AdminID FROM admins WHERE Email = aEmail AND Password = aPassword LIMIT 1) THEN
        # edit banner
        Update banners SET Name = nName, Details = nDetails, Image = nImage, Cost = nCost, RequiredLevel = nReqLev WHERE BannerID = bID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Banners_get_all` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE Email = sEmail AND Password = sPassword LIMIT 1);

    #get from both purchased and unpurchased banners
    SELECT * FROM
    (
        SELECT 'Unpurchased' Caption, banners.BannerID, Name, Details, Image, Cost, RequiredLevel
        FROM banners
        WHERE BannerID NOT IN (SELECT BannerID FROM bannerspurchased WHERE StudentID = theStudentID)
        UNION ALL
        SELECT 'Purchased' Caption, banners.BannerID, Name, Details, Image, Cost, RequiredLevel
        FROM banners 
        INNER JOIN bannerspurchased 
        ON banners.BannerID = bannerspurchased.BannerID 
        WHERE StudentID = theStudentID
    ) subquery
    ORDER BY RequiredLevel asc, FIELD(Caption, 'Unpurchased', 'Purchased');
END$$

 CREATE PROCEDURE `Banners_get_all_admin` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60))  BEGIN
    #get student id
    IF EXISTS (SELECT AdminID FROM admins WHERE Email = aEmail AND Password = aPassword LIMIT 1) THEN
        # get all banners
        SELECT * FROM banners;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Banners_get_details` (`bID` INT)  BEGIN
    # get banner
    SELECT * FROM banners WHERE BannerID = bID LIMIT 1;
END$$

 CREATE PROCEDURE `Banners_purchased` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE Email = sEmail AND Password = sPassword LIMIT 1);

    #get purchased banners
    SELECT banners.BannerID, Name, Details, Image, Cost, RequiredLevel
    FROM banners 
    INNER JOIN bannerspurchased 
    ON banners.BannerID = bannerspurchased.BannerID 
    WHERE StudentID = theStudentID;
END$$

 CREATE PROCEDURE `Banners_purchased_add` (`bID` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get values
    DECLARE theStudentID int;
    DECLARE numCoins int;
    DECLARE itemCost int;
    DECLARE sLevel int;
    DECLARE itemLevel int;
    SET theStudentID = (SELECT StudentID FROM students WHERE Email = sEmail AND Password = sPassword LIMIT 1);
    SET numCoins = (SELECT Coins FROM students WHERE StudentID = theStudentID LIMIT 1);
    SET itemCost = (SELECT Cost FROM banners WHERE BannerID = bID LIMIT 1);
    SET sLevel = (SELECT Level FROM students WHERE StudentID = theStudentID LIMIT 1);
    SET itemLevel = (SELECT RequiredLevel FROM banners WHERE BannerID = bID LIMIT 1);

    # check if can afford
    IF (numCoins >= itemCost AND sLevel >= itemLevel) then 
        # update students coins
        UPDATE students set Coins = (numCoins-itemCost) WHERE StudentID = theStudentID;
    ELSE
        SELECT(400) AS 'Error';
    END IF;
    IF (numCoins >= itemCost AND sLevel >= itemLevel) then 
        #add purchased banner to table
        INSERT IGNORE INTO bannerspurchased (BannerID,StudentID) 
        VALUES (bID,theStudentID);
    ELSE
        ROLLBACK;
    END IF;
    
END$$

 CREATE PROCEDURE `class_request_accept` (`cDetailsID` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN 
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE Email = sEmail AND Password = sPassword LIMIT 1);
    # check if student is requested
    IF EXISTS (SELECT * FROM classrequests WHERE StudentID = theStudentID AND ClassDetailsID = cDetailsID) THEN
            INSERT IGNORE INTO classes(ClassDetailsID,StudentID)
            VALUES(cDetailsID,theStudentID);
            DELETE FROM classrequests WHERE StudentID = theStudentID AND ClassDetailsID = cDetailsID;
    ELSE
    ROLLBACK;
    # return error code
    END IF;
END$$

 CREATE PROCEDURE `class_request_cancel` (`cDetailsID` INT, `sID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE Email = tEmail AND Password = tPassword LIMIT 1);
    # check if teacher owns class
    IF EXISTS (SELECT * FROM classdetails WHERE TeacherID = theTeacherID AND ClassDetailsID = cDetailsID) THEN
        DELETE FROM classrequests WHERE StudentID = sID AND ClassDetailsID = cDetailsID;
    ELSE
    ROLLBACK;
    # return error code
    END IF;
END$$

 CREATE PROCEDURE `class_request_decline` (`cDetailsID` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN 
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE Email = sEmail AND Password = sPassword LIMIT 1);
    # check if student is requested
    IF EXISTS (SELECT * FROM classrequests WHERE StudentID = theStudentID AND ClassDetailsID = cDetailsID) THEN
            DELETE FROM classrequests WHERE StudentID = theStudentID AND ClassDetailsID = cDetailsID;
    ELSE
    ROLLBACK;
    # return error code
    END IF;
END$$

 CREATE PROCEDURE `class_request_send` (`cDetailsID` INT, `sID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE Email = tEmail AND Password = tPassword LIMIT 1);
    # check if teacher owns class
    IF EXISTS (SELECT * FROM classdetails WHERE TeacherID = theTeacherID AND ClassDetailsID = cDetailsID) THEN
            INSERT INTO classrequests(ClassDetailsID,StudentID)
            VALUES(cDetailsID,sID);
    ELSE
    ROLLBACK;
    # return error code
    END IF;
END$$

 CREATE PROCEDURE `class_request_view_all_students` (`cID` INT, `sTerm` TEXT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN
    #check if teacher
    IF EXISTS (SELECT * FROM teachers WHERE Email = tEmail AND Password = tPassword) THEN
                SELECT students.StudentID, Email, FirstName, LastName, IF(classrequests.StudentID IS NULL, FALSE,TRUE) as isRequest 
        FROM students
        LEFT JOIN classrequests 
        ON (students.StudentID = classrequests.StudentID and classrequests.ClassDetailsID = cID)
        WHERE students.StudentID NOT IN (SELECT StudentID FROM classes WHERE classes.ClassDetailsID = cID) AND (Email LIKE CONCAT('%', sTerm , '%') 
        OR FirstName LIKE CONCAT('%', sTerm , '%') 
        OR LastName LIKE CONCAT('%', sTerm , '%'));
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `class_request_view_student` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN 
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE Email = sEmail AND Password = sPassword LIMIT 1);
    # check if student is requested
    SELECT classdetails.ClassDetailsID, DateSent, classdetails.Name AS 'ClassName', classdetails.YearGroup, teachers.FirstName, teachers.LastName FROM classrequests 
    INNER JOIN classdetails ON classdetails.ClassDetailsID = classrequests.ClassDetailsID 
    INNER JOIN teachers ON classdetails.TeacherID = teachers.TeacherID
    WHERE StudentID = theStudentID ORDER BY DateSent DESC;
END$$

 CREATE PROCEDURE `class_request_view_teacher` (`tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE Email = tEmail AND Password = tPassword LIMIT 1);
    
    SELECT students.StudentID, Email, FirstName, LastName, classdetails.ClassDetailsID, classdetails.Name AS 'ClassName', classdetails.YearGroup, classrequests.DateSent FROM classrequests 
    INNER JOIN classdetails ON classrequests.ClassDetailsID = classdetails.ClassDetailsID
    INNER JOIN students ON classrequests.StudentID = students.StudentID
    WHERE classdetails.TeacherID = theTeacherID ORDER BY classdetails.Name ASC;
END$$

 CREATE PROCEDURE `create_class` (`cName` VARCHAR(60), `cYearGroup` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE Email = tEmail AND Password = tPassword LIMIT 1);
    IF EXISTS (SELECT * FROM teachers WHERE Email = tEmail AND password = tPassword) THEN
        INSERT INTO classdetails 
        (Name,YearGroup,TeacherID)
        VALUES(cName,cYearGroup,theTeacherID);
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `create_student` (`fName` VARCHAR(60), `lName` VARCHAR(60), `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    INSERT INTO students (Email,FirstName,LastName,Password) VALUES(sEmail,fName,lName,sPassword);
END$$

 CREATE PROCEDURE `create_teacher` (`fName` VARCHAR(60), `lName` VARCHAR(60), `tEmail` VARCHAR(255), `tPassword` VARCHAR(60), `pNumber` VARCHAR(13))  BEGIN
    INSERT INTO teachers (Email,FirstName,LastName,Password,PhoneNumber) VALUES(tEmail,fName,lName,tPassword,pNumber);
END$$

 CREATE PROCEDURE `Deck_create` (`nName` VARCHAR(60), `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE Email = sEmail AND Password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE StudentID = theStudentID) THEN
        #insert new deck
        INSERT INTO flashcarddecks (Name,StudentID) VALUES (nName,theStudentID);
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Deck_delete` (`ID` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE StudentID = theStudentID) THEN
        #insert new deck
        DELETE FROM flashcarddecks WHERE StudentID=theStudentID AND DeckID=ID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Deck_get` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #get deck
    SELECT DeckID, Name FROM flashcarddecks WHERE StudentID = theStudentID;
END$$

 CREATE PROCEDURE `Deck_num_flashcards` (`ID` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #count cards
    SELECT COUNT(DeckID) AS NumberOfCards FROM flashcards WHERE DeckID = ID;
END$$

 CREATE PROCEDURE `Deck_update` (`ID` INT, `nName` VARCHAR(60), `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE StudentID = theStudentID) THEN
        #insert new deck
        UPDATE flashcarddecks SET Name=nName WHERE StudentID=theStudentID AND DeckID=ID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `delete_class` (`cDetailsID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    # check if teacher owns class
    IF EXISTS (SELECT * FROM classdetails WHERE TeacherID = theTeacherID AND ClassDetailsID = cDetailsID) THEN
            Delete FROM classdetails WHERE TeacherID = theTeacherID AND ClassDetailsID = cDetailsID;
    ELSE
    ROLLBACK;
    # return error code
    END IF;
END$$

 CREATE PROCEDURE `delete_student` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE email = sEmail AND password = sPassword) THEN
        DELETE FROM students WHERE StudentID = theStudentID;
    ELSE
    ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `delete_teacher` (`tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    IF EXISTS (SELECT * FROM teachers WHERE email = tEmail AND password = tPassword) THEN
        DELETE FROM teachers WHERE TeacherID = theTeacherID;
    ELSE
    ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `details_teacher` (`tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    IF EXISTS (SELECT * FROM teachers WHERE email = tEmail AND password = tPassword) THEN
        SELECT email, FirstName, LastName, PhoneNumber FROM teachers WHERE TeacherID = theTeacherID LIMIT 1;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `feed_get` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
        SELECT * FROM
        (
            SELECT 'Submission' Caption, students.StudentID,firstname,lastname, profilePicture, score, subDate,
            quizzes.QuizID, quizzes.QuizName,COUNT(quizzes.QuizID) AS 'Total',classdetails.Name AS className,
            NULL as ModuleName, NULL as DueDate 
            FROM quizsubmissions 
            INNER JOIN quizclassassignments ON quizclassassignments.QuizID = quizsubmissions.QuizID 
            INNER JOIN students ON students.StudentID = quizsubmissions.StudentID
            INNER JOIN quizzes ON quizzes.QuizID = quizsubmissions.QuizID
            INNER JOIN classdetails ON classdetails.ClassDetailsID = quizclassassignments.ClassDetailsID
            INNER JOIN quizquestions ON quizquestions.QuizID = quizzes.QuizID
            WHERE classdetails.ClassDetailsID IN (SELECT ClassDetailsID FROM classes WHERE classes.StudentID = theStudentID)
            AND quizsubmissions.IsShared = 1 GROUP BY studentID, quizzes.QuizID
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
            INNER JOIN classes
            ON quizclassassignments.ClassDetailsID = classes.ClassDetailsID
            INNER JOIN students
            ON classes.StudentID = students.StudentID
            INNER JOIN classdetails
            ON classdetails.ClassDetailsID = classes.ClassDetailsID
            WHERE students.StudentID = theStudentID AND quizclassassignments.QuizID NOT IN (SELECT QuizID FROM quizsubmissions WHERE StudentID = theStudentID)
        )subquery
        ORDER BY Caption asc, FIELD(Caption, 'Submission', 'Assignment');
END$$

 CREATE PROCEDURE `flashcard_add` (`ID` INT, `nQuestion` TEXT, `nAnswer` TEXT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #check if student owns deck
    IF EXISTS (SELECT * FROM flashcarddecks WHERE StudentID = theStudentID AND DeckID=ID) THEN
        #insert new deck
        /* SELECT * FROM flashcards WHERE DeckID=ID; */
        INSERT INTO flashcards (DeckID, Question, Answer) VALUES (ID, nQuestion, nAnswer);
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `flashcard_delete` (`ID` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #check if student owns flashcard
    IF EXISTS (SELECT * FROM flashcarddecks INNER JOIN flashcards WHERE StudentID = theStudentID AND CardID=ID) THEN
        #delete card
        DELETE FROM flashcards WHERE CardID=ID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `flashcard_get_all_by_deck` (`ID` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #check if student owns deck
    IF EXISTS (SELECT * FROM flashcarddecks WHERE StudentID = theStudentID AND DeckID=ID) THEN
        #insert new deck
        SELECT * FROM flashcards WHERE DeckID=ID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `flashcard_update` (`ID` INT, `nQuestion` TEXT, `nAnswer` TEXT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #check if student owns flashcard
    IF EXISTS (SELECT * FROM flashcarddecks INNER JOIN flashcards WHERE StudentID = theStudentID AND CardID=ID) THEN
        #update card
        UPDATE flashcards SET Question=nQuestion, Answer=nAnswer WHERE CardID=ID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `get_all_students` (`tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN
    #check if teacher
    IF EXISTS (SELECT * FROM teachers WHERE email = tEmail AND password = tPassword) THEN
        SELECT StudentID, Email, FirstName, LastName 
        FROM students;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `get_classes_by_teacher` (`tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    SELECT ClassDetailsID, Name, YearGroup FROM classdetails WHERE TeacherID = theTeacherID;
END$$

 CREATE PROCEDURE `get_students_by_class` (`classID` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
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

 CREATE PROCEDURE `get_students_classes` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #check student is in class
SELECT classdetails.Name, classdetails.ClassDetailsID, classdetails.YearGroup, teachers.FirstName, teachers.LastName FROM classes INNER JOIN classdetails ON classdetails.ClassDetailsID = classes.ClassDetailsID INNER JOIN teachers ON classdetails.TeacherID = teachers.TeacherID  WHERE classes.studentID = theStudentID;# join with student name
END$$

 CREATE PROCEDURE `get_students_coins` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    SELECT Coins FROM students WHERE email = sEmail AND password = sPassword LIMIT 1;
END$$

 CREATE PROCEDURE `get_students_xp` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    SELECT Xp FROM students WHERE email = sEmail AND password = sPassword LIMIT 1;
END$$

 CREATE PROCEDURE `get_student_details` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    /* DECLARE theStudentID int; */
    /* SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1); */
    IF EXISTS (SELECT * FROM students WHERE email = sEmail AND password = sPassword) THEN
        SELECT FirstName, LastName, Email, Xp, Level, Coins, ProfilePicture, Banner FROM students WHERE email = sEmail AND password = sPassword;
    ELSE
    ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `modules_create` (`mName` TEXT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    INSERT INTO modules
    (ModuleName, TeacherID)
    VALUES(mName, theTeacherID);
END$$

 CREATE PROCEDURE `modules_delete` (`mID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    DELETE FROM modules WHERE TeacherID = theTeacherID AND ModuleID = mID;
END$$

 CREATE PROCEDURE `modules_update` (`mID` TEXT, `nMName` TEXT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    UPDATE modules
    SET ModuleName = nMName
    WHERE TeacherID = theTeacherID AND ModuleID = mID;
END$$

 CREATE PROCEDURE `modules_view_by_teacher` (`tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    SELECT ModuleID, ModuleName FROM modules WHERE TeacherID = theTeacherID;
END$$

 CREATE PROCEDURE `Monthly_signups` ()  BEGIN
    SELECT CONCAT(UPPER(DATE_FORMAT(SignUpDate, '%b')),'-',year(SignUpDate)) AS Month, count(*) AS Num
    FROM studentsignups
    GROUP BY CONCAT(UPPER(DATE_FORMAT(SignUpDate, '%b')),'-',year(SignUpDate));
END$$

 CREATE PROCEDURE `ProfilePic_add` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `nName` VARCHAR(60), `nDetails` TEXT, `nImage` TEXT, `nCost` INT, `nReqLev` INT)  BEGIN
    #get student id
    IF EXISTS (SELECT AdminID FROM admins WHERE email = aEmail AND password = aPassword LIMIT 1) THEN
        # add profile pic
        INSERT INTO profilepictures (Name, Details, Image, Cost, RequiredLevel) VALUES (nName, nDetails, nImage, nCost, nReqLev);
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `ProfilePic_delete` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `pID` INT)  BEGIN
    #check if admin
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        DELETE FROM profilepictures WHERE ProfilePictureID = pID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `ProfilePic_edit` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `pID` INT, `nName` VARCHAR(60), `nDetails` TEXT, `nImage` TEXT, `nCost` INT, `nReqLev` INT)  BEGIN
    #get student id
    IF EXISTS (SELECT AdminID FROM admins WHERE email = aEmail AND password = aPassword LIMIT 1) THEN
        # edit banner
        Update profilepictures SET Name = nName, Details = nDetails, Image = nImage, Cost = nCost, RequiredLevel = nReqLev WHERE ProfilePictureID = pID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `ProfilePic_get_all` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);

    #get from both purchased and unpurchased themes
    SELECT * FROM
    (
        SELECT 'Unpurchased' Caption, profilepictures.ProfilePictureID, Name, Details, Image, Cost, RequiredLevel
        FROM profilepictures
        WHERE ProfilePictureID NOT IN (SELECT ProfilePictureID FROM profilepicturespurchased WHERE StudentID = theStudentID)
        UNION ALL
        SELECT 'Purchased' Caption, profilepictures.ProfilePictureID, Name, Details, Image, Cost, RequiredLevel
        FROM profilepictures 
        INNER JOIN profilepicturespurchased 
        ON profilepictures.ProfilePictureID = profilepicturespurchased.ProfilePictureID 
        WHERE StudentID = theStudentID
    ) subquery
    ORDER BY RequiredLevel asc, FIELD(Caption, 'Unpurchased', 'Purchased');
END$$

 CREATE PROCEDURE `ProfilePic_get_all_admin` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60))  BEGIN
    #get all profile pictures
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        SELECT * FROM profilepictures;
    ELSE
        ROLLBACK;
    END IF;
    END$$

 CREATE PROCEDURE `ProfilePic_get_details` (`pID` INT)  BEGIN
    # get profile pic
    SELECT * FROM profilepictures WHERE ProfilePictureID = pID LIMIT 1;
END$$

 CREATE PROCEDURE `ProfilePic_purchased` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);

    #get purchased themes
    SELECT profilepictures.ProfilePictureID, Name, Details, Image, Cost, RequiredLevel
    FROM profilepictures 
    INNER JOIN profilepicturespurchased 
    ON profilepictures.ProfilePictureID = profilepicturespurchased.ProfilePictureID 
    WHERE StudentID = theStudentID;
END$$

 CREATE PROCEDURE `ProfilePic_purchased_add` (`pID` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get values
    DECLARE theStudentID int;
    DECLARE numCoins int;
    DECLARE itemCost int;
    DECLARE sLevel int;
    DECLARE itemLevel int;

    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    SET numCoins = (SELECT Coins FROM students WHERE StudentID = theStudentID LIMIT 1);
    SET itemCost = (SELECT Cost FROM profilepictures WHERE ProfilePictureID = pID LIMIT 1);
    SET sLevel = (SELECT Level FROM students WHERE StudentID = theStudentID LIMIT 1);
    SET itemLevel = (SELECT RequiredLevel FROM profilepictures WHERE ProfilePictureID = pID LIMIT 1);

    # check if can afford
    IF (numCoins >= itemCost AND sLevel >= itemLevel) then 
        # update students coins
        UPDATE students set Coins = (numCoins-itemCost) WHERE StudentID = theStudentID;
    ELSE
        SELECT(400) AS 'Error';
    END IF;
    IF (numCoins >= itemCost AND sLevel >= itemLevel) then 
        #add purchased profile picture to table
        INSERT IGNORE INTO profilepicturespurchased (ProfilePictureID,StudentID) 
        VALUES (pID,theStudentID);
    ELSE
        ROLLBACK;
    END IF;
    
END$$

 CREATE PROCEDURE `quiz_add_question` (`theQuizID` INT, `nQuestion` TEXT, `nDetails` TEXT, `ans` TEXT)  BEGIN 
    #START TRANSACTION
        INSERT INTO quizquestions(QuizID, Question, Details,Answer)
        VALUES (theQuizID, nQuestion, nDetails, ans);
        # get the new quizzes id
        SELECT LAST_INSERT_ID();
    #COMMIT
END$$

 CREATE PROCEDURE `quiz_add_question_option` (`questID` INT, `anOption` TEXT)  BEGIN 
    INSERT INTO quizoptions(QuestionID, TheOption)
    VALUES (questID, anOption);
END$$

 CREATE PROCEDURE `quiz_all_by_teacher` (`tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 

    #get student id
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);

    SELECT QuizID, QuizName, ModuleName FROM quizzes 
    LEFT JOIN modules ON modules.ModuleID = quizzes.ModuleID
    WHERE quizzes.TeacherID = theTeacherID;

    #SELECT QuizID, QuizName, ModuleName FROM quizzes 
    #INNER JOIN teachers ON quizzes.TeacherID = teachers.TeacherID 
    #INNER JOIN modules ON modules.ModuleID = quizzes.ModuleID
    #WHERE teachers.email = tEmail AND teachers.password = tPassword;
END$$

 CREATE PROCEDURE `quiz_all_by_teacher_classID` (`cID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 

    #get student id
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);

    SELECT * FROM 
    (
        SELECT 'assigned' Caption, QuizName, ModuleName,quizzes.QuizID,DueDate FROM quizzes 
        LEFT JOIN modules ON modules.ModuleID = quizzes.ModuleID
        LEFT JOIN quizclassassignments ON quizclassassignments.QuizID = quizzes.QuizID
        WHERE quizzes.TeacherID = theTeacherID AND ClassDetailsID = cID
        UNION
        SELECT 'unassigned' Caption, QuizName, ModuleName,quizzes.QuizID,Null as DueDate FROM quizzes 
        LEFT JOIN modules ON modules.ModuleID = quizzes.ModuleID
        WHERE QuizID NOT IN (SELECT QuizID FROM quizclassassignments WHERE ClassDetailsID = cID) AND quizzes.TeacherID = theTeacherID
    ) subquery
    ORDER BY QuizName asc, FIELD(Caption, 'assigned', 'unassigned');

END$$

 CREATE PROCEDURE `quiz_answers_by_id` (`quiz_ID` INT)  BEGIN 
    SELECT QuestionID,QuizID,Answer FROM quizquestions WHERE QuizID = quiz_ID;
END$$

 CREATE PROCEDURE `quiz_create` (`QuizTitle` TEXT, `mID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    #START TRANSACTION
        INSERT INTO quizzes(QuizName, TeacherID, ModuleID)
        VALUES (QuizTitle, theTeacherID, mID);
        # get the new quizzes id
        SELECT LAST_INSERT_ID();
    #COMMIT
END$$

 CREATE PROCEDURE `quiz_delete` (`qID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    DELETE FROM quizzes WHERE QuizID = qID AND TeacherID = theTeacherID;
END$$

 CREATE PROCEDURE `quiz_delete_questions` (`qID` INT)  BEGIN 
    #START TRANSACTION
        DELETE FROM quizquestions WHERE QuizID = qID;
    #COMMIT
END$$

 CREATE PROCEDURE `quiz_question_option_view` (`quiz_ID` INT, `quest_ID` INT)  BEGIN 
    #SELECT * FROM quizzes WHERE QuizID = quid_ID;
    #SELECT * FROM quizquestions WHERE QuizID = quid_ID;
    SELECT quizquestions.QuestionID, TheOption FROM quizoptions 
    INNER JOIN quizquestions 
    ON quizquestions.QuestionID = quizoptions.QuestionID
    WHERE quizquestions.QuizID = quiz_ID AND quizquestions.QuestionID = quest_ID;
END$$

 CREATE PROCEDURE `quiz_question_view` (`quid_ID` INT)  BEGIN 
    #SELECT * FROM quizzes WHERE QuizID = quid_ID;
    SELECT * FROM quizquestions WHERE QuizID = quid_ID;
    #SELECT quizquestions.QuestionID, TheOption FROM quizoptions 
    #INNER JOIN quizquestions 
    #ON quizquestions.QuestionID = quizoptions.QuestionID
    #WHERE quizquestions.QuizID = quid_ID;
END$$

 CREATE PROCEDURE `quiz_submission_add` (`qID` INT, `qScore` INT, `nXp` INT, `nLevel` INT, `nCoins` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #DECLARE TotalXp int;
    DECLARE TotalCoins int;
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
        IF EXISTS (SELECT * FROM quizsubmissions WHERE StudentID = theStudentID AND QuizID = qID) THEN
        ROLLBACK;
    ELSE
        #insert submission
        INSERT INTO quizsubmissions(StudentID,QuizID,Score)
        VALUES (theStudentID, qID, qScore);
    END IF;
    #get xp
    #SET TotalXp = (SELECT Xp FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #get coins
    SET TotalCoins = (SELECT Coins FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #add to total
    UPDATE students
    SET Xp = nXp, Coins = TotalCoins + nCoins, level = nLevel
    WHERE StudentID = theStudentID;
END$$

 CREATE PROCEDURE `quiz_submission_get_by_assignment` (IN `qID` INT, IN `cID` INT, IN `tEmail` VARCHAR(255), IN `tPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    IF EXISTS (SELECT * FROM classdetails WHERE TeacherID = theTeacherID AND ClassDetailsID = cID) THEN
        SELECT * FROM
        (
            SELECT 'Completed' Caption, students.StudentID,email,firstname,lastname, score, subDate, rating FROM quizsubmissions 
            INNER JOIN quizclassassignments ON quizclassassignments.QuizID = quizsubmissions.QuizID 
            INNER JOIN students ON students.StudentID = quizsubmissions.StudentID
            LEFT JOIN quizratings ON students.StudentID = quizratings.StudentID AND quizratings.QuizID= quizclassassignments.QuizID
            WHERE quizclassassignments.ClassDetailsID = cID AND quizsubmissions.QuizID = qID 
            AND students.StudentID IN (SELECT StudentID FROM classes WHERE ClassDetailsID = cID)
            UNION
            SELECT 'Incompleted' Caption, students.StudentID,email,firstname,lastname, Null as score, Null as subDate, Null as rating FROM classes
            INNER JOIN students ON students.StudentID = classes.StudentID
            WHERE students.StudentID NOT IN (SELECT StudentID FROM quizsubmissions WHERE QuizID = qID) AND classes.ClassDetailsID = cID 
        )subquery
        ORDER BY Caption asc, FIELD(Caption, 'Completed', 'Incompleted');
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `quiz_submission_get_by_student` (`sID` INT, `cID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    IF EXISTS (SELECT * FROM classdetails WHERE TeacherID = theTeacherID AND ClassDetailsID = cID) THEN
        SELECT * FROM
        (
            SELECT 'Completed' Caption, score, subDate, rating, quizzes.QuizName, COUNT(quizquestions.QuizID) AS total
            FROM quizsubmissions 
            INNER JOIN quizclassassignments ON quizclassassignments.QuizID = quizsubmissions.QuizID 
            INNER JOIN quizzes ON quizclassassignments.QuizID = quizzes.QuizID 
            INNER JOIN students ON students.StudentID = quizsubmissions.StudentID
            LEFT JOIN quizratings ON students.StudentID = quizratings.StudentID AND quizratings.QuizID= quizclassassignments.QuizID
            RIGHT JOIN quizquestions ON quizsubmissions.QuizID = quizquestions.QuizID
            WHERE quizclassassignments.ClassDetailsID = cID AND students.StudentID = sID GROUP BY quizzes.QuizID 
            UNION
            SELECT 'Incomplete' Caption, NULL AS score, NULL AS subDate, NULL AS rating, quizzes.QuizName, COUNT(quizquestions.QuizID) AS total
            FROM quizclassassignments
            INNER JOIN quizzes ON quizclassassignments.QuizID = quizzes.QuizID 
            INNER JOIN classes ON classes.ClassDetailsID = quizclassassignments.ClassDetailsID
            RIGHT JOIN quizquestions ON quizclassassignments.QuizID = quizquestions.QuizID
            WHERE classes.StudentID NOT IN (SELECT StudentID FROM quizsubmissions WHERE QuizID = quizzes.QuizID) AND quizclassassignments.ClassDetailsID = cID AND classes.StudentID = sID 			
            GROUP BY quizzes.QuizID 
        )subquery
        ORDER BY Caption asc, FIELD(Caption, 'Completed', 'Incompleted');
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `quiz_submission_share` (`qID` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    UPDATE quizsubmissions 
    SET IsShared = 1
    WHERE StudentID = theStudentID AND QuizID = qID;
END$$

 CREATE PROCEDURE `quiz_submission_share_delete` (`qID` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    UPDATE quizsubmissions 
    SET IsShared = 0
    WHERE StudentID = theStudentID AND QuizID = qID;
END$$

 CREATE PROCEDURE `quiz_update` (`qID` INT, `QuizTitle` TEXT, `mID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    #START TRANSACTION
        UPDATE quizzes 
        SET QuizName = QuizTitle, ModuleID = mID, TeacherID = theTeacherID 
        WHERE QuizID = qID;
    #COMMIT
END$$

 CREATE PROCEDURE `quiz_view` (`quid_ID` INT)  BEGIN 
    SELECT * FROM quizzes WHERE QuizID = quid_ID;
    #SELECT * FROM quizquestions WHERE QuizID = quid_ID;
    #SELECT quizquestions.QuestionID, TheOption FROM quizoptions 
    #INNER JOIN quizquestions 
    #ON quizquestions.QuestionID = quizoptions.QuestionID
    #WHERE quizquestions.QuizID = quid_ID;
END$$

 CREATE PROCEDURE `rating_create` (`qID` INT, `qRating` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #create rating
    INSERT IGNORE INTO quizratings (StudentID, QuizID, Rating)
    VALUES (theStudentID,qID,qRating);
END$$

 CREATE PROCEDURE `rating_quiz_ave` (`qID` INT)  BEGIN
    #get average rating
    SELECT AVG(Rating) AS AverageRating FROM quizratings WHERE QuizID = qID;
END$$

 CREATE PROCEDURE `remove_student_from_class` (`cDetailsID` INT, `sID` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN 
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

 CREATE PROCEDURE `search_students` (`tEmail` VARCHAR(255), `tPassword` VARCHAR(60), `sTerm` TEXT)  BEGIN
    IF EXISTS (SELECT * FROM teachers WHERE email = tEmail AND password = tPassword) THEN
        SELECT StudentID, Email, FirstName, LastName 
        FROM students 
        WHERE Email LIKE CONCAT('%', sTerm , '%') 
        OR FirstName LIKE CONCAT('%', sTerm , '%') 
        OR LastName LIKE CONCAT('%', sTerm , '%');
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `student_edit_password` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `nPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = aEmail AND password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE email = aEmail AND password = aPassword) THEN
        #edit password
        Update students SET Password = nPassword WHERE StudentID = theStudentID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `teacher_edit_password` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `nPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = aEmail AND password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM teachers WHERE email = aEmail AND password = aPassword) THEN
        #edit password
        Update teachers SET Password = nPassword WHERE TeacherID = theTeacherID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `teacher_get_students_by_class` (IN `classID` INT, IN `tEmail` VARCHAR(255), IN `tPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    #check student is in class
    IF EXISTS (SELECT * FROM classes INNER JOIN classdetails ON classdetails.ClassDetailsID = classes.ClassDetailsID WHERE TeacherID = 2 AND classes.ClassDetailsID=1) THEN
        SELECT classes.StudentID,Email, FirstName,LastName FROM classes INNER JOIN students ON students.StudentID = classes.StudentID WHERE classes.ClassDetailsID = classID;# join with student name
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Themes_add` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `tName` VARCHAR(60), `tDetails` TEXT, `tPrColor` VARCHAR(15), `tBgColor` VARCHAR(15), `tBnTextColor` VARCHAR(15), `tIsDark` VARCHAR(15), `tCost` INT, `tReqLev` INT)  BEGIN
    #check if admin
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        INSERT INTO themes (Name, Details, PrimaryColor, BackgroundColor, BtnTextColor, IsDark, Cost, RequiredLevel)
        VALUES (tName, tDetails, tPrColor, tBgColor, tBnTextColor, tIsDark, tCost, tReqLev);
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Themes_delete` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `tID` INT)  BEGIN
    #check if admin
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        DELETE FROM themes WHERE ThemeID = tID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Themes_details` (`tID` INT)  BEGIN
    SELECT * FROM themes WHERE ThemeID=tID LIMIT 1;
END$$

 CREATE PROCEDURE `Themes_edit` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60), `tID` INT, `tName` VARCHAR(60), `tDetails` TEXT, `tPrColor` VARCHAR(15), `tBgColor` VARCHAR(15), `tBnTextColor` VARCHAR(15), `tIsDark` VARCHAR(15), `tCost` INT, `tReqLev` INT)  BEGIN
    #check if admin
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        Update themes 
        SET Name = tName, Details = tDetails, PrimaryColor = tPrColor, BackgroundColor = tBgColor, BtnTextColor = tBnTextColor, IsDark = tIsDark, Cost = tCost, RequiredLevel = tReqLev
        WHERE ThemeID = tID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Themes_get_all` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);

    #get from both purchased and unpurchased themes
    SELECT * FROM
    (
        SELECT 'Unpurchased' Caption, themes.ThemeID, Name, Details, PrimaryColor, BackgroundColor, BtnTextColor, IsDark, Cost, RequiredLevel
        FROM themes
        WHERE ThemeID NOT IN (SELECT ThemeID FROM themespurchased WHERE StudentID = theStudentID)
        UNION ALL
        SELECT 'Purchased' Caption, themes.ThemeID, Name, Details, PrimaryColor, BackgroundColor, BtnTextColor, IsDark, Cost, RequiredLevel
        FROM themes 
        INNER JOIN themespurchased 
        ON themes.ThemeID = themespurchased.ThemeID 
        WHERE StudentID = theStudentID
    ) subquery
    ORDER BY RequiredLevel asc, FIELD(Caption, 'Unpurchased', 'Purchased');
END$$

 CREATE PROCEDURE `Themes_get_all_admin` (`aEmail` VARCHAR(255), `aPassword` VARCHAR(60))  BEGIN
    #get all themes
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        SELECT * FROM themes;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `Themes_purchased` (`sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);

    #get purchased themes
    SELECT themes.ThemeID, Name, Details, PrimaryColor, BackgroundColor, BtnTextColor, IsDark, Cost, RequiredLevel
    FROM themes 
    INNER JOIN themespurchased 
    ON themes.ThemeID = themespurchased.ThemeID 
    WHERE StudentID = theStudentID;
END$$

 CREATE PROCEDURE `Themes_purchased_add` (`tID` INT, `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    #get values
    DECLARE theStudentID int;
    DECLARE numCoins int;
    DECLARE itemCost int;
    DECLARE sLevel int;
    DECLARE itemLevel int;

    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    SET numCoins = (SELECT Coins FROM students WHERE StudentID = theStudentID LIMIT 1);
    SET itemCost = (SELECT Cost FROM themes WHERE ThemeID = tID LIMIT 1);
    SET sLevel = (SELECT Level FROM students WHERE StudentID = theStudentID LIMIT 1);
    SET itemLevel = (SELECT RequiredLevel FROM themes WHERE ThemeID = tID LIMIT 1);


    # check if can afford
    IF (numCoins >= itemCost AND sLevel >= itemLevel) then 
        # update students coins
        UPDATE students set Coins = (numCoins-itemCost) WHERE StudentID = theStudentID;
    ELSE
        SELECT(400) AS 'Error';
    END IF;
    IF (numCoins >= itemCost AND sLevel >= itemLevel) then 
        #add purchased theme to table
        INSERT IGNORE INTO themespurchased (ThemeID,StudentID) 
        VALUES (tID,theStudentID);
    ELSE
        ROLLBACK;
    END IF;
    
END$$

 CREATE PROCEDURE `update_banner` (`nBanner` VARCHAR(255), `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE email = sEmail AND password = sPassword) THEN
        UPDATE students SET Banner = nBanner  WHERE StudentID = theStudentID AND password = sPassword LIMIT 1;
    ELSE
    ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `update_class` (`cDetailsID` INT, `cName` VARCHAR(60), `cYearGroup` INT, `tEmail` VARCHAR(255), `tPassword` VARCHAR(60))  BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    IF EXISTS (SELECT * FROM teachers WHERE email = tEmail AND password = tPassword) THEN
        UPDATE classdetails 
        SET Name = cName, YearGroup = cYearGroup 
        WHERE TeacherID = theTeacherID AND ClassDetailsID = cDetailsID;
    ELSE
        ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `update_profile_picture` (`nProfilePicture` VARCHAR(255), `sEmail` VARCHAR(255), `sPassword` VARCHAR(60))  BEGIN
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE email = sEmail AND password = sPassword) THEN
        UPDATE students SET ProfilePicture = nProfilePicture  WHERE StudentID = theStudentID AND password = sPassword LIMIT 1;
    ELSE
    ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `update_student` (`oEmail` VARCHAR(255), `oPassword` VARCHAR(60), `nfName` VARCHAR(60), `nlName` VARCHAR(60), `nEmail` VARCHAR(255))  BEGIN
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = oEmail AND password = oPassword LIMIT 1);
    IF EXISTS (SELECT * FROM students WHERE email = oEmail AND password = oPassword) THEN
        UPDATE students SET Email = nEmail, FirstName = nfName, LastName = nlName WHERE StudentID = theStudentID AND password = oPassword LIMIT 1;
    ELSE
    ROLLBACK;
    END IF;
END$$

 CREATE PROCEDURE `update_teacher` (`oEmail` VARCHAR(255), `oPassword` VARCHAR(60), `nfName` VARCHAR(60), `nlName` VARCHAR(60), `nEmail` VARCHAR(255), `nfNumber` VARCHAR(13))  BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = oEmail AND password = oPassword LIMIT 1);
    IF EXISTS (SELECT * FROM teachers WHERE email = oEmail AND password = oPassword) THEN
        UPDATE teachers SET Email = nEmail, FirstName = nfName, LastName = nlName, PhoneNumber=nfNumber WHERE TeacherID = theTeacherID;
    ELSE
    ROLLBACK;
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `AdminID` int NOT NULL,
  `Email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `FirstName` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `LastName` varchar(60) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`AdminID`, `Email`, `Password`, `FirstName`, `LastName`) VALUES
(1, 'first@admin.com', '$2b$10$RyeQ5sybYQBcSVTs6r7SquLyEZGt9nIZSFWuSZlsEHIxU/FesBkba', 'first2', 'admin2'),
(3, 'admin2@email.com', '$2b$10$3OP1cbNCEB4eXDnOy1AsXOypruB5fQypRhOWSsuUEfKHWe6uKwTHq', 'The', 'Admin'),
(4, 'admin3@email.com', '$2b$10$h95I6fKFCP4QuId5NpvzDeYYNVlO9y8KUvPlQ7WX0EAcseG3WaHC.', 'the', 'admin'),
(5, 'email2@admin.com', '$2b$10$oQQ.a2EPr.lPH9EeDIWdAO.O.nd.BQcs.GOW./ySjKs59LK9DVd72', 'Bob', 'Robert');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `BannerID` int NOT NULL,
  `Name` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `Details` text COLLATE utf8_unicode_ci,
  `Image` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Cost` int NOT NULL DEFAULT '0',
  `RequiredLevel` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`BannerID`, `Name`, `Details`, `Image`, `Cost`, `RequiredLevel`) VALUES
(1, 'Blue Mountain Range', 'A blue mountain range', 'https://cdn.pixabay.com/photo/2017/03/31/16/11/banner-2191712_960_720.jpg', 100, 2),
(2, 'Black and Red', 'Black and red arrows', 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 0, 1),
(3, 'Mountains', NULL, 'https://cdn.pixabay.com/photo/2017/03/19/12/42/banner-2156395_960_720.jpg', 0, 1),
(4, 'Alien world', NULL, 'https://img.freepik.com/free-vector/space-banner-with-purple-planet-landscape_107791-6230.jpg?w=2000', 0, 1),
(5, 'Space', NULL, 'https://images.wallpaperscraft.com/image/single/stars_space_galaxy_117958_2560x1024.jpg', 0, 1),
(6, 'Grey/Orange/Yellow', 'Grey, Orange and Yellow', 'https://www.kindpng.com/picc/m/267-2675124_new-banner-design-png-transparent-png.png', 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `bannerspurchased`
--

CREATE TABLE `bannerspurchased` (
  `BannerID` int NOT NULL,
  `StudentID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `bannerspurchased`
--

INSERT INTO `bannerspurchased` (`BannerID`, `StudentID`) VALUES
(1, 8),
(4, 8),
(5, 8),
(1, 11),
(2, 11),
(3, 11),
(4, 11),
(5, 11),
(6, 11),
(3, 310),
(5, 310),
(6, 310);

-- --------------------------------------------------------

--
-- Table structure for table `classdetails`
--

CREATE TABLE `classdetails` (
  `ClassDetailsID` int NOT NULL,
  `Name` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `YearGroup` int DEFAULT NULL,
  `TeacherID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `classdetails`
--

INSERT INTO `classdetails` (`ClassDetailsID`, `Name`, `YearGroup`, `TeacherID`) VALUES
(1, 'Class1', 3, 2),
(3, 'class2', 5, 1),
(25, 'Algebra', 5, 8),
(26, 'Maths', 10, 8),
(27, 'English', 6, 8),
(40, 'Sci', 4, 8),
(49, 'sci101', 10, 8),
(344, 'Science', 5, 5),
(345, 'maths ', 1, 333);

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `StudentID` int NOT NULL,
  `ClassDetailsID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`StudentID`, `ClassDetailsID`) VALUES
(1, 1),
(2, 1),
(8, 1),
(1, 3),
(6, 3),
(8, 3),
(11, 25),
(310, 25),
(1, 26),
(11, 26),
(11, 27),
(21, 27),
(23, 27),
(1, 40),
(2, 40),
(6, 40),
(8, 40),
(11, 40),
(12, 40),
(18, 40),
(21, 40),
(22, 40),
(11, 49),
(310, 49),
(11, 344),
(11, 345);

-- --------------------------------------------------------

--
-- Table structure for table `classrequests`
--

CREATE TABLE `classrequests` (
  `StudentID` int NOT NULL,
  `ClassDetailsID` int NOT NULL,
  `DateSent` date NOT NULL DEFAULT (curdate())
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `classrequests`
--

INSERT INTO `classrequests` (`StudentID`, `ClassDetailsID`) VALUES
(1, 25),
(2, 25),
(6, 25),
(8, 25),
(12, 25),
(18, 25),
(21, 25),
(22, 25),
(23, 25),
(12, 26),
(18, 26),
(12, 27),
(18, 27),
(1, 344),
(12, 344),
(1, 345),
(2, 345);

-- --------------------------------------------------------

--
-- Table structure for table `flashcarddecks`
--

CREATE TABLE `flashcarddecks` (
  `DeckID` int NOT NULL,
  `Name` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `StudentID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `flashcarddecks`
--

INSERT INTO `flashcarddecks` (`DeckID`, `Name`, `StudentID`) VALUES
(2, 'changed', 1),
(10, 'Trig', 8),
(11, 'Algibra', 8),
(12, 'test3', 8),
(13, 'Maths1', 11),
(14, 'English 1', 11),
(15, 'Art', 11),
(16, 'Sci', 11),
(22, 'sci 2', 11),
(24, 'sci', 47),
(25, 'sa', 310);

-- --------------------------------------------------------

--
-- Table structure for table `flashcards`
--

CREATE TABLE `flashcards` (
  `CardID` int NOT NULL,
  `DeckID` int NOT NULL,
  `Question` text COLLATE utf8_unicode_ci NOT NULL,
  `Answer` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `flashcards`
--

INSERT INTO `flashcards` (`CardID`, `DeckID`, `Question`, `Answer`) VALUES
(2, 12, '10*100', '1000'),
(4, 12, 'aaa', 'bbb'),
(5, 12, '300+1', '301'),
(6, 13, '9*3=?', '20'),
(7, 11, '5x=10', 'x = 2'),
(8, 10, 'sin(x)', 'H/O'),
(12, 13, '5*5', '25'),
(13, 13, '10*10', '100'),
(14, 13, '12/4', '3'),
(16, 14, 'should you read books?', 'yes'),
(17, 11, '5x = 25', '5'),
(19, 14, 'How do you spell dog?', 'dog'),
(24, 24, 'Front', 'back'),
(25, 25, 'as', 's');

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `ModuleID` int NOT NULL,
  `ModuleName` text COLLATE utf8_unicode_ci NOT NULL,
  `TeacherID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`ModuleID`, `ModuleName`, `TeacherID`) VALUES
(2, 'changed name', 8),
(3, 'test module', 8),
(4, 'test module', 8),
(5, 'test module', 8),
(6, 'test module', 8),
(7, 'maths', 8),
(8, 'science 0', 8),
(9, 'science 1', 8),
(10, 'testing testing', 8),
(11, 'adc', 8),
(12, 'english', 8),
(13, 'module', 8),
(14, 'another module', 8),
(15, 'Algibra', 8),
(16, 'brain science', 8),
(17, 'science 2', 8),
(18, 'math', 333),
(19, '%%%%%', 8),
(20, 'Module1', 8);

-- --------------------------------------------------------

--
-- Table structure for table `profilepictures`
--

CREATE TABLE `profilepictures` (
  `ProfilePictureID` int NOT NULL,
  `Name` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `Details` text COLLATE utf8_unicode_ci,
  `Image` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Cost` int NOT NULL DEFAULT '0',
  `RequiredLevel` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `profilepictures`
--

INSERT INTO `profilepictures` (`ProfilePictureID`, `Name`, `Details`, `Image`, `Cost`, `RequiredLevel`) VALUES
(1, 'Alien', 'Green alien', 'https://cdn-icons-png.flaticon.com/512/196/196681.png', 0, 1),
(2, 'Brown Long hair', 'Person with brown long hair', 'https://cdn-icons-png.flaticon.com/512/219/219969.png', 100, 1),
(3, 'Brown Short hair', 'Person with brown short hair', 'https://cdn-icons-png.flaticon.com/512/219/219986.png', 80, 1),
(4, 'Grey hair up', NULL, 'https://cdn-icons-png.flaticon.com/512/219/219982.png', 300, 5),
(5, 'Police', NULL, 'https://cdn-icons-png.flaticon.com/512/190/190627.png', 800, 15),
(6, 'Swat', NULL, 'https://cdn-icons-png.flaticon.com/512/190/190634.png', 1000, 20),
(7, 'astronaut', NULL, 'https://cdn-icons-png.flaticon.com/512/196/196683.png', 1500, 21),
(8, 'Alien 2', NULL, 'https://cdn-icons-png.flaticon.com/512/196/196680.png', 1800, 25),
(9, 'Alien 3', NULL, 'https://cdn-icons-png.flaticon.com/512/196/196679.png', 1600, 21),
(10, 'Space Rocket', NULL, 'https://cdn-icons-png.flaticon.com/512/196/196687.png', 200, 2),
(11, 'Space Rocket 2', NULL, 'https://cdn-icons-png.flaticon.com/512/196/196693.png', 200, 2),
(12, 'Planet', NULL, 'https://cdn-icons-png.flaticon.com/512/196/196682.png', 250, 3),
(13, 'Soldier 1', NULL, 'https://cdn-icons-png.flaticon.com/512/194/194929.png', 1100, 20),
(14, 'Soldier 2', NULL, 'https://cdn-icons-png.flaticon.com/512/194/194930.png', 1100, 20),
(15, 'Doctor 1', NULL, 'https://cdn-icons-png.flaticon.com/512/194/194916.png', 1000, 21),
(16, 'Doctor 2', NULL, 'https://cdn-icons-png.flaticon.com/512/194/194915.png', 1000, 21);

-- --------------------------------------------------------

--
-- Table structure for table `profilepicturespurchased`
--

CREATE TABLE `profilepicturespurchased` (
  `ProfilePictureID` int NOT NULL,
  `StudentID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `profilepicturespurchased`
--

INSERT INTO `profilepicturespurchased` (`ProfilePictureID`, `StudentID`) VALUES
(1, 8),
(2, 8),
(3, 8),
(1, 11),
(2, 11),
(3, 11),
(4, 11),
(10, 11),
(11, 11),
(12, 11),
(1, 310),
(3, 310);

-- --------------------------------------------------------

--
-- Table structure for table `quizassignments`
--

CREATE TABLE `quizassignments` (
  `StudentID` int NOT NULL,
  `QuizID` int NOT NULL,
  `DueDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quizclassassignments`
--

CREATE TABLE `quizclassassignments` (
  `ClassDetailsID` int NOT NULL,
  `QuizID` int NOT NULL,
  `DueDate` datetime NOT NULL,
  `Xp` int NOT NULL DEFAULT (0),
  `Coins` int NOT NULL DEFAULT (0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `quizclassassignments`
--
/* TODO:CHanged */
INSERT INTO `quizclassassignments` (`ClassDetailsID`, `QuizID`, `DueDate`, `Xp`, `Coins`) VALUES
(25, 80, '2022-06-02 00:00:00', 200, 50),
(25, 81, '2022-05-24 00:00:00', 200, 50),
(25, 86, '2022-05-30 00:00:00', 200, 50),
(25, 87, '2022-05-19 00:00:00', 200, 50),
(25, 115, '2022-05-26 00:00:00', 200, 50),
(25, 120, '2022-06-03 00:00:00', 200, 50),
(26, 86, '2022-05-26 00:00:00', 200, 50),
(49, 80, '2022-05-19 00:00:00', 200, 50),
(345, 117, '2022-06-02 00:00:00', 200, 50);

-- --------------------------------------------------------

--
-- Table structure for table `quizoptions`
--

CREATE TABLE `quizoptions` (
  `QuizOptionsID` int NOT NULL,
  `QuestionID` int NOT NULL,
  `TheOption` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `quizoptions`
--

INSERT INTO `quizoptions` (`QuizOptionsID`, `QuestionID`, `TheOption`) VALUES
(301, 138, '20'),
(302, 138, '100'),
(303, 138, '5'),
(304, 139, '3'),
(305, 140, '3'),
(306, 139, '7'),
(307, 139, '10'),
(308, 140, '2'),
(309, 140, '6'),
(360, 177, '23'),
(361, 179, '46'),
(362, 178, '87'),
(363, 178, '231'),
(364, 177, '132'),
(365, 177, '121'),
(366, 179, '45'),
(367, 179, '-45'),
(368, 177, '112'),
(369, 180, 'bog'),
(370, 180, 'dog'),
(371, 180, 'god'),
(372, 181, 'pigg'),
(373, 181, 'pig'),
(390, 190, '43'),
(391, 190, '50'),
(392, 191, '19'),
(393, 191, '90'),
(394, 192, 'green'),
(395, 192, 'purple'),
(396, 192, 'orange'),
(399, 194, '2'),
(400, 194, '5'),
(401, 194, '4'),
(402, 195, '4'),
(403, 195, '8'),
(404, 195, '7'),
(407, 198, 'd'),
(408, 198, 'a');

-- --------------------------------------------------------

--
-- Table structure for table `quizquestions`
--

CREATE TABLE `quizquestions` (
  `QuestionID` int NOT NULL,
  `QuizID` int NOT NULL,
  `Question` text COLLATE utf8_unicode_ci NOT NULL,
  `Details` text COLLATE utf8_unicode_ci,
  `Answer` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `quizquestions`
--

INSERT INTO `quizquestions` (`QuestionID`, `QuizID`, `Question`, `Details`, `Answer`) VALUES
(138, 87, '10*10', '??', '100'),
(139, 87, '7+3', '???', '10'),
(140, 87, '1+1', '?', '2'),
(177, 86, '12 x 11', '', '132'),
(178, 86, '77*3', '', '0'),
(179, 86, '45 * 1', 'a', '46'),
(180, 81, 'How do you spell dog?', 'woof', 'dog'),
(181, 81, 'How do you spell pig', '', 'pig'),
(190, 80, '40+3', '', '43'),
(191, 80, '10+9', '', '19'),
(192, 115, 'What does red and blue make?', '', 'purple'),
(194, 117, '1+1', '', '2'),
(195, 117, '5+3', '', '8'),
(198, 120, 'a', 's', 'd');

-- --------------------------------------------------------

--
-- Table structure for table `quizratings`
--

CREATE TABLE `quizratings` (
  `StudentID` int NOT NULL,
  `QuizID` int NOT NULL,
  `Rating` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `quizratings`
--

INSERT INTO `quizratings` (`StudentID`, `QuizID`, `Rating`) VALUES
(11, 80, 4),
(11, 81, 4),
(11, 86, 2),
(11, 87, 5),
(11, 115, 5),
(11, 117, 5),
(310, 80, 5),
(310, 86, 4),
(310, 87, 1),
(310, 115, 3),
(310, 120, 2);

-- --------------------------------------------------------

--
-- Table structure for table `quizsubmissions`
--

CREATE TABLE `quizsubmissions` (
  `StudentID` int NOT NULL,
  `QuizID` int NOT NULL,
  `Score` int NOT NULL DEFAULT '0',
  `SubDate` date NOT NULL DEFAULT (curdate()),
  `IsShared` bit(1) NOT NULL DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `quizsubmissions`
--

INSERT INTO `quizsubmissions` (`StudentID`, `QuizID`, `Score`, `IsShared`) VALUES
(11, 80, 1, b'0'),
(11, 81, 1, b'0'),
(11, 86, 0, b'0'),
(11, 87, 3, b'1'),
(11, 115, 1, b'0'),
(11, 117, 1, b'0'),
(310, 80, 2, b'0'),
(310, 81, 1, b'0'),
(310, 86, 2, b'0'),
(310, 87, 1, b'0'),
(310, 115, 1, b'0'),
(310, 120, 1, b'0');

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `QuizID` int NOT NULL,
  `QuizName` text COLLATE utf8_unicode_ci NOT NULL,
  `TeacherID` int DEFAULT NULL,
  `ModuleID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`QuizID`, `QuizName`, `TeacherID`, `ModuleID`) VALUES
(1, 'test', 1, NULL),
(80, 'Foundation Maths', 8, 7),
(81, 'Spelling test 1', 8, 12),
(86, 'Multiplication', 8, 7),
(87, 'Maths', 8, NULL),
(115, 'Art', 8, NULL),
(117, 'fist maths', 333, 18),
(120, 'a', 8, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `StudentID` int NOT NULL,
  `Email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `FirstName` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `LastName` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `Xp` int NOT NULL DEFAULT '0',
  `Level` int NOT NULL DEFAULT '1',
  `Coins` int NOT NULL DEFAULT '0',
  `Banner` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg',
  `ProfilePicture` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`StudentID`, `Email`, `FirstName`, `LastName`, `Password`, `Xp`, `Level`, `Coins`, `Banner`, `ProfilePicture`) VALUES
(1, 'email@email.com', 'firstName', 'lastName', 'password', 0, 3, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(2, 'email1@email.com', 'firstName', 'lastName', 'password', 0, 3, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(6, 'undefined', 'undefined', 'undefined', '$2b$10$.a6c8qVWQm8oZ77bJDVQnupa8oI3Mrhg4K8yZSfKjEfeZtpbEByoG', 0, 1, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(8, 'email2@email.com', 'theFirstName', 'changedlast', '$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K', 1741, 24, 222, 'https://cdn.pixabay.com/photo/2017/03/31/16/11/banner-2191712_960_720.jpg', 'https://cdn-icons-png.flaticon.com/512/219/219986.png'),
(11, 'email20@email.com', 'first', 'last', '$2b$10$EGzkpQ1JGIKtzvksG3Yonu0Nem2BZZdmfzhWgjAlgul0YXR8iNNZG', 1095, 5, 1999, 'https://cdn.pixabay.com/photo/2017/03/31/16/11/banner-2191712_960_720.jpg', 'https://cdn-icons-png.flaticon.com/512/196/196681.png'),
(12, 'email55@email.com', 'f1', 'l1', '$2b$10$PnF4E2Qvq048T4HdVJUFZeXoj1BMDP3jHU/vOa.YQwcK6sinn.Xnu', 0, 1, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(18, 'email11@email.com', 'a', 'a', '$2b$10$UX6ZO11XXBncccUJUqmXNOSpf2HvDJXu..dfwDS7RlPIJBzA8KmcW', 0, 1, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(21, 'email12@email.com', 'new', 'l', '$2b$10$s45syuyORlEbmf2Y.PbaouehYM2WjAS8WOTxqni8pTJp1ClYHa8Xu', 0, 1, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(22, 'email77@email.com', 'john', 'smith', '$2b$10$k0yI7za6v3dce1EaO7jSSO2CM7Zr/b8YVJjqWDq0cu0K5Iu0nXoI2', 0, 1, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(23, 'test@email.com', 'testing', 'testing', '$2b$10$2RZrsbcWQiMhUEpwdD3dTearVb0ob1UJHKO0T2V7HE9u/8NzDg4uy', 0, 1, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(26, 'changePassword@student.com', 'a', 'v', '$2b$10$b1sPaHSrDl0TJKoyeqST...ytreMuJANzam/zeyYa3YTco1DQXobq', 0, 1, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(36, 'email100@email.com', 'B', 'S', '$2b$10$ihWdu9S0L2liGkiXl/HidOqNp9GsIOx/YbKwcLYUPV4GPL/BsnqtK', 0, 1, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(37, 'abc@email.com', 'John', 'Smith', '$2b$10$b1yXpnJwqcxq2IFO4eQPlesYE1/7iUM0l/gmGHk3hXwiBQVBoo.Xe', 0, 1, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(45, 'abc2@emial.com', 'jasdadasd', 'asdada', '$2b$10$ZGkgz2HA00arMJsh7VJTzeaxhYeFCkc2AAWi9gJ6Lx5mdBtINq9TS', 0, 1, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(47, 'email200@email.com', 'John', 'Smith', '$2b$10$5fCMdPDLkbUWDmjxTyYkN.3p5OgMkco9HkRoXPkbY.vJnOMngfHMy', 100, 1, 10, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(58, 'email300@email.com', 'a', 'a', '$2b$10$0rPMWH68RRT.dcvu13has.7n10Yj7VcdrEvIj3JbFUDna/QYhOgDO', 0, 1, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(61, 't@email.com', 'a', 'a', '$2b$10$QXuIlsTye5UVgWgaAjQKCOY3IChLpGri/H8r0mpvTAME9XMS1UAeK', 0, 1, 0, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(309, 'cypress@student.com', 'cypress', 'testing', '$2b$10$jSKZxtaJ5e.YP7HLuGhmTu0DNfOV2XoUdAV.fdB5d/Z4ChkVCfR9y', 750, 4, 750, 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg', 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png'),
(310, 'show@email.com', 'j', 'a', '$2b$10$9kULm7hc4DVbQi/gfoST9eYGlJSi5wRlu5V1zm6TnrptHplsSRJRW', 204, 2, 70, 'https://www.kindpng.com/picc/m/267-2675124_new-banner-design-png-transparent-png.png', 'https://cdn-icons-png.flaticon.com/512/219/219986.png');

--
-- Triggers `students`
--
DELIMITER $$
CREATE TRIGGER `tr_ins_student` AFTER INSERT ON `students` FOR EACH ROW BEGIN
INSERT INTO studentsignups (StudentID,SignUpDate) VALUES (new.StudentID,curdate());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `studentsignups`
--

CREATE TABLE `studentsignups` (
  `StudentSignupID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `SignUpDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `studentsignups`
--

INSERT INTO `studentsignups` (`StudentSignupID`, `StudentID`, `SignUpDate`) VALUES
(1, 1, '2022-01-12'),
(2, 2, '2022-02-02'),
(3, 6, '2022-02-03'),
(4, 12, '2022-03-03'),
(5, 36, '2022-04-29'),
(6, 37, '2022-04-30'),
(7, 45, '2022-04-30'),
(8, NULL, '2022-04-30'),
(9, 47, '2022-05-07'),
(10, 58, '2022-05-08'),
(11, NULL, '2022-05-09'),
(12, 61, '2022-05-09'),
(13, NULL, '2022-05-10'),
(14, NULL, '2022-05-10'),
(15, NULL, '2022-05-10'),
(16, NULL, '2022-05-10'),
(17, NULL, '2022-05-10'),
(18, NULL, '2022-05-10'),
(19, NULL, '2022-05-10'),
(20, NULL, '2022-05-10'),
(21, NULL, '2022-05-10'),
(22, NULL, '2022-05-10'),
(23, NULL, '2022-05-10'),
(24, NULL, '2022-05-10'),
(25, NULL, '2022-05-10'),
(26, NULL, '2022-05-10'),
(27, NULL, '2022-05-10'),
(28, NULL, '2022-05-10'),
(29, NULL, '2022-05-10'),
(30, NULL, '2022-05-10'),
(31, NULL, '2022-05-10'),
(32, NULL, '2022-05-10'),
(33, NULL, '2022-05-10'),
(34, NULL, '2022-05-10'),
(35, NULL, '2022-05-10'),
(36, NULL, '2022-05-10'),
(37, NULL, '2022-05-10'),
(38, NULL, '2022-05-10'),
(39, NULL, '2022-05-10'),
(40, NULL, '2022-05-10'),
(41, NULL, '2022-05-10'),
(42, NULL, '2022-05-10'),
(43, NULL, '2022-05-10'),
(44, NULL, '2022-05-10'),
(45, NULL, '2022-05-10'),
(46, NULL, '2022-05-10'),
(47, NULL, '2022-05-10'),
(48, NULL, '2022-05-10'),
(49, NULL, '2022-05-10'),
(50, NULL, '2022-05-10'),
(51, NULL, '2022-05-10'),
(52, NULL, '2022-05-10'),
(53, NULL, '2022-05-10'),
(54, NULL, '2022-05-10'),
(55, NULL, '2022-05-10'),
(56, NULL, '2022-05-10'),
(57, NULL, '2022-05-10'),
(58, NULL, '2022-05-10'),
(59, NULL, '2022-05-10'),
(60, NULL, '2022-05-10'),
(61, NULL, '2022-05-10'),
(62, NULL, '2022-05-10'),
(63, NULL, '2022-05-10'),
(64, NULL, '2022-05-10'),
(65, NULL, '2022-05-10'),
(66, NULL, '2022-05-10'),
(67, NULL, '2022-05-10'),
(68, NULL, '2022-05-10'),
(69, NULL, '2022-05-10'),
(70, NULL, '2022-05-10'),
(71, NULL, '2022-05-10'),
(72, NULL, '2022-05-10'),
(73, NULL, '2022-05-10'),
(74, NULL, '2022-05-10'),
(75, NULL, '2022-05-10'),
(76, NULL, '2022-05-10'),
(77, NULL, '2022-05-10'),
(78, NULL, '2022-05-10'),
(79, NULL, '2022-05-10'),
(80, NULL, '2022-05-10'),
(81, NULL, '2022-05-10'),
(82, NULL, '2022-05-10'),
(83, NULL, '2022-05-10'),
(84, NULL, '2022-05-10'),
(85, NULL, '2022-05-10'),
(86, NULL, '2022-05-10'),
(87, NULL, '2022-05-10'),
(88, NULL, '2022-05-10'),
(89, NULL, '2022-05-10'),
(90, NULL, '2022-05-10'),
(91, NULL, '2022-05-10'),
(92, NULL, '2022-05-10'),
(93, NULL, '2022-05-10'),
(94, NULL, '2022-05-10'),
(95, NULL, '2022-05-10'),
(96, NULL, '2022-05-10'),
(97, NULL, '2022-05-10'),
(98, NULL, '2022-05-10'),
(99, NULL, '2022-05-10'),
(100, NULL, '2022-05-10'),
(101, NULL, '2022-05-10'),
(102, NULL, '2022-05-10'),
(103, NULL, '2022-05-10'),
(104, NULL, '2022-05-10'),
(105, NULL, '2022-05-10'),
(106, NULL, '2022-05-10'),
(107, NULL, '2022-05-10'),
(108, NULL, '2022-05-10'),
(109, NULL, '2022-05-10'),
(110, NULL, '2022-05-10'),
(111, NULL, '2022-05-10'),
(112, NULL, '2022-05-10'),
(113, NULL, '2022-05-10'),
(114, NULL, '2022-05-10'),
(115, NULL, '2022-05-10'),
(116, NULL, '2022-05-10'),
(117, NULL, '2022-05-10'),
(118, NULL, '2022-05-10'),
(119, NULL, '2022-05-10'),
(120, NULL, '2022-05-10'),
(121, NULL, '2022-05-10'),
(122, NULL, '2022-05-10'),
(123, NULL, '2022-05-10'),
(124, NULL, '2022-05-10'),
(125, NULL, '2022-05-10'),
(126, NULL, '2022-05-10'),
(127, NULL, '2022-05-10'),
(128, NULL, '2022-05-10'),
(129, NULL, '2022-05-10'),
(130, NULL, '2022-05-10'),
(131, NULL, '2022-05-10'),
(132, NULL, '2022-05-10'),
(133, NULL, '2022-05-10'),
(134, NULL, '2022-05-10'),
(135, NULL, '2022-05-10'),
(136, NULL, '2022-05-10'),
(137, NULL, '2022-05-10'),
(138, NULL, '2022-05-10'),
(139, NULL, '2022-05-10'),
(140, NULL, '2022-05-10'),
(141, NULL, '2022-05-10'),
(142, NULL, '2022-05-10'),
(143, NULL, '2022-05-10'),
(144, NULL, '2022-05-10'),
(145, NULL, '2022-05-10'),
(146, NULL, '2022-05-10'),
(147, NULL, '2022-05-10'),
(148, NULL, '2022-05-10'),
(149, NULL, '2022-05-10'),
(150, NULL, '2022-05-10'),
(151, NULL, '2022-05-10'),
(152, NULL, '2022-05-10'),
(153, NULL, '2022-05-10'),
(154, NULL, '2022-05-10'),
(155, NULL, '2022-05-10'),
(156, NULL, '2022-05-10'),
(157, NULL, '2022-05-10'),
(158, NULL, '2022-05-10'),
(159, NULL, '2022-05-10'),
(160, NULL, '2022-05-10'),
(161, NULL, '2022-05-10'),
(162, NULL, '2022-05-10'),
(163, NULL, '2022-05-10'),
(164, NULL, '2022-05-10'),
(165, NULL, '2022-05-10'),
(166, NULL, '2022-05-10'),
(167, NULL, '2022-05-10'),
(168, NULL, '2022-05-10'),
(169, NULL, '2022-05-10'),
(170, NULL, '2022-05-10'),
(171, NULL, '2022-05-10'),
(172, NULL, '2022-05-10'),
(173, NULL, '2022-05-10'),
(174, NULL, '2022-05-10'),
(175, NULL, '2022-05-10'),
(176, NULL, '2022-05-10'),
(177, NULL, '2022-05-10'),
(178, NULL, '2022-05-10'),
(179, NULL, '2022-05-10'),
(180, NULL, '2022-05-10'),
(181, NULL, '2022-05-10'),
(182, NULL, '2022-05-10'),
(183, NULL, '2022-05-10'),
(184, NULL, '2022-05-10'),
(185, NULL, '2022-05-10'),
(186, NULL, '2022-05-10'),
(187, NULL, '2022-05-10'),
(188, NULL, '2022-05-10'),
(189, NULL, '2022-05-10'),
(190, NULL, '2022-05-10'),
(191, NULL, '2022-05-10'),
(192, NULL, '2022-05-10'),
(193, NULL, '2022-05-10'),
(194, NULL, '2022-05-10'),
(195, NULL, '2022-05-10'),
(196, NULL, '2022-05-10'),
(197, NULL, '2022-05-10'),
(198, NULL, '2022-05-10'),
(199, NULL, '2022-05-10'),
(200, NULL, '2022-05-10'),
(201, NULL, '2022-05-10'),
(202, NULL, '2022-05-10'),
(203, NULL, '2022-05-10'),
(204, NULL, '2022-05-10'),
(205, NULL, '2022-05-10'),
(206, NULL, '2022-05-10'),
(207, NULL, '2022-05-10'),
(208, NULL, '2022-05-10'),
(209, NULL, '2022-05-10'),
(210, NULL, '2022-05-10'),
(211, NULL, '2022-05-10'),
(212, NULL, '2022-05-10'),
(213, NULL, '2022-05-10'),
(214, NULL, '2022-05-10'),
(215, NULL, '2022-05-11'),
(216, NULL, '2022-05-11'),
(217, NULL, '2022-05-11'),
(218, NULL, '2022-05-11'),
(219, NULL, '2022-05-11'),
(220, NULL, '2022-05-11'),
(221, NULL, '2022-05-11'),
(222, NULL, '2022-05-11'),
(223, NULL, '2022-05-11'),
(224, NULL, '2022-05-11'),
(225, NULL, '2022-05-11'),
(226, NULL, '2022-05-11'),
(227, NULL, '2022-05-11'),
(228, NULL, '2022-05-11'),
(229, NULL, '2022-05-12'),
(230, 309, '2022-05-12'),
(231, 310, '2022-05-19');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `TeacherID` int NOT NULL,
  `Email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `FirstName` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `LastName` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `PhoneNumber` varchar(13) COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(60) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`TeacherID`, `Email`, `FirstName`, `LastName`, `PhoneNumber`, `Password`) VALUES
(1, 'teacher1@email.com', 'the', 'teacher', '123456789', '$2b$10$c3.73A89pfnB8vcJGqV1kueqPq/..9ZA6kj4LQ9.V90cRbKardpgu'),
(2, 'testEmail', 'first', 'last', '12341234', 'password'),
(5, 'teacher2@email.com', 'the', 'teacher', '123456789', '$2b$10$lKfTkrCnbNQh1RT9c8Ew5uTWBDFfeOvJDjK8B6FPHC73ZUIPtqYoG'),
(6, 'email2@email.com', 'firstname', 'lastname', '01234666345', 'password'),
(8, 'teacher20@email.com', 'John', 'Johnson', '07123456776', '$2b$10$oxQZVK2SIjEyB15TNho9/.xk7rv7EEKV8CEFlusfas4a2XDo7R6A6'),
(10, 'email100@email.com', 'john', 'ssmiff', '08937495772', '$2b$10$pDO/zGekqeg/QzTI6LG3HO194I356U1CPvLr.Yqw05DVHJY//ySl.'),
(11, 'email111@email.com', '123', '456', '123456789', '$2b$10$u0lxBnNF7s2/2XNduhnCbOsZqG8PfW6/WjXtNqR0usHtb874yuN2a'),
(13, 'changePassword@email.com', 'change-this', 'password', '01234567', '$2b$10$vp0ZAR5aoZZPmp32.to7.eD0CJQY4ytn.WdKWQhqAaL7nTVYw.KfK'),
(331, 'cypress@teacher.com', 'cypress', 'testing', '102234234', '$2b$10$OqCE/UazRUHZpG3hj7oN2uqXoKj78dFQ6IFbq2c7htRzEh3yPsMXC'),
(332, 'teacher100@email.com', 'first', 'last', '012423234', '$2b$10$RKk1UfXargVZyh343D2jzOp6yy6y6fBBRAEQ1URLABpXuzY9Yn7z.'),
(333, 'demo@teacher.com', 'john', 'smith', '12343564', '$2b$10$yZQeSqyJAnm.ORsIEE8xXOZQsJioo/nXFux6RrbzlVyo.2fLcdT/C');

-- --------------------------------------------------------

--
-- Table structure for table `themes`
--

CREATE TABLE `themes` (
  `ThemeID` int NOT NULL,
  `Name` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `Details` text COLLATE utf8_unicode_ci,
  `PrimaryColor` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `BackgroundColor` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `BtnTextColor` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `IsDark` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `Cost` int NOT NULL DEFAULT '0',
  `RequiredLevel` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `themes`
--

INSERT INTO `themes` (`ThemeID`, `Name`, `Details`, `PrimaryColor`, `BackgroundColor`, `BtnTextColor`, `IsDark`, `Cost`, `RequiredLevel`) VALUES
(1, 'Original', 'Original', '#201d95', 'white', 'white', 'false', 0, 1),
(2, 'Original Dark', 'Original theme but dark', '#201d95', '#121723', 'white', 'true', 0, 1),
(3, 'Yellow/Black', 'Black and Yellow', '#E3FE72', '#121723', 'black', 'true', 200, 5),
(4, 'Purples', NULL, '#594a70', '#221737', 'white', 'true', 150, 14),
(7, 'pink/white', 'pink and white', 'pink', 'white', 'white', 'false', 100, 21);

-- --------------------------------------------------------

--
-- Table structure for table `themespurchased`
--

CREATE TABLE `themespurchased` (
  `ThemeID` int NOT NULL,
  `StudentID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `themespurchased`
--

INSERT INTO `themespurchased` (`ThemeID`, `StudentID`) VALUES
(1, 8),
(2, 8),
(1, 11),
(2, 11),
(3, 11),
(4, 11),
(1, 58),
(2, 58),
(1, 310),
(2, 310);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`AdminID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`BannerID`);

--
-- Indexes for table `bannerspurchased`
--
ALTER TABLE `bannerspurchased`
  ADD PRIMARY KEY (`BannerID`,`StudentID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Indexes for table `classdetails`
--
ALTER TABLE `classdetails`
  ADD PRIMARY KEY (`ClassDetailsID`),
  ADD KEY `classdetails_ibfk_1` (`TeacherID`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`StudentID`,`ClassDetailsID`),
  ADD KEY `classes_ibfk_2` (`ClassDetailsID`);

--
-- Indexes for table `classrequests`
--
ALTER TABLE `classrequests`
  ADD PRIMARY KEY (`StudentID`,`ClassDetailsID`),
  ADD KEY `ClassDetailsID` (`ClassDetailsID`);

--
-- Indexes for table `flashcarddecks`
--
ALTER TABLE `flashcarddecks`
  ADD PRIMARY KEY (`DeckID`),
  ADD KEY `flashcarddeck_ibfk_1` (`StudentID`);

--
-- Indexes for table `flashcards`
--
ALTER TABLE `flashcards`
  ADD PRIMARY KEY (`CardID`),
  ADD KEY `flashcards_ibfk_1` (`DeckID`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`ModuleID`),
  ADD KEY `TeacherID` (`TeacherID`);

--
-- Indexes for table `profilepictures`
--
ALTER TABLE `profilepictures`
  ADD PRIMARY KEY (`ProfilePictureID`);

--
-- Indexes for table `profilepicturespurchased`
--
ALTER TABLE `profilepicturespurchased`
  ADD PRIMARY KEY (`ProfilePictureID`,`StudentID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Indexes for table `quizassignments`
--
ALTER TABLE `quizassignments`
  ADD PRIMARY KEY (`StudentID`,`QuizID`),
  ADD KEY `QuizID` (`QuizID`);

--
-- Indexes for table `quizclassassignments`
--
ALTER TABLE `quizclassassignments`
  ADD PRIMARY KEY (`ClassDetailsID`,`QuizID`),
  ADD KEY `QuizID` (`QuizID`);

--
-- Indexes for table `quizoptions`
--
ALTER TABLE `quizoptions`
  ADD PRIMARY KEY (`QuizOptionsID`),
  ADD KEY `QuestionID` (`QuestionID`);

--
-- Indexes for table `quizquestions`
--
ALTER TABLE `quizquestions`
  ADD PRIMARY KEY (`QuestionID`),
  ADD KEY `QuizID` (`QuizID`);

--
-- Indexes for table `quizratings`
--
ALTER TABLE `quizratings`
  ADD PRIMARY KEY (`StudentID`,`QuizID`),
  ADD KEY `QuizID` (`QuizID`);

--
-- Indexes for table `quizsubmissions`
--
ALTER TABLE `quizsubmissions`
  ADD PRIMARY KEY (`StudentID`,`QuizID`),
  ADD KEY `QuizID` (`QuizID`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`QuizID`),
  ADD KEY `TeacherID` (`TeacherID`),
  ADD KEY `ModuleID` (`ModuleID`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`StudentID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `studentsignups`
--
ALTER TABLE `studentsignups`
  ADD PRIMARY KEY (`StudentSignupID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`TeacherID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `themes`
--
ALTER TABLE `themes`
  ADD PRIMARY KEY (`ThemeID`);

--
-- Indexes for table `themespurchased`
--
ALTER TABLE `themespurchased`
  ADD PRIMARY KEY (`ThemeID`,`StudentID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `AdminID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `BannerID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `classdetails`
--
ALTER TABLE `classdetails`
  MODIFY `ClassDetailsID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=346;

--
-- AUTO_INCREMENT for table `flashcarddecks`
--
ALTER TABLE `flashcarddecks`
  MODIFY `DeckID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `flashcards`
--
ALTER TABLE `flashcards`
  MODIFY `CardID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `ModuleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `profilepictures`
--
ALTER TABLE `profilepictures`
  MODIFY `ProfilePictureID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `quizoptions`
--
ALTER TABLE `quizoptions`
  MODIFY `QuizOptionsID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=409;

--
-- AUTO_INCREMENT for table `quizquestions`
--
ALTER TABLE `quizquestions`
  MODIFY `QuestionID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=199;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `QuizID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `StudentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=311;

--
-- AUTO_INCREMENT for table `studentsignups`
--
ALTER TABLE `studentsignups`
  MODIFY `StudentSignupID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=232;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `TeacherID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=334;

--
-- AUTO_INCREMENT for table `themes`
--
ALTER TABLE `themes`
  MODIFY `ThemeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bannerspurchased`
--
ALTER TABLE `bannerspurchased`
  ADD CONSTRAINT `bannerspurchased_ibfk_1` FOREIGN KEY (`BannerID`) REFERENCES `banners` (`BannerID`) ON DELETE CASCADE,
  ADD CONSTRAINT `bannerspurchased_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE;

--
-- Constraints for table `classdetails`
--
ALTER TABLE `classdetails`
  ADD CONSTRAINT `classdetails_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`TeacherID`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`ClassDetailsID`) REFERENCES `classdetails` (`ClassDetailsID`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `classrequests`
--
ALTER TABLE `classrequests`
  ADD CONSTRAINT `classrequests_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `classrequests_ibfk_2` FOREIGN KEY (`ClassDetailsID`) REFERENCES `classdetails` (`ClassDetailsID`) ON DELETE CASCADE;

--
-- Constraints for table `flashcarddecks`
--
ALTER TABLE `flashcarddecks`
  ADD CONSTRAINT `flashcarddecks_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `flashcards`
--
ALTER TABLE `flashcards`
  ADD CONSTRAINT `flashcards_ibfk_1` FOREIGN KEY (`DeckID`) REFERENCES `flashcarddecks` (`DeckID`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`TeacherID`) ON DELETE CASCADE;

--
-- Constraints for table `profilepicturespurchased`
--
ALTER TABLE `profilepicturespurchased`
  ADD CONSTRAINT `profilepicturespurchased_ibfk_1` FOREIGN KEY (`ProfilePictureID`) REFERENCES `profilepictures` (`ProfilePictureID`) ON DELETE CASCADE,
  ADD CONSTRAINT `profilepicturespurchased_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE;

--
-- Constraints for table `quizassignments`
--
ALTER TABLE `quizassignments`
  ADD CONSTRAINT `quizassignments_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizassignments_ibfk_2` FOREIGN KEY (`QuizID`) REFERENCES `quizzes` (`QuizID`) ON DELETE CASCADE;

--
-- Constraints for table `quizclassassignments`
--
ALTER TABLE `quizclassassignments`
  ADD CONSTRAINT `quizclassassignments_ibfk_1` FOREIGN KEY (`ClassDetailsID`) REFERENCES `classdetails` (`ClassDetailsID`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizclassassignments_ibfk_2` FOREIGN KEY (`QuizID`) REFERENCES `quizzes` (`QuizID`) ON DELETE CASCADE;

--
-- Constraints for table `quizoptions`
--
ALTER TABLE `quizoptions`
  ADD CONSTRAINT `quizoptions_ibfk_1` FOREIGN KEY (`QuestionID`) REFERENCES `quizquestions` (`QuestionID`) ON DELETE CASCADE;

--
-- Constraints for table `quizquestions`
--
ALTER TABLE `quizquestions`
  ADD CONSTRAINT `quizquestions_ibfk_1` FOREIGN KEY (`QuizID`) REFERENCES `quizzes` (`QuizID`) ON DELETE CASCADE;

--
-- Constraints for table `quizratings`
--
ALTER TABLE `quizratings`
  ADD CONSTRAINT `quizratings_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizratings_ibfk_2` FOREIGN KEY (`QuizID`) REFERENCES `quizzes` (`QuizID`) ON DELETE CASCADE;

--
-- Constraints for table `quizsubmissions`
--
ALTER TABLE `quizsubmissions`
  ADD CONSTRAINT `quizsubmissions_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizsubmissions_ibfk_2` FOREIGN KEY (`QuizID`) REFERENCES `quizzes` (`QuizID`) ON DELETE CASCADE;

--
-- Constraints for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`TeacherID`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizzes_ibfk_2` FOREIGN KEY (`ModuleID`) REFERENCES `modules` (`ModuleID`) ON DELETE CASCADE;

--
-- Constraints for table `studentsignups`
--
ALTER TABLE `studentsignups`
  ADD CONSTRAINT `studentsignups_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE SET NULL;

--
-- Constraints for table `themespurchased`
--
ALTER TABLE `themespurchased`
  ADD CONSTRAINT `themespurchased_ibfk_1` FOREIGN KEY (`ThemeID`) REFERENCES `themes` (`ThemeID`) ON DELETE CASCADE,
  ADD CONSTRAINT `themespurchased_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
