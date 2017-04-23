var _ = require('lodash'),
    input = String(require('yargs').argv.input),
    guessStore = [],
    numberOfAttempts = 1;

function addToGuessStore(guess, score) {
    guessStore.push({ guess: guess, bothValueAndPosition: score.bothValueAndPosition, valueButNotPosition: score.valueButNotPosition });
}

function getScore(answer, guess) {
    //split numbers and guesses into arrays for easier manipulation
    var response = { "bothValueAndPosition": 0, "valueButNotPosition": 0 },
        answerArray = _.clone(answer),
        guessArray = _.clone(guess), len = answerArray.length;
    //count correct by both position and value
    for (var i = 0; i < len; i++) {
        if (answerArray[i] == guessArray[i]) {
            response.bothValueAndPosition += 1;
            answerArray[i] = -1;
            guessArray[i] = -2;
        }
    }
    for (var j = 0; j < len; j++) {
        for (var k = 0; k < len; k++) {
            if (answerArray[j] == guessArray[k]) {
                response.valueButNotPosition += 1;
                answerArray[j] = -1;
                guessArray[k] = -2;
            }

        }
    }
    return response;
}


function getRandomDigit() {
    return Math.floor(Math.random() * 10);
    //10 because (max digit - mindigit + 1) = (9-0+1)
}

function generateGuess(noOfDigits) {
    var guessNumber = noOfDigits == 4 ? [1, 1, 2, 2] : [1, 1, 1, 2, 2, 2];
    return numberOfAttempts == 1 ? guessNumber : _.map(guessNumber, getRandomDigit);
}

function guessContradicts(guess) {
    var contradictionFound = false;
    guessStore.forEach(function(guessEntry, index) {
        if (guessEntry && guessEntry.bothValueAndPosition) {
            var judgement = getScore(guess, guessEntry.guess);
            if ((judgement.bothValueAndPosition != guessEntry.bothValueAndPosition) || (judgement.valueButNotPosition != guessEntry.valueButNotPosition)) {
                contradictionFound = true;
            }
        }
    });
    return contradictionFound;
}


(function() {

    input = input.split('');
    console.log("The Number entered is - " + input.join(' '));

    var guess = generateGuess(6),
        score = getScore(input, guess);

    while (score.bothValueAndPosition != 6) {
        //log score and attempt number
        addToGuessStore(guess, score);
        numberOfAttempts += 1;
        console.log("Guess No "+numberOfAttempts+" - "+guess);
        //generate new guess
        guess = generateGuess(6);
        //check if it contradicts any old guesses
        while (guessContradicts(guess)) {
            guess = generateGuess(6);
        }
        //get new score
        score = getScore(input,guess);
    }
console.log('Your number is - ',guess.join(''));
}());
