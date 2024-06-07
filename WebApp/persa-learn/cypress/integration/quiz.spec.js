/// <reference types="cypress" />

describe("quiz flow", () => {
  beforeEach(() => {
    // go to home page
    cy.visit("/");
  });
  afterEach(() => {
    // go to home page and logout
    cy.visit("/");
    cy.contains("a", "Logout").click();
  });

  it("add student to class", () => {
    //login
    cy.get("[placeholder='email']").type("cypress@teacher.com");
    cy.get("[placeholder='password']").type("password");
    cy.get("[data-cy=toggleTeacher]").click();
    cy.contains("button", "Login").click();
    //check if diverted to correct page
    cy.contains("h1", "Teacher Profile");
    //go to all classes page
    cy.contains("a", "Classes").click();
    //add class
    cy.contains("div", "Add Class").click();
    cy.get("[name='name']").type("class name");
    cy.get("[name='yearGroup']").type("12");
    cy.contains("button", "Confirm").click();
    //check class added and access details
    cy.contains("div", "class name")
      .should("contain", "Year Group: 12")
      .click();
    //send student request
    cy.contains("button", "Add Student").click();
    cy.contains("div", "cypress@student.com").find("button").click();
  });

  it("studentAcceptClassRequest", () => {
    cy.get("[placeholder='email']").type("cypress@student.com");
    cy.get("[placeholder='password']").type("password");
    cy.contains("button", "Login").click();
    cy.contains("h1", "Student profile");
    //go to all classes page
    cy.contains("a", "Classes").click();

    //accept class requests
    cy.contains("div", "class name")
      .should("contain", "12")
      .contains("button", "Accept")
      .click();
  });

  it("create assignment", () => {
    //login
    cy.get("[placeholder='email']").type("cypress@teacher.com");
    cy.get("[placeholder='password']").type("password");
    cy.get("[data-cy=toggleTeacher]").click();
    cy.contains("button", "Login").click();
    //check if diverted to correct page
    cy.contains("h1", "Teacher Profile");
    //go to all classes page
    cy.contains("a", "Classes").click();
    //check class added and access details
    cy.contains("div", "class name")
      .should("contain", "Year Group: 12")
      .click();
    //create assignment
    cy.contains("button", "Assignment").click();
    cy.contains("div", "Create Quiz").click();
    cy.get("[placeholder='Quiz Title']").type("test quiz");
    cy.contains("button", "+").click();
    cy.get("[placeholder='Question']").type("10+10=?");
    cy.get("[placeholder='Details']").type("Whats ?");
    cy.contains("div", "add option").click();
    cy.get("[placeholder='Option']").type("20");
    cy.get("#checkbox").click();
    cy.contains("button", "Finished").click();
    cy.contains("button", "View All Quizzes").click();

    //assign to class
    cy.contains("div", "test quiz").find("#Assigntoclass").click();
    cy.get("[placeholder='Due date']").type("5/7/2022{enter}");
    cy.get("[placeholder='Xp']").type("200");
    cy.get("[placeholder='Coins']").type("50");
    cy.contains("button", "Ok").click();

    // cy.contains("div", "cypress@student.com").find("button").click();
  });

  it("studentCompleteQuiz", () => {
    cy.get("[placeholder='email']").type("cypress@student.com");
    cy.get("[placeholder='password']").type("password");
    cy.contains("button", "Login").click();
    cy.contains("h1", "Student profile");
    //select activity
    cy.contains("div", "test quiz")
      .should("contain", "class name")
      .should("contain", "cypress testing")
      .click();
    //complete quiz
    cy.contains("li", "20").click();
    cy.contains("button", "Complete").click();
    cy.contains("h1", "Completed");
    cy.contains("button", "Go To Shop").click();
  });

  it("check progress", () => {
    //login
    cy.get("[placeholder='email']").type("cypress@teacher.com");
    cy.get("[placeholder='password']").type("password");
    cy.get("[data-cy=toggleTeacher]").click();
    cy.contains("button", "Login").click();
    //check if diverted to correct page
    cy.contains("h1", "Teacher Profile");
    //go to all classes page
    cy.contains("a", "Classes").click();
    //check class added and access details
    cy.contains("div", "class name")
      .should("contain", "Year Group: 12")
      .click();
    //check student progress
    cy.contains("button", "Assignment").click();
    cy.contains("div", "test quiz").find("#ViewClassSubmissions").click();
    //check student completed assignment
    cy.contains("div", "cypress@student.com")
      .should("contain", "cypress testing")
      .should("contain", "1");
  });

  it("delete assignment", () => {
    //login
    cy.get("[placeholder='email']").type("cypress@teacher.com");
    cy.get("[placeholder='password']").type("password");
    cy.get("[data-cy=toggleTeacher]").click();
    cy.contains("button", "Login").click();
    //check if diverted to correct page
    cy.contains("h1", "Teacher Profile");
    //go to all classes page
    cy.contains("a", "Classes").click();
    //check class added and access details
    cy.contains("div", "class name")
      .should("contain", "Year Group: 12")
      .click();
    //delete assignment
    cy.contains("button", "Assignment").click();
    cy.contains("div", "test quiz").find("#DeleteQuiz").click();
    //confirm
    cy.contains("button", "Yes").click();
    cy.contains("div", "test quiz").find("#DeleteQuiz").should("not.exist");
  });

  it("delete class", () => {
    //login
    cy.get("[placeholder='email']").type("cypress@teacher.com");
    cy.get("[placeholder='password']").type("password");
    cy.get("[data-cy=toggleTeacher]").click();
    cy.contains("button", "Login").click();
    //check if diverted to correct page
    cy.contains("h1", "Teacher Profile");
    //go to all classes page
    cy.contains("a", "Classes").click();
    //check class added and access details
    cy.contains("div", "class name")
      .should("contain", "Year Group: 12")
      .click();
    //delete class
    cy.contains("button", "Delete Class").click();
    cy.contains("button", "Yes").click();
  });
});
