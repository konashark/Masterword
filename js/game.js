var GAME = {};   // Create a placeholder for our new State module

(function() {
    var log  = function(str) { console.log(this.id + ': ' + str);}.bind(this);

    this.id = 'GAME';
    this.route = 'routeGame';
    this.flags = {
        asyncExit: true
    };

    var canvas = document.getElementById("playfield");
    var ctx = canvas.getContext("2d");

    var solution = '';
    var guess = '';
    var currentRound = 0;
    var currentColumn = 0;

    // Constant Variables (macros)
    var RUNNING = 0;
    var PAUSED = 1;     // message scren is up
    var WAITING = 2;    // Waiting to restart
    var gameState = RUNNING;

    var PLAYFIELD_WIDTH = 1000;
    var PLAYFIELD_HEIGHT = 1280;
    var TILE_SIZE = 120;
    var TILE_SPACING = 12;
    var ROWS = 6;
    var COLS = 5;

    // Tile states
    var NOPE = "#222";
    var MATCH = "#181";
    var ALMOST = "#DA0";
    var NOT_GUESSED = "#444";

    var matrix = [];

    var letterset = 'abcdefghijklmnopqrstuvwxyz';
    var letters = [];   // Keeps track of letter usage and state

    log('Loaded');

    // ********************************************
    this.init = function (params) {
        log('Initializing ' + this.id);

        solution = dictionary[Math.floor(Math.random() * dictionary.length)];
        log ("Solution = " + solution);
        guess = "";

        currentRound = 0;
        currentColumn = 0;

        matrix = [
            [{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE}],
            [{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE}],
            [{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE}],
            [{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE}],
            [{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE}],
            [{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE},{char: ' ', state: NOPE}]
        ];

        for (var i = 0; i < 26; i++ ) {
            letters[letterset.charAt(i)] = { char: letterset.charAt(i).toUpperCase(), state: NOT_GUESSED }
        }

        gameState = RUNNING;
        redraw();
    };

    // ********************************************
    this.enter = function (currentState, userData) {
        log('Entering ' + this.id);

        this.init();

        // Activate our screen
        var elem = document.getElementById(this.id);
        elem.classList.add('show');
    };

    // ********************************************
    this.exit = function (callback) {
        log('Exiting ' + this.id);

        // Deactivate our screen
        var elem = document.getElementById(this.id);
        elem.classList.remove('show');
    };

    // ********************************************
    this.eventHandler = function (event) {

        if (!event.keyCode) {
            return;
        }

        // Events are forwarded to us from the main start-up code.
        // We must reply whether we used the event or not.
        var consumed = false;

        var key = event.key;
        var keyCode = event.keyCode;

        if (gameState == WAITING) {     // Waiting for user to press ENTER from a pop-up box
            if (keyCode == jgl.KEYS.ENTER) {
                this.init();    // Restart game
            }
            return true;
        }

        // If in RUNNING state, process keystrokes
        if (key >= 'a' && key <= 'z') {
            if (currentColumn < COLS) {
                matrix[currentRound][currentColumn].char = key;
                currentColumn++;
                consumed = true;
            }
        }

        switch (keyCode) {
            case jgl.KEYS.ENTER: {
                consumed = true;
                if (evaluateEntry()) {
                    if (guess == solution) {
                        redraw();
                        gameState = WAITING;
                        drawEnd(true);
                        return consumed;
                    } else {
                        if (currentRound < (ROWS - 1)){
                            currentRound++;
                            currentColumn = 0;
                        } else {
                            redraw();
                            gameState = WAITING;
                            drawEnd(false);
                            return consumed;
                        }
                    }
                } else {
                    // Tell user they picked an invalid word
                    redraw();
                    gameState = PAUSED;
                    drawInvalidWord();
                    window.setTimeout(function() {
                        gameState = RUNNING;
                        redraw();
                    }, 2500);
                    return consumed;
                }
                break;
            }

            case jgl.KEYS.DELETE: {
                if (currentColumn > 0) {
                    matrix[currentRound][--currentColumn].char = ' ';
                    consumed = true;
                }
                break;
            }

            case jgl.KEYS.LEFT: {
                if (currentColumn > 0) {
                    currentColumn--;
                    consumed = true;
                }
                break;
            }

            case jgl.KEYS.RIGHT: {
                if (currentColumn < (COLS - 1)) {
                    currentColumn++;
                    consumed = true;
                }
                break;
            }
        }

        redraw();

        return consumed;
    }.bind(this);

    // ********************************************
    redraw = function() {

        ctx.fillStyle = "#0C0C1C";
        ctx.fillRect(0, 0, PLAYFIELD_WIDTH, PLAYFIELD_HEIGHT);

        ctx.strokeStyle = "#239";
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, PLAYFIELD_WIDTH, PLAYFIELD_HEIGHT);

        ctx.font = "bold 48px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText('MASTERWORD', 500 - (ctx.measureText('MASTERWORD').width / 2), 80);

        var x,y;

        ctx.font = "bold 64px sans-serif";
        for (var r = 0; r < ROWS; r++) {
            for (var c = 0; c < COLS; c++) {
                x = 172 + (c * (TILE_SIZE + TILE_SPACING));
                y = 150 + (r * (TILE_SIZE + TILE_SPACING));

                if (r == currentRound && c == currentColumn) {
                    ctx.fillStyle = "#555";
                } else {
                    ctx.fillStyle = matrix[r][c].state;
                }
                ctx.fillRect(x, y,TILE_SIZE, TILE_SIZE);

                ctx.strokeStyle = "#999";
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y,TILE_SIZE, TILE_SIZE);

                ctx.fillStyle = "#fff";
                var char = matrix[r][c].char.toUpperCase();
                var width = ctx.measureText(char).width;
                ctx.fillText(char, x + (TILE_SIZE / 2) - (width / 2) - 1, y + 83);
            }
        }

        if (currentColumn == COLS) { // Already entered a full row
            x = 172 + ((COLS - 1) * (TILE_SIZE + TILE_SPACING));
        } else {
            x = 172 + (currentColumn * (TILE_SIZE + TILE_SPACING));
        }

        y = 150 + (currentRound * (TILE_SIZE + TILE_SPACING));

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y,TILE_SIZE, TILE_SIZE);

        // Draw LETTER SET
        for (var i = 0; i < 26; i++ ) {
            x = 90 + ((i % 13) * 64);
            y = 990 + ((i > 12) * 64);

            var ltr = letters[letterset.charAt(i)];

            ctx.fillStyle = ltr.state;
            ctx.fillRect(x, y, 54, 54);

            ctx.font = "bold 40px sans-serif";
            ctx.fillStyle = ltr.state;
            ctx.fillStyle = "#fff";
            if (ltr.state == NOPE) {
                ctx.fillStyle = "#444";
            }
            ctx.fillText(ltr.char, x + 27 - (ctx.measureText(ltr.char).width / 2), y + 41);
        }

    };

    // ********************************************
    drawInvalidWord = function() {
        ctx.fillStyle = "#222222AA";
        ctx.fillRect(114, 330, 772, 140);

        ctx.strokeStyle = "#CCCCCCAA";
        ctx.lineWidth = 5;
        ctx.strokeRect(114, 330, 772, 140);

        ctx.font = "bold 36px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText('MASTERWORD', 500 - (ctx.measureText('MASTERWORD').width / 2), 380);

        ctx.font = "bold 30px sans-serif";
        var str = "'" + guess + "' is not in the dictionary!";
        ctx.fillStyle = "#DA0";
        ctx.fillText(str, 500 - (ctx.measureText(str).width / 2), 435);
    };

    // ********************************************
    drawEnd = function(didWin) {
        ctx.fillStyle = "#222222BB";
        ctx.fillRect(114, 330, 772, 235);

        ctx.strokeStyle = "#CCCCCC";
        ctx.lineWidth = 3;
        ctx.strokeRect(114, 330, 772, 235);

        ctx.font = "bold 40px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText('MASTERWORD', 500 - (ctx.measureText('MASTERWORD').width / 2), 380);

        ctx.font = "bold 36px sans-serif";
        var roundMsg = ["Oh, come on. No one's that lucky!", "Very clever!", "Great deductions!", "Way to go!", "Nicely done", "Whew!"]
        var str, str2;

        if (didWin) {
            str = "YOU WON!";
            str2 = roundMsg[currentRound];
        } else {
            str = "Sorry, you've run out of guesses!";
            str2 = "The solution was '" + solution + "'";
        }

        ctx.fillStyle = "#DA0";
        ctx.fillText(str, 500 - (ctx.measureText(str).width / 2), 440);

        ctx.fillStyle = "#1A1";
        ctx.fillText(str2, 500 - (ctx.measureText(str2).width / 2), 480);

        str = "Press ENTER to play again";
        ctx.fillStyle = "#fff";
        ctx.fillText(str, 500 - (ctx.measureText(str).width / 2), 540);
    };

    // ********************************************
    evaluateEntry = function() {
        guess = matrix[currentRound][0].char +
            matrix[currentRound][1].char +
            matrix[currentRound][2].char +
            matrix[currentRound][3].char +
            matrix[currentRound][4].char;

        log("Guess = " + guess);

        if (dictionary.indexOf(guess) < 0) {
            log("'" + guess + "' IS NOT a dictionary word!");
            return false;
        }

        log("'" + guess + "' IS a dictionary word!");

        for (var i = 0; i < COLS; i++) {
            var inWordPos = solution.indexOf(guess[i]);

            if (inWordPos < 0) {
                matrix[currentRound][i].state = NOPE;
                letters[guess[i]].state = NOPE;
            } else {
                // Nasty corner-case. Say we've chosen a letter that IS in the puzzle at a different location.
                // BUT the letter at that location is alredy matched (green). Should this second instance of the
                // letter be yellow, or should it only evaluate against unatched tiles, and therefore be gray?
                // Consider: solution = STEAM
                // S T E A L
                // S T E L E
                // User has already guessed the "S T E" part, so what sholud the second 'e' be flagged as?
                // A. Only flag a tile as "almost" if it matches a tile that is currently NOT a match
                var found = false;
                // See if the current 'guess' character is anywhere in the solution
                for (var e = 0; e < COLS; e++) {
                    if (guess[i] == solution[e]){  // This tile we're evaluating is a match...
                        // ... unless it's a perfect match
                        if (guess[e] != solution[e]) {
                            found = true;
                            break;
                        }
                    }
                }
                if (found) {
                    // Mark it yellow for being in the word
                    matrix[currentRound][i].state = ALMOST;
                    letters[guess[i]].state = ALMOST;
                }

                if (guess[i] == solution[i]) {
                    // overwrite with green if in the right position
                    matrix[currentRound][i].state = MATCH;
                    letters[guess[i]].state = MATCH;
                }
            }
        }

        return true;
    };

}).apply(GAME);  // Apply this object to the State placeholder we defined
