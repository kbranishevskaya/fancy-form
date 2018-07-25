// Questions array
const questions = [
	{ question: 'Enter Your First Name' },
	{ question: 'Enter Your Last Name' },
	{ question: 'Enter Your Email', pattern: /\S+@\S+\.\S+/ },
	{ question: 'Create A Password', type: 'password'}
];

// Transition times
const shakeTime = 100; // Shake transition time
const switchTime = 200; // Transiton between questions

// Init Position At First Question 
let position = 0;

// Init DOM Elements 
const formBox = document.querySelector('#form-box');
const nextBtn = document.querySelector('#next-btn');
const prevBtn = document.querySelector('#prev-btn');
const inputGroup = document.querySelector('#input-group');
const inputField = document.querySelector('#input-field');
const inputLabel = document.querySelector('#input-label');
const inputProgress = document.querySelector('#input-progress');
const progress = document.querySelector('#progress-bar');

//Events
document.addEventListener('DOMContentLoaded', getQuestion);

// INput field enter click
inputField.addEventListener('keyup', e => {
	if (e.keyCode == 13) {
		validate();
	}
});

// Next btn click
nextBtn.addEventListener('click', validate);

// Prev btn click
prevBtn.addEventListener('click', stepBack);

//Functions
function getQuestion() {
	// Get current question
	inputLabel.innerHTML = questions[position].question;
	// Get current type
	inputField.type = questions[position].type || 'text';
	// Get current answer 
	inputField.value = questions[position].answer || '';
	// Focus on element
	inputField.focus();

	// Set progress bar width  
	progress.style.width = (position * 100) / questions.length + '%';

	// Add user icon or back arrow
	prevBtn.className = position ? 'fas fa-arrow-left' : 'fas fa-user';

	showQuestion();
}

// Display question to user
function showQuestion() {
	inputGroup.style.opacity = 1;
	inputProgress.style.transition = '';
	inputProgress.style.width = '100%';
}

// Hide question 
function hideQuestion() {
	inputGroup.style.opacity = 0;
	inputLabel.style.marginLeft = 0;
	inputProgress.style.width = 0;
	inputProgress.style.transition = 'none';
	inputGroup.style.border = null;
}

// Transorm to create shake motion
function transform(x, y) {
	formBox.style.transform = `translate(${x}px, ${y}px)`;
}

// Return to previous question
function stepBack() {
	position--;
	if (questions[position]) {
		hideQuestion();
		getQuestion();
	}
}

// Validate field
function validate() {
	// Make sure pattern matches if there is one
	if (!inputField.value.match(questions[position].pattern || /.+/)) {
		inputFail();
	} else {
		inputPass();
	}
}

// Field input fail
function inputFail() {
	formBox.className = 'error';
	// Repeat shake motion - set i to number of shakes
	for (let i = 0; i < 6; i++) {
		setTimeout(transform, shakeTime * i, ((i % 2) * 2 - 1) * 20, 0);
		setTimeout(transform, shakeTime * 6, 0, 0);
		inputField.focus();
	}
}

// Field input pass
function inputPass() {
	formBox.className = '';
	setTimeout(transform, shakeTime * 0, 0, 10);
	setTimeout(transform, shakeTime * 1, 0, 0);

	// Store answers
	questions[position].answer = inputField.value;

	// Increment position
	position++;

	// If new question, hide current, get next
	if (questions[position]) {
		hideQuestion();
		getQuestion();
	} else {
		// remove if no more
		hideQuestion();
		formBox.className = 'close';
		progress.style.width = '100%';

		// Form complete
		formComplete();
	}
}

// All fields complete
function formComplete() {
	const h1 = document.createElement('h1');
	h1.classList.add('end');
	h1.appendChild(document.createTextNode(`Thanks ${questions[0].answer}! You are registered!`));
	setTimeout(() => {
		formBox.parentElement.appendChild(h1);
		setTimeout(() => {
			h1.style.opacity = 1;
		}, 50);
	},1000);
}