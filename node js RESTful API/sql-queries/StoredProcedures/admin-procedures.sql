# create admin
DELIMITER $$
CREATE PROCEDURE Admin_create ( aEmail varchar(255), aPassword varchar(60),nEmail varchar(255), nPassword varchar(60), nFirstname varchar(60), nLastname varchar(60))
BEGIN
    #get student id
    DECLARE theAdminID int;
    SET theAdminID = (SELECT AdminID FROM admins WHERE email = aEmail AND password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM admins WHERE AdminID = theAdminID) THEN
        #insert new admin
        INSERT INTO Admins(Email, Password, Firstname,Lastname) VALUES (nEmail,nPassword,nFirstname,nLastname);
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Admin_create ('first@admin.com','password','admin@email.com','password','John','Smith')


# edit admin
DELIMITER $$
CREATE PROCEDURE Admin_edit (aEmail varchar(255), aPassword varchar(60), nEmail varchar(255), nFirstname varchar(60), nLastname varchar(60) )
BEGIN
    #get student id
    DECLARE theAdminID int;
    SET theAdminID = (SELECT AdminID FROM admins WHERE email = aEmail AND password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM admins WHERE AdminID = theAdminID) THEN
        #edit admin
        Update Admins SET Email=nEmail, Firstname=nFirstname, LastName=nLastname WHERE AdminID = theAdminID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Admin_edit ('admin@email.com','password','admin2@email.com','Jonny','Smithers')

# edit password admin
DELIMITER $$
CREATE PROCEDURE Admin_edit_password (aEmail varchar(255), aPassword varchar(60), nPassword varchar(60) )
BEGIN
    #get student id
    DECLARE theAdminID int;
    SET theAdminID = (SELECT AdminID FROM admins WHERE email = aEmail AND password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        #edit password
        Update Admins SET Password = nPassword WHERE AdminID = theAdminID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Admin_edit_password ('admin2@email.com','password','password2')

# get admin
DELIMITER $$
CREATE PROCEDURE Admin_details (aEmail varchar(255), aPassword varchar(60) )
BEGIN
    #get student id
    DECLARE theAdminID int;
    SET theAdminID = (SELECT AdminID FROM admins WHERE email = aEmail AND password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        #Get details
        SELECT Email, Firstname, Lastname FROM Admins WHERE AdminID = theAdminID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Admin_details ('admin2@email.com','password2')

# delete admin
DELIMITER $$
CREATE PROCEDURE Admin_delete (aEmail varchar(255), aPassword varchar(60) )
BEGIN
    #get student id
    DECLARE theAdminID int;
    SET theAdminID = (SELECT AdminID FROM admins WHERE email = aEmail AND password = aPassword LIMIT 1);
    IF EXISTS (SELECT * FROM admins WHERE email = aEmail AND password = aPassword) THEN
        #Delete admin
        DELETE FROM Admins WHERE AdminID = theAdminID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Admin_delete ('admin2@email.com','password2')
