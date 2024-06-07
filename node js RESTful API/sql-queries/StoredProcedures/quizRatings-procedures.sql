# students create rating
DELIMITER $$
CREATE PROCEDURE rating_create (qID int, qRating int, sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #create rating
    INSERT IGNORE INTO QuizRatings (StudentID, QuizID, Rating)
    VALUES (theStudentID,qID,qRating);
END$$
DELIMITER ;

CALL rating_create (1,1, "email@email.com", "password")


# view quiz rating
DELIMITER $$
CREATE PROCEDURE rating_quiz_ave (qID int)
BEGIN
    #get average rating
    SELECT AVG(Rating) AS AverageRating FROM QuizRatings WHERE QuizID = qID;
END$$
DELIMITER ;

CALL rating_quiz_ave (1)