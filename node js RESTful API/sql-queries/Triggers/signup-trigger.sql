# insert signup date into signups table when student created
DELIMITER $$
CREATE TRIGGER tr_ins_student
AFTER INSERT ON Students
FOR EACH ROW
BEGIN
INSERT INTO StudentSignups (StudentID,SignUpDate) VALUES (new.StudentID,curdate());
END$$
DELIMITER ;
