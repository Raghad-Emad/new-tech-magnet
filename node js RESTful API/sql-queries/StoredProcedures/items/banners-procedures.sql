# get all banners
DELIMITER $$
CREATE PROCEDURE Banners_get_all (sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);

    #get from both purchased and unpurchased banners
    SELECT * FROM
    (
        SELECT 'Unpurchased' Caption, Banners.BannerID, Name, Details, Image, Cost, RequiredLevel
        FROM Banners
        WHERE BannerID NOT IN (SELECT BannerID FROM BannersPurchased WHERE StudentID = theStudentID)
        UNION ALL
        SELECT 'Purchased' Caption, Banners.BannerID, Name, Details, Image, Cost, RequiredLevel
        FROM Banners 
        INNER JOIN BannersPurchased 
        ON Banners.BannerID = BannersPurchased.BannerID 
        WHERE studentID = theStudentID
    ) subquery
    ORDER BY RequiredLevel asc, FIELD(Caption, 'Unpurchased', 'Purchased');
END$$
DELIMITER ;

CALL Banners_get_all('email2@email.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K')


# get all pruchased banners
DELIMITER $$
CREATE PROCEDURE Banners_purchased (sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);

    #get purchased banners
    SELECT Banners.BannerID, Name, Details, Image, Cost, RequiredLevel
    FROM Banners 
    INNER JOIN BannersPurchased 
    ON Banners.BannerID = BannersPurchased.BannerID 
    WHERE studentID = theStudentID;
END$$
DELIMITER ;

CALL Banners_purchased('email2@email.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K')



# student purchase a banner
DELIMITER $$
CREATE PROCEDURE Banners_purchased_add (bID int ,sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get values
    DECLARE theStudentID int;
    DECLARE numCoins int;
    DECLARE itemCost int;
    DECLARE sLevel int;
    DECLARE itemLevel int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    SET numCoins = (SELECT Coins FROM Students WHERE StudentID = theStudentID LIMIT 1);
    SET itemCost = (SELECT Cost FROM Banners WHERE BannerID = bID LIMIT 1);
    SET sLevel = (SELECT Level FROM Students WHERE StudentID = theStudentID LIMIT 1);
    SET itemLevel = (SELECT RequiredLevel FROM Banners WHERE BannerID = bID LIMIT 1);

    # check if can afford
    IF (numCoins >= itemCost AND sLevel >= itemLevel) then 
        # update students coins
        UPDATE students set coins = (numCoins-itemCost) WHERE StudentID = theStudentID;
    ELSE
        SELECT(400) AS 'Error';
    END IF;
    IF (numCoins >= itemCost AND sLevel >= itemLevel) then 
        #add purchased banner to table
        INSERT IGNORE INTO BannersPurchased (BannerID,StudentID) 
        VALUES (bID,theStudentID);
    ELSE
        ROLLBACK;
    END IF;
    
END$$
DELIMITER ;

CALL Banners_purchased_add(1,'email2@email.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K')


# get all banners admin
DELIMITER $$
CREATE PROCEDURE Banners_get_all_admin (aEmail varchar(255), aPassword varchar(60))
BEGIN
    #get student id
    IF EXISTS (SELECT AdminID FROM admins WHERE email = aEmail AND password = aPassword LIMIT 1) THEN
        # get all banners
        SELECT * FROM banners;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Banners_get_all_admin('email2@email.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K')



# delete banner admin
DELIMITER $$
CREATE PROCEDURE Banners_delete (aEmail varchar(255), aPassword varchar(60),bID int)
BEGIN
    #get student id
    IF EXISTS (SELECT AdminID FROM admins WHERE email = aEmail AND password = aPassword LIMIT 1) THEN
        # get all banners
        DELETE FROM banners WHERE bannerID = bID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Banners_delete('email2@email.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K')



# get banner details
DELIMITER $$
CREATE PROCEDURE Banners_get_details (bID int)
BEGIN
    # get banner
    SELECT * FROM banners WHERE BannerID = bID LIMIT 1;
END$$
DELIMITER ;

CALL Banners_get_details(1)


# edit banner admin
DELIMITER $$
CREATE PROCEDURE Banners_edit (aEmail varchar(255), aPassword varchar(60),bID int, nName varchar(60), nDetails text, nImage text, nCost int, nReqLev int)
BEGIN
    #get student id
    IF EXISTS (SELECT AdminID FROM admins WHERE email = aEmail AND password = aPassword LIMIT 1) THEN
        # edit banner
        Update banners SET Name = nName, Details = nDetails, Image = nImage, Cost = nCost, RequiredLevel = nReqLev WHERE BannerID = bID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Banners_edit('email2@email.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K')



# add banner admin
DELIMITER $$
CREATE PROCEDURE Banners_add (aEmail varchar(255), aPassword varchar(60), bName varchar(60), bDetails text, bImage text, bCost int, bReqLev int)
BEGIN
    #get student id
    IF EXISTS (SELECT AdminID FROM admins WHERE email = aEmail AND password = aPassword LIMIT 1) THEN
        # add banner
        INSERT INTO banners (Name, Details, Image, Cost, RequiredLevel) VALUES (bName, bDetails, bImage, bCost, bReqLev);
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Banners_add('email2@email.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K')
