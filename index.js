const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");


// TODO: Write Code to gather information about the development team members, and render the HTML file.
async function init() {
    const teamMembers = [];
    // Prompt for manager
    const managerInfo = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the manager's name?"
        },
        {
            type: "input",
            name: "id",
            message: "What is the manager's id?"
        },
        {
            type: "input",
            name: "email",
            message: "What is the manager's email?"
        },
        {
            type: "input",
            name: "officeNumber",
            message: "What is the manager's office number?"
        }
    ]);
    const manager = new Manager(managerInfo.name, managerInfo.id, managerInfo.email, managerInfo.officeNumber);
    teamMembers.push(manager);
    // Prompt for team members
    let addMore = true;
    while (addMore) {
        const memberType = await inquirer.prompt([
            {
                type: "list",
                name: "type",
                message: "What type of team member would you like to add?",
                choices: ["Engineer", "Intern", "I don't want to add any more team members"]
            }
        ]);
        if (memberType.type === "I don't want to add any more team members") {
            addMore = false;
            break;
        }
        const memberInfo = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: `What is the ${memberType.type.toLowerCase()}'s name?`
            },
            {
                type: "input",
                name: "id",
                message: `What is the ${memberType.type.toLowerCase()}'s id?`
            },
            {
                type: "input",
                name: "email",
                message: `What is the ${memberType.type.toLowerCase()}'s email?`
            }
        ]);
        if (memberType.type === "Engineer") {
            const engineerInfo = await inquirer.prompt([
                {
                    type: "input",
                    name: "github",
                    message: "What is the engineer's github?"
                }
            ]);
            const engineer = new Engineer(memberInfo.name, memberInfo.id, memberInfo.email, engineerInfo.github);
            teamMembers.push(engineer);
        } else {
            const internInfo = await inquirer.prompt([
                {
                    type: "input",
                    name: "school",
                    message: "What is the intern's school?"
                }
            ]);
            const intern = new Intern(memberInfo.name, memberInfo.id, memberInfo.email, internInfo.school);
            teamMembers.push(intern);
        }
    }
    // Generate html
    const html = render(teamMembers);
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    // Write to file
    fs.writeFileSync(outputPath, html);
    console.log("Team profile has been generated!");
}

init();
