const inquirer = require("inquirer");
const fs = require("fs").promises;
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
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
    type: "list",
    name: "role",
    message: "What is Team Memeber´s Role in the company?",
    choices: ["Intern", "Engineer"]
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
    return teamMembers.anotherMember ? addMember() : generateHTML(team);
  }
  addMember();
}

async function generateHTML(team) {
  let main = await fs.readFile("templates/main.html", "utf8");
  let engineer = await fs.readFile("templates/engineer.html", "utf8");
  let manager = await fs.readFile("templates/manager.html", "utf8");
  let intern = await fs.readFile("templates/intern.html", "utf8");
  let managerObj = new Manager(
    team[0].name,
    team[0].id,
    team[0].mail,
    team[0].officeNumber
  );
  let internArray = team.filter(member => member.role == "Intern");
  let engineerArray = team.filter(member => member.role == "Engineer");
  let arrInternObj = internArray.map(
    intern => new Intern(intern.name, intern.id, intern.mail, intern.school)
  );
  let arrEngineerObj = engineerArray.map(
    engineer =>
      new Engineer(engineer.name, engineer.id, engineer.mail, engineer.github)
  );

  let managerHTML = manager
    .replace(/{{name}}/g, managerObj.name)
    .replace(/{{id}}/g, managerObj.id)
    .replace(/{{email}}/g, managerObj.email)
    .replace(/{{office}}/g, managerObj.officeNumber);

  let rosterHTML = managerHTML;

  let internHTML = arrInternObj.forEach(internEl => {
    rosterHTML += intern
      .replace(/{{name}}/g, internEl.name)
      .replace(/{{id}}/g, internEl.id)
      .replace(/{{email}}/g, internEl.email)
      .replace(/{{school}}/g, internEl.school);
  });

  let engineerHTML = arrEngineerObj.forEach(engineerEl => {
    rosterHTML += engineer
      .replace(/{{name}}/g, engineerEl.name)
      .replace(/{{id}}/g, engineerEl.id)
      .replace(/{{email}}/g, engineerEl.email)
      .replace(/{{github}}/g, engineerEl.github);
  });

  let teamHTML = main.replace(/{{rosterHTML}}/g, rosterHTML);

  fs.writeFile("output/team.html", teamHTML, function(err) {
    if (err) throw err;
    console.log("Saved!");
  });
}

teamQuestions();
