# get all themes
DELIMITER $$
CREATE PROCEDURE Themes_get_all (sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);

    #get from both purchased and unpurchased themes
    SELECT * FROM
    (
        SELECT 'Unpurchased' Caption, themes.ThemeID, Name, Details, PrimaryColor, BackgroundColor, BtnTextColor, IsDark, Cost, RequiredLevel
        FROM Themes
        WHERE ThemeID NOT IN (SELECT ThemeID FROM ThemesPurchased WHERE StudentID = theStudentID)
        UNION ALL
        SELECT 'Purchased' Caption, themes.ThemeID, Name, Details, PrimaryColor, BackgroundColor, BtnTextColor, IsDark, Cost, RequiredLevel
        FROM Themes 
        INNER JOIN ThemesPurchased 
        ON Themes.ThemeID = ThemesPurchased.ThemeID 
        WHERE studentID = theStudentID
    ) subquery
    ORDER BY RequiredLevel asc, FIELD(Caption, 'Unpurchased', 'Purchased');
END$$
DELIMITER ;

CALL Themes_get_all('email2@email.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K')


# get themes details
DELIMITER $$
CREATE PROCEDURE Themes_details (tID int)
BEGIN
    SELECT * FROM Themes WHERE ThemeID=tID LIMIT 1;
END$$
DELIMITER ;

CALL Themes_details('first@admin.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K')


# get all themes admin
DELIMITER $$
CREATE PROCEDURE Themes_get_all_admin (aEmail varchar(255), aPassword varchar(60))
BEGIN
    #get all themes
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        SELECT * FROM Themes;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Themes_get_all_admin('first@admin.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K')



# get all pruchased themes
DELIMITER $$
CREATE PROCEDURE Themes_purchased (sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);

    #get purchased themes
    SELECT themes.ThemeID, Name, Details, PrimaryColor, BackgroundColor, BtnTextColor, IsDark, Cost, RequiredLevel
    FROM Themes 
    INNER JOIN ThemesPurchased 
    ON Themes.ThemeID = ThemesPurchased.ThemeID 
    WHERE studentID = theStudentID;
END$$
DELIMITER ;

CALL Themes_purchased('email2@email.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K')



# student purchase a theme
DELIMITER $$
CREATE PROCEDURE Themes_purchased_add (tID int ,sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get values
    DECLARE theStudentID int;
    DECLARE numCoins int;
    DECLARE itemCost int;
    DECLARE sLevel int;
    DECLARE itemLevel int;

    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    SET numCoins = (SELECT Coins FROM Students WHERE StudentID = theStudentID LIMIT 1);
    SET itemCost = (SELECT Cost FROM Themes WHERE ThemeID = tID LIMIT 1);
    SET sLevel = (SELECT Level FROM Students WHERE StudentID = theStudentID LIMIT 1);
    SET itemLevel = (SELECT RequiredLevel FROM Themes WHERE ThemeID = tID LIMIT 1);


    # check if can afford
    IF (numCoins >= itemCost AND sLevel >= itemLevel) then 
        # update students coins
        UPDATE students set coins = (numCoins-itemCost) WHERE StudentID = theStudentID;
    ELSE
        SELECT(400) AS 'Error';
    END IF;
    IF (numCoins >= itemCost AND sLevel >= itemLevel) then 
        #add purchased theme to table
        INSERT IGNORE INTO ThemesPurchased (ThemeID,StudentID) 
        VALUES (tID,theStudentID);
    ELSE
        ROLLBACK;
    END IF;
    
END$$
DELIMITER ;

CALL Themes_purchased_add(1,'email2@email.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K')



# get admin delete theme
DELIMITER $$
CREATE PROCEDURE Themes_delete (aEmail varchar(255), aPassword varchar(60), tID int)
BEGIN
    #check if admin
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        DELETE FROM Themes WHERE ThemeID = tID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Themes_delete('first@admin.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K',1)



# admin add new theme
DELIMITER $$
CREATE PROCEDURE Themes_add (aEmail varchar(255), aPassword varchar(60), tName varchar(60), tDetails text, tPrColor varchar(15), tBgColor varchar(15), tBnTextColor varchar(15), tIsDark varchar(15), tCost int, tReqLev int)
BEGIN
    #check if admin
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        INSERT INTO themes (Name, Details, PrimaryColor, BackgroundColor, BtnTextColor, IsDark, Cost, RequiredLevel)
        VALUES (tName, tDetails, tPrColor, tBgColor, tBnTextColor, tIsDark, tCost, tReqLev);
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Themes_add('first@admin.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K',1)


# admin edit theme
DELIMITER $$
CREATE PROCEDURE Themes_edit (aEmail varchar(255), aPassword varchar(60), tID int, tName varchar(60), tDetails text, tPrColor varchar(15), tBgColor varchar(15), tBnTextColor varchar(15), tIsDark varchar(15), tCost int, tReqLev int)
BEGIN
    #check if admin
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        Update themes 
        SET Name = tName, Details = tDetails, PrimaryColor = tPrColor, BackgroundColor = tBgColor, BtnTextColor = tBnTextColor, IsDark = tIsDark, Cost = tCost, RequiredLevel = tReqLev
        WHERE ThemeID = tID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Themes_edit('first@admin.com','$2b$10$frqy1S4DXpzTiM9H2MvdiO5z7NVW8AKSEf7dPt7j5XfGZI5QISJ5K',1)
