let filters;
let employees = [];

class Employee {

	constructor(name, role, bio, skills, image) {
		this.name = name;
		this.role = role;
		this.bio = bio;
		this.skills = skills;
		this.image = image;
	}
}

function retrieveData () {
	let request = new XMLHttpRequest();
	request.open('GET', 'http://sys4.open-web.nl/employees.json');
	request.onload = function () {
	  const data = JSON.parse(request.response);
	  employees = createEmployees(data.employees);
	  createSkillsFilter(data);
	};
	request.send(null);	
}

function createEmployees (employees) {

	const results = [];

	for (let i = 0; i < employees.length; i++){
		const employee = new Employee(employees[i].name, employees[i].role, employees[i].bio, employees[i].skills, employees[i].profileImage);
		drawEmployeeOnDom(employee);
		results.push(employee);
	}
	return results;
}

function drawEmployeeOnDom (employee) {
	const htmlTemplate =
		`<div class="employee">
		<span>${employee.name}</span>
		<span>${employee.role}</span>
		<img src="${employee.image}" alt="Geen afbeelding beschikbaar"/>
		</div>`;
	$( htmlTemplate ).appendTo("#employees");
}

function createSkillsFilter (data) {
	filters = collectSkills(data);
	createFilterElements(filters);
	return filters;
}

function collectSkills (list) {
	filters = new Set();
	for (let employee of list.employees) {
		for (let skill of employee.skills) {
			filters.add(skill);
		}
	}
	return filters;
}

function filterSkills (skill, checked){
	const employeesFiltered = [];

	if (checked) {
		filters.add(skill);
	} else {
		filters.delete(skill);
	}

	let test = Array.from(filters);

	employees.forEach(function(employee) {

		const matches = [];

		employee.skills.forEach(function(skill) {
			if (test.includes(skill)) {
				matches.push(skill);
			}
		});

		if (matches.length >0) {
			employeesFiltered.push(employee);
		}
	});

	$('#employees').empty();
	employeesFiltered.forEach(function(employee) {
		drawEmployeeOnDom(employee);
	})

}

function createFilterElements(list) {
	for (let skill of list) {
		const htmlTemplate =
			`<input class="skill" type="checkbox" onchange="filterSkills('${skill}', checked)" checked="true">
			<label>${skill}</label>
			`;
		$(htmlTemplate).appendTo("#filters");
	}

}

retrieveData();