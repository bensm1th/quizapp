function Quiz(quizObj) {
    this._data = quizObj.data;
    this._questionNumber = 1;
    this._quizStarted = false;
    this._currentAnswer = "";
    this._reviewMode = false;
}


Quiz.prototype.addTextToRightSide = function() {
    //i probably have to use jQuery, or use a javascript equivalent 
    if (this._data[this._questionNumber-1].text) {
        var rightSideEl = document.getElementById('rightContainer');
        rightSideEl.insertAdjacentHTML('beforeend', this._data[this._questionNumber-1].text);
        return;
    }
    this.removeTextFromRightSide();
}



Quiz.prototype.removeTextFromRightSide = function() {
    //change to jQuery'
    $('#rightContainer').empty();
}


Quiz.prototype.addTextToAnswerChoices = function() {
    //the function below seems to not be working, because it adds the text for one question, and then it remains even
    //if the right side text isn't a part of the next questions object
    this.addTextToRightSide();
    let answers = this._data[this._questionNumber-1];
    answers.choices.forEach((choice, i) => {
        if (i === 0) {
            if (choice.includes('<' && choice.includes('>'))) {
                $('#Atext').empty();
                return $('#Atext').append(choice);
            }
            var answerA = document.getElementById("Atext");
            answerA.textContent = choice;
        }
        if (i === 1) {
            if (choice.includes('<') && choice.includes('>')) {
                $('#Btext').empty();
                return $('#Btext').append(choice);
            }
            var answerB = document.getElementById("Btext");
            answerB.textContent = choice;
            
        }
        if (i === 2) {
            if (choice.includes('<') && choice.includes('>')) {
                $('#Ctext').empty();
                return $('#Ctext').append(choice);
            }
            var answerC = document.getElementById("Ctext");
            answerC.textContent = choice;
        }
        if (i === 3) {
            if (choice.includes('<') && choice.includes('>')) {
                $('#Dtext').empty();
                return $('#Dtext').append(choice);
            }
            var answerD = document.getElementById("Dtext");
            answerD.textContent = choice;           
        }
    })
}

Quiz.prototype.addTextToQuestion = function() {
    var questionEl = document.getElementById("question");
    var questionObj = this._data[this._questionNumber - 1];
    if (questionObj.questionHTML) {
        return this.addHTMLtoQuestion();
    }
    var questionText = questionObj.question;
    questionEl.textContent = questionText;
}

Quiz.prototype.addHTMLtoQuestion = function() {
    //remove previous html first
    $('#question').empty();
    var questionObj = this._data[this._questionNumber - 1];
    var question = questionObj.question;
    $('#question').append(question);
}

Quiz.prototype.changeProgressBar = function(percent) {
    var progressBar = $('#progressBar');
    progressBar.attr({ 'aria-valuenow': percent});
    progressBar.css('width', percent*100+"%")
    //add a div and add text before the progress bar
    var progressText = $('#progress-text');
    progressText.text('Answered ' + this._questionNumber + ' of ' + this._data.length);
}

Quiz.prototype.submitAnswer = function() {
    if (this._currentAnswer.length === 0) {

        var alert = $('#no-answer-alert');
        alert.show();
        return;
    }
    if (this._questionNumber !== this._data.length){
        var alert = $('#no-answer-alert');
        alert.hide();
        this._data.forEach((choice, i) => {
            if (i === this._questionNumber - 1) {
                choice.choice = this._currentAnswer;
                this._data[i+1].visited = true;
            }
        })
        var percent = this._questionNumber/(this._data.length);
        this.changeProgressBar(percent);
        this._questionNumber++;
        this.toggleSelectedAnswerBack();
        this._currentAnswer = ""
        this.addTextToQuestion();
        this.addTextToAnswerChoices();
        this.buttonVisibility();
        return;
    }
    var percent = this._questionNumber/(this._data.length);
    this.changeProgressBar(percent);
    //remove quiz
    this.removeQuiz();
    //ask for email
    var hiddenAsk = document.getElementById("emailAsk");
    hiddenAsk.style.display = "flex"
}


Quiz.prototype.removeQuiz = function() {
    //use jquery instead
    // $('#leftContainer').empty();
    // $('#rightContainer').empty();
    var leftSide = document.getElementById("leftContainer");
    var rightSide = document.getElementById("rightContainer");
    leftSide.parentNode.removeChild(leftSide);
    rightSide.parentNode.removeChild(rightSide);
}

Quiz.prototype.selectAnswer = function(answer) {
    //turn the previous choice back
    if (!answer) return;
    if (this._currentAnswer !== "") {
        this.toggleSelectedAnswerBack();
    }

    this._currentAnswer = answer;
    var target = answer + "text";
    var answerChoiceEl = document.getElementById(target).previousElementSibling;
    answerChoiceEl.setAttribute("class", "answerChoiceSelected")
}

Quiz.prototype.toggleSelectedAnswerBack = function() {
    if (this._currentAnswer === "") {
        return;
    }
    var toggleBackTarget = this._currentAnswer + "text";
    var toggleBackEl = document.getElementById(toggleBackTarget).previousElementSibling;
    toggleBackEl.setAttribute("class", "answerChoice")
}

Quiz.prototype.goBack =function() {
    var alert = $('#no-answer-alert');
    alert.hide();
    this._questionNumber -= 1;
    //set current answer
    this.toggleSelectedAnswerBack();
    this._currentAnswer = this._data[questionNumber - 1].choice;
    this.selectAnswer(currentAnswer);
    this.addTextToQuestion();
    this.addTextToAnswerChoices();
    this.buttonVisibility();
}

Quiz.prototype.goForward =function() {
    var alert = $('#no-answer-alert');
    alert.hide();
    this._questionNumber += 1;
    //set current answer
    this.toggleSelectedAnswerBack();

    this._currentAnswer = this._data[this._questionNumber - 1].choice;
    this.selectAnswer(currentAnswer);

    this.addTextToQuestion();
    this.addTextToAnswerChoices();
    this.buttonVisibility();
}

Quiz.prototype.hideBackButton = function() {
    var backButtonEl = document.getElementById("back");
    backButtonEl.style.display = "none";
}

Quiz.prototype.hideForwardButton = function() {
    var forwardButtonEl = document.getElementById("forward");
    forwardButtonEl.style.display = "none";
}

Quiz.prototype.displayForwardButton = function(number) {
    if (this._data[number].visited) {
        var forwardButtonEl = document.getElementById("forward");
        forwardButtonEl.style.display = "inline";
    }
}

Quiz.prototype.displayBackButton = function() {
    var backButtonEl = document.getElementById("back");
    backButtonEl.style.display = "inline";
}

Quiz.prototype.buttonVisibility = function() {
//switch over question number
    var middleCases = this._data.length;
    switch(this._questionNumber) {
        //case 1
        case 1:
            //no back button ever
            this.hideBackButton();
            if (middleCases === 1) {
                return this.hideForwardButton();
            }
            if (this._data[1].visited === false) {
                this.hideForwardButton()
                break;
            }
            //only a forward button if the next question is already answered
            this.displayForwardButton(1);
            break;
        case this._data.length:
            //always a back button
            this.displayBackButton();
            //never a forward button
            this.hideForwardButton();
            break;
        default:
            //always a back button
            this.displayBackButton();
            //only a forward button if the next question is already answered
            if (this._data[this._questionNumber].visited === false) {
                this.hideForwardButton();
                break;
            }
            this.displayForwardButton(this._questionNumber);
            break;
    }
}

Quiz.prototype.validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


Quiz.prototype.init = function() {
    var that = this;
    $('#Aselect').click(function() {
        that.selectAnswer('A')
    });
    
    $('#Bselect').click(function() {
        that.selectAnswer('B')
    });
    
    $('#Cselect').click(function() {
        that.selectAnswer('C')
    });
    
    $('#Dselect').click(function() {
        that.selectAnswer('D')
    });
    
    $('#back').click(function() {
        that.goBack();
    });
    
    $('#forward').click(function() {
        that.goForward();
    });
    
    $('#submit-button').click(function() {
        that.submitAnswer();
    });
    
    //collect email
    $('#email-submit').click(function() {
        var email = $('#email').val();
        var emailIsValid = validateEmail(email);
        if (emailIsValid) {
            that._reviewMode = true;
            //remove email stuff
            //calculate and show score
            //ask to share on facebook
        } else {
            //create a pop up that says "please enter a valid email"
            console.log('please enter a valid email');
        }
    })
    if (this._questionNumber === 1) {
        //add a div and add text before the progress bar
        // var progressText = document.getElementById('progress-text');
        // progressText.text = questionNumber - 1 + ' of ' + data.length
        var progressText = $('#progress-text');
        progressText.text('Answered ' + (this._questionNumber - 1) + ' of ' + this._data.length);
    }
    this.buttonVisibility()
    this.addTextToQuestion();
    this.addTextToAnswerChoices();
}