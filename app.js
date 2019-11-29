const inquirer = require("inquirer");
const fs = require("fs");
let team = [];

const managerQuestions = [
  {
    name: "name",
    message: "Please enter the Team Manager´s Name?"
  },
  {
    name: "id",
    message: "What is the Team Manager´s Id?"
  },
  {
    name: "mail",
    message: "What is the Team Manager´s Email?"
  },
  {
    name: "officeNumber",
    message: "What is Team Manager´s office Number?"
  }
];

const memberQuestions = [
  {
    name: "name",
    message: "Please enter a Team Member Name?"
  },
  {
    name: "id",
    message: "What is the Team Memeber´s Id?"
  },
  {
    name: "mail",
    message: "What is Team Memeber´s Email?"
  },
  {
    name: "role",
    message: "What is Team Memeber´s Role in the company?"
  },
  {
    name: "school",
    message: "In which School does the Team Member study?",
    when: function(answers) {
      return answers.role == "Intern";
    }
  },
  {
    name: "github",
    message: "What is Team Memeber´s GitHub Username?",
    when: function(answers) {
      return answers.role == "Engineer";
    }
  },
  {
    type: "confirm",
    name: "anotherMember",
    message: "Do you want to add another Team Member?",
    default: true
  }
];

async function teamQuestions() {
  const teamManager = await inquirer.prompt(managerQuestions);
  team.push(teamManager);
  async function addMember() {
    const teamMembers = await inquirer.prompt(memberQuestions);
    team.push(teamMembers);
    return teamMembers.anotherMember ? addMember() : console.log(team);
  }
  addMember();
}

async function getHtmls() {
  let main = fs.readFile("templates/main.html", "utf8", (err, data) => {
    console.log(data);
  });
  let engineer = fs.readFile("templates/engineer.html", "utf8", (err, data) => {
    console.log(data);
  });
  let manager = fs.readFile("templates/manager.html", "utf8", (err, data) => {
    console.log(data);
  });
  let intern = fs.readFile("templates/intern.html", "utf8", (err, data) => {
    console.log(data);
  });
}

getHtmls();
teamQuestions();
