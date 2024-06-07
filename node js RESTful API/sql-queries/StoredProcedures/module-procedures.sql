# Create Module
DELIMITER $$
CREATE PROCEDURE modules_create (mName text,tEmail varchar(255), tPassword varchar(60))
BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    INSERT INTO Modules
    (ModuleName, TeacherID)
    VALUES(mName, theTeacherID);
END$$
DELIMITER ;


# Delete Module
DELIMITER $$
CREATE PROCEDURE modules_delete (mID int,tEmail varchar(255), tPassword varchar(60))
BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    DELETE FROM Modules WHERE TeacherID = theTeacherID AND ModuleID = mID;
END$$
DELIMITER ;

# Update Module
DELIMITER $$
CREATE PROCEDURE modules_update (mID text, nMName text, tEmail varchar(255), tPassword varchar(60))
BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    UPDATE Modules
    SET ModuleName = nMName
    WHERE TeacherID = theTeacherID AND ModuleID = mID;
END$$
DELIMITER ;

# View Modules by id
DELIMITER $$
CREATE PROCEDURE modules_view_by_teacher (tEmail varchar(255), tPassword varchar(60))
BEGIN
    DECLARE theTeacherID int;
    SET theTeacherID = (SELECT TeacherID FROM teachers WHERE email = tEmail AND password = tPassword LIMIT 1);
    SELECT ModuleID, ModuleName FROM Modules WHERE TeacherID = theTeacherID;
END$$
DELIMITER ;

CALL modules_view_by_teacher("teacher","password")