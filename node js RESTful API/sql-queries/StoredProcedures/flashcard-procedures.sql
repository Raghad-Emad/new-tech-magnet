# get students decks
DELIMITER $$
CREATE PROCEDURE Deck_get (sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #get deck
    SELECT DeckID, Name FROM FlashCardDecks WHERE StudentID = theStudentID;
END$$
DELIMITER ;

CALL Deck_get ("email@email.com", "password")

# create flashcard deck
DELIMITER $$
CREATE PROCEDURE Deck_create (nName varchar(60),sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM Students WHERE StudentID = theStudentID) THEN
        #insert new deck
        INSERT INTO FlashCardDecks (Name,StudentID) VALUES (nName,theStudentID);
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Deck_create ("Name","email@email.com", "password")

# delete flashcard deck
DELIMITER $$
CREATE PROCEDURE Deck_delete (ID int,sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM Students WHERE StudentID = theStudentID) THEN
        #delete deck
        DELETE FROM FlashCardDecks WHERE StudentID=theStudentID AND DeckID=ID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Deck_delete (1,"email@email.com", "password")


# update flashcard deck
DELIMITER $$
CREATE PROCEDURE Deck_update (ID int,nName varchar(60),sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    IF EXISTS (SELECT * FROM Students WHERE StudentID = theStudentID) THEN
        #update deck
        UPDATE FlashCardDecks SET Name=nName WHERE StudentID=theStudentID AND DeckID=ID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL Deck_update (2,"changed","email@email.com", "password")


#################
#               #
#   Flashcards  #
#               #
#################

#Get flashcards by deck
DELIMITER $$
CREATE PROCEDURE flashcard_get_all_by_deck (ID int,sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #check if student owns deck
    IF EXISTS (SELECT * FROM FlashCardDecks WHERE StudentID = theStudentID AND DeckID=ID) THEN
        #get all from deck
        SELECT * FROM FlashCards WHERE DeckID=ID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL flashcard_get_all_by_deck (1,"email@email.com", "password")

# get number of cards
DELIMITER $$
CREATE PROCEDURE Deck_num_flashcards (ID int, sEmail varchar(255), sPassword varchar(60))
BEGIN
    #count cards
    SELECT COUNT(DeckID) AS NumberOfCards FROM FlashCards WHERE DeckID = ID;
END$$
DELIMITER ;

CALL Deck_num_flashcards (2,"email@email.com", "password")



#add flashcard to deck
DELIMITER $$
CREATE PROCEDURE flashcard_add (ID int, nQuestion text, nAnswer text, sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #check if student owns deck
    IF EXISTS (SELECT * FROM FlashCardDecks WHERE StudentID = theStudentID AND DeckID=ID) THEN
        #insert new deck
        /* SELECT * FROM FlashCards WHERE DeckID=ID; */
        INSERT INTO FlashCards (DeckID, Question, Answer) VALUES (ID, nQuestion, nAnswer);
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL flashcard_add (2,"1+1","2","email@email.com", "password")


#update flashcard
DELIMITER $$
CREATE PROCEDURE flashcard_update (ID int, nQuestion text, nAnswer text, sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #check if student owns flashcard
    IF EXISTS (SELECT * FROM FlashCardDecks INNER JOIN FlashCards WHERE StudentID = theStudentID AND CardID=ID) THEN
        #update card
        UPDATE FlashCards SET Question=nQuestion, Answer=nAnswer WHERE CardID=ID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL flashcard_update (1,"1+2","3","email@email.com", "password")



#delete flashcard
DELIMITER $$
CREATE PROCEDURE flashcard_delete (ID int, sEmail varchar(255), sPassword varchar(60))
BEGIN
    #get student id
    DECLARE theStudentID int;
    SET theStudentID = (SELECT StudentID FROM students WHERE email = sEmail AND password = sPassword LIMIT 1);
    #check if student owns flashcard
    IF EXISTS (SELECT * FROM FlashCardDecks INNER JOIN FlashCards WHERE StudentID = theStudentID AND CardID=ID) THEN
        #delete card
        DELETE FROM FlashCards WHERE CardID=ID;
    ELSE
        ROLLBACK;
    END IF;
END$$
DELIMITER ;

CALL flashcard_delete (1,"email@email.com", "password")
