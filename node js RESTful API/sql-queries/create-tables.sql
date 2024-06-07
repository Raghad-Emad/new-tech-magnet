-- users table
-- CREATE TABLE Users (ID int NOT NULL AUTO_INCREMENT, Email varchar(255) UNIQUE, Name varchar(60),Password varchar(60) NOT NULL, PRIMARY KEY (ID))


-- Students table
CREATE TABLE Students (
    StudentID int NOT NULL AUTO_INCREMENT, 
    Email varchar(255) UNIQUE NOT NULL, 
    FirstName varchar(60) NOT NULL, 
    LastName varchar(60) NOT NULL,
    Password varchar(60) NOT NULL, 
    Xp int NOT NULL DEFAULT 0,
    level int NOT NULL DEFAULT 1,
    Coins int NOT NULL DEFAULT 0,
    ProfilePicture varchar(255) NOT NULL DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
    Banner varchar(255) NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2021/09/12/07/58/banner-6617553__340.jpg',
    PRIMARY KEY (StudentID)
    );

-- Teachers table
CREATE TABLE Teachers (
    TeacherID int NOT NULL AUTO_INCREMENT, 
    Email varchar(255) UNIQUE NOT NULL, 
    FirstName varchar(60) NOT NULL, 
    LastName varchar(60) NOT NULL,
    PhoneNumber varchar(13) NOT NULL, -- +44 7911 123456
    Password varchar(60) NOT NULL, 
    PRIMARY KEY (TeacherID)
    );

-- Class Details table
CREATE TABLE ClassDetails (
    ClassDetailsID int NOT NULL AUTO_INCREMENT, 
    Name varchar(60) NOT NULL, 
    YearGroup int,
    TeacherID int NOT NULL,
    PRIMARY KEY (ClassDetailsID),
    FOREIGN KEY (TeacherID) 
        REFERENCES Teachers(TeacherID) 
        ON DELETE CASCADE
    );

-- Classes table
CREATE TABLE Classes (
    StudentID int NOT NULL, 
    ClassDetailsID int NOT NULL, 
    PRIMARY KEY (StudentID, ClassDetailsID),
    FOREIGN KEY (StudentID) 
        REFERENCES Students(StudentID)
        ON DELETE CASCADE,
    FOREIGN KEY (ClassDetailsID) 
        REFERENCES ClassDetails(ClassDetailsID)
        ON DELETE CASCADE
    );

-- Achievements table
CREATE TABLE Achievements (
    AchievementID int NOT NULL AUTO_INCREMENT, 
    Name varchar(60) NOT NULL, 
    XP int NOT NULL,
    ToUnlock text NOT NULL,
    PRIMARY KEY (AchievementID)
    );

-- Students Achievements table
CREATE TABLE StudentsAchievements (
    StudentID int NOT NULL, 
    AchievementID int NOT NULL, 
    PRIMARY KEY (StudentID, AchievementID),
    FOREIGN KEY (StudentID) 
        REFERENCES Students(StudentID)
        ON DELETE CASCADE,
    FOREIGN KEY (AchievementID) 
        REFERENCES Achievements(AchievementID)
        ON DELETE CASCADE
    );


-- Flashcard Deck table
CREATE TABLE FlashCardDeck (
    DeckID int NOT NULL AUTO_INCREMENT, 
    Name varchar(60) NOT NULL, 
    StudentID int NOT NULL,
    PRIMARY KEY (DeckID),
    FOREIGN KEY (StudentID) 
        REFERENCES Students(StudentID)
        ON DELETE CASCADE
    );

-- Flashcards table
CREATE TABLE FlashCards (
    CardID int NOT NULL AUTO_INCREMENT, 
    DeckID int NOT NULL, 
    Question text NOT NULL, 
    Answer text NOT NULL, 
    PRIMARY KEY (CardID),
    FOREIGN KEY (DeckID) 
        REFERENCES FlashCardDeck(DeckID)
        ON DELETE CASCADE
    );

-- Assignments table
CREATE TABLE Assignments (
    TaskID int NOT NULL AUTO_INCREMENT, 
    TeacherID int NOT NULL, 
    StudentID int NOT NULL, 
    -- TaskName text NOT NULL, 
    TaskType varchar(60) NOT NULL,
    PRIMARY KEY (TaskID),
    FOREIGN KEY (TeacherID) 
        REFERENCES Teachers(TeacherID)
        ON DELETE CASCADE,
    FOREIGN KEY (StudentID) 
        REFERENCES Students(StudentID)
        ON DELETE CASCADE
    );

# Module table
CREATE TABLE Modules (
    ModuleID int NOT NULL AUTO_INCREMENT, 
    ModuleName text NOT NULL, 
    TeacherID int NOT NULL,
    PRIMARY KEY (ModuleID),
    FOREIGN KEY (TeacherID) 
        REFERENCES Teachers(TeacherID)
        ON DELETE CASCADE
    );

#Quiz indivisual assignments
CREATE TABLE QuizAssignments (
    StudentID int NOT NULL, 
    QuizID INT NOT NULL, 
    DueDate DATETIME NOT NULL,
    PRIMARY KEY (StudentID, QuizID),
    FOREIGN KEY (StudentID) 
        REFERENCES Students(StudentID)
        ON DELETE CASCADE,
    FOREIGN KEY (QuizID) 
        REFERENCES Quizzes(QuizID)
        ON DELETE CASCADE
    );

#Quiz class assignments
CREATE TABLE QuizClassAssignments (
    ClassDetailsID int NOT NULL, 
    QuizID INT NOT NULL, 
    DueDate DATETIME NOT NULL,
    Xp int NOT NULL DEFAULT(0),
    Coins int NOT NULL DEFAULT(0),
    PRIMARY KEY (ClassDetailsID, QuizID),
    FOREIGN KEY (ClassDetailsID) 
        REFERENCES ClassDetails(ClassDetailsID)
        ON DELETE CASCADE,
    FOREIGN KEY (QuizID) 
        REFERENCES Quizzes(QuizID)
        ON DELETE CASCADE
    );

-- Quiz submissions
CREATE TABLE QuizSubmissions(
    StudentID int NOT NULL,
    QuizID int NOT NULL,
    Score int NOT NULL DEFAULT 0,
    SubDate DATE NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (StudentID,QuizID),
    FOREIGN KEY (StudentID)
        REFERENCES Students(StudentID)
        ON DELETE CASCADE,
    FOREIGN KEY (QuizID)
        REFERENCES Quizzes(QuizID)
        ON DELETE CASCADE
);

-- Quizzes table
CREATE TABLE Quizzes (
    QuizID int NOT NULL AUTO_INCREMENT, 
    QuizName text NOT NULL, 
    TeacherID int NOT NULL,
    ModuleID int NOT NULL,
    #TaskID int NOT NULL, 
    PRIMARY KEY (QuizID),
    FOREIGN KEY (TeacherID) 
        REFERENCES Teachers(TeacherID)
        ON DELETE CASCADE,
    FOREIGN KEY (ModuleID) 
        REFERENCES Modules(ModuleID)
        ON DELETE CASCADE
    );

-- Quiz questions table
CREATE TABLE QuizQuestions (
    QuestionID int NOT NULL AUTO_INCREMENT, 
    QuizID int NOT NULL, 
    Question text NOT NULL, 
    Details text,
    Answer int NOT NULL, 
    PRIMARY KEY (QuestionID),
    FOREIGN KEY (QuizID) 
        REFERENCES Quizzes(QuizID)
        ON DELETE CASCADE
    );

-- Quiz Options table
CREATE TABLE QuizOptions (
    QuizOptionsID int NOT NULL AUTO_INCREMENT, 
    QuestionID int NOT NULL, 
    TheOption text NOT NULL, 
    PRIMARY KEY (QuizOptionsID),
    FOREIGN KEY (QuestionID) 
        REFERENCES QuizQuestions(QuestionID)
        ON DELETE CASCADE
    );

-- Word Links table
CREATE TABLE WordLinks (
    WordLinkID int NOT NULL AUTO_INCREMENT, 
    WordLinkName text NOT NULL, 
    #TaskID int NOT NULL, 
    PRIMARY KEY (WordLinkID)
    FOREIGN KEY (TeacherID) 
        REFERENCES Teachers(TeacherID)
        ON DELETE CASCADE
    );

-- Words table
CREATE TABLE Words (
    WordID int NOT NULL AUTO_INCREMENT, 
    Definition text NOT NULL, 
    Answer text NOT NULL, 
    WordLinkID int NOT NULL, 
    PRIMARY KEY (WordID),
    FOREIGN KEY (WordLinkID) 
        REFERENCES WordLinks(WordLinkID)
        ON DELETE CASCADE
    );
/* 
CREATE TABLE Items(
    ItemID int NOT NULL AUTO_INCREMENT,
    Name varchar(60) NOT NULL,
    Details text,
    Image varchar(255) NOT NULL,
    Cost int NOT NULL,
    TypeID int NOT NULL,
    PRIMARY KEY (ItemID),
    FOREIGN KEY (TypeID)
        REFERENCES ItemsType(TypeID)
        ON DELETE CASCADE
);

CREATE TABLE ItemsPurchased(
    ItemID int NOT NULL,
    StudentID int NOT NULL,
    PRIMARY KEY (ItemID, StudentID),
    FOREIGN KEY (ItemID) 
        REFERENCES Items(ItemID)
        ON DELETE CASCADE,
    FOREIGN KEY (StudentID)
        REFERENCES Students(StudentID)
        ON DELETE CASCADE
); */

/* CREATE TABLE ItemsType(
    TypeID int NOT NULL AUTO_INCREMENT,
    Name varchar(60) NOT NULL,
    PRIMARY KEY (TypeID)
); */

CREATE TABLE Themes(
    ThemeID int NOT NULL AUTO_INCREMENT,
    Name varchar(60) NOT NULL,
    Details text,
    PrimaryColor varchar(15) NOT NULL,
    BackgroundColor varchar(15) NOT NULL,
    BtnTextColor varchar(15) NOT NULL,
    IsDark varchar(15) NOT NULL,
    Cost int NOT NULL DEFAULT 0,
    RequiredLevel int NOT NULL DEFAULT 1,
    PRIMARY KEY (ThemeID)
);

CREATE TABLE ThemesPurchased(
    ThemeID int NOT NULL,
    StudentID int NOT NULL,
    PRIMARY KEY (ThemeID, StudentID),
    FOREIGN KEY (ThemeID) 
        REFERENCES Themes(ThemeID)
        ON DELETE CASCADE,
    FOREIGN KEY (StudentID)
        REFERENCES Students(StudentID)
        ON DELETE CASCADE
);

CREATE TABLE ProfilePictures(
    ProfilePictureID int NOT NULL AUTO_INCREMENT,
    Name varchar(60) NOT NULL,
    Details text,
    Image varchar(255) NOT NULL,
    Cost int NOT NULL DEFAULT 0,
    RequiredLevel int NOT NULL DEFAULT 1,
    PRIMARY KEY (ProfilePictureID)
);

CREATE TABLE ProfilePicturesPurchased(
    ProfilePictureID int NOT NULL,
    StudentID int NOT NULL,
    PRIMARY KEY (ProfilePictureID, StudentID),
    FOREIGN KEY (ProfilePictureID) 
        REFERENCES ProfilePictures(ProfilePictureID)
        ON DELETE CASCADE,
    FOREIGN KEY (StudentID)
        REFERENCES Students(StudentID)
        ON DELETE CASCADE
);

CREATE TABLE Banners(
    BannerID int NOT NULL AUTO_INCREMENT,
    Name varchar(60) NOT NULL,
    Details text,
    Image varchar(255) NOT NULL,
    Cost int NOT NULL DEFAULT 0,
    RequiredLevel int NOT NULL DEFAULT 1,
    PRIMARY KEY (BannerID)
);

CREATE TABLE BannersPurchased(
    BannerID int NOT NULL,
    StudentID int NOT NULL,
    PRIMARY KEY (BannerID, StudentID),
    FOREIGN KEY (BannerID) 
        REFERENCES Banners(BannerID)
        ON DELETE CASCADE,
    FOREIGN KEY (StudentID)
        REFERENCES Students(StudentID)
        ON DELETE CASCADE
);

# Admins table
CREATE TABLE Admins (
    AdminID int NOT NULL AUTO_INCREMENT, 
    Email varchar(255) UNIQUE NOT NULL, 
    Password varchar(60) NOT NULL, 
    FirstName varchar(60) NOT NULL, 
    LastName varchar(60) NOT NULL,
    PRIMARY KEY (AdminID)
    );
# Quiz Ratings
CREATE TABLE QuizRatings (
    `StudentID` int NOT NULL, 
    `QuizID` int NOT NULL, 
    `Rating` int NOT NULL,
    PRIMARY KEY (StudentID,QuizID),
    FOREIGN KEY (StudentID) 
        REFERENCES Students(StudentID)
        ON DELETE CASCADE,
    FOREIGN KEY (QuizID)
        REFERENCES Quizzes(QuizID)
        ON DELETE CASCADE
    );

# signups 
CREATE TABLE StudentSignups (
    StudentSignupID int AUTO_INCREMENT,
    StudentID int, 
    SignUpDate DATE NOT NULL, 
    PRIMARY KEY (StudentSignupID),
    FOREIGN KEY (StudentID) 
        REFERENCES Students(StudentID)
        ON DELETE set null
    );

-- class requests
CREATE TABLE ClassRequests(
    StudentID int NOT NULL,
    ClassDetailsID int NOT NULL,
    DateSent DATE NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (StudentID,ClassDetailsID),
    FOREIGN KEY (StudentID)
        REFERENCES Students(StudentID)
        ON DELETE CASCADE,
    FOREIGN KEY (ClassDetailsID)
        REFERENCES ClassDetails(ClassDetailsID)
        ON DELETE CASCADE
);