(function () {
    var model = {
        rowPatterns: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7]
        ],
        firstPlayerTurn: true,
        message: {
            start: 'New Game Started!',
            end: null
        },
        isOver: false,
        isTie: false,
        winPattern: null,
        init: function () {
            this.player1 = this.createPlayer('x');
            this.player2 = this.createPlayer('o');
        },
        createPlayer: function (f) {
            var moves = [],
                totalWins = 0,
                flag = f;

            var player = function (cellId) {
                moves.push(Number(cellId));

                if (moves.length >= 3) {
                    if (this.gameHasWinner(moves)) {
                        totalWins++;
                        this.message.end = flag + ' Wins!'
                        this.isOver = true;
                    } else if (this.isTieGame(moves)) {
                        this.message.end = 'Its a tie!';
                        this.isOver = true;
                        this.isTie = true;
                    }
                }
            }.bind(this);

            player.getFlag = function () {
                return flag;
            };

            player.resetMoves = function () {
                moves = [];
            };

            player.resetStats = function () {
                totalWins = 0;
            };

            player.getStats = function () {
                return totalWins;
            };

            return player;
        },
        gameHasWinner: function (playerArr) {
            for (var i = 0; i < this.rowPatterns.length; i++) {
                var res = this.rowPatterns[i].every(function (item) {
                    return playerArr.indexOf(item) > -1;
                });
                if (res) {
                    this.winPattern = this.rowPatterns[i];
                    return true;
                }
                if (i === this.rowPatterns.length - 1 && !res) {
                    return false;
                }
            }
        },
        isTieGame: function (moves) {
            return moves.length === 5;
        },
        getCurrentPlayer: function () {
            return (this.firstPlayerTurn) ? this.player1 : this.player2;
        },
        switchPlayers: function () {
            this.firstPlayerTurn = !this.firstPlayerTurn;
        },
        restartGame: function () {
            this.firstPlayerTurn = true;
            this.isOver = false;
            this.player1.resetMoves();
            this.player2.resetMoves();
        },
        resetGame: function () {
            this.restartGame();
            this.player1.resetStats();
            this.player2.resetStats();
        }
    };

    var view = {
        field: document.getElementById('playingField'),
        restartBtn: document.getElementById('restart'),
        resetBtn: document.getElementById('resetStats'),
        cells: document.getElementsByTagName('td'),
        xStat: document.getElementById('xStat'),
        oStat: document.getElementById('oStat'),
        statsContainer: document.getElementsByClassName('stats'),
        messageBox: document.getElementById('message'),
        init: function (data) {
            this.bindEvents();
            this.showActivePlayer();
            this.renderMessage(data.message)
        },
        bindEvents: function () {
            this.field.addEventListener('click', controller.makeMove);
            this.restartBtn.addEventListener('click', controller.restartGame);
            this.resetBtn.addEventListener('click', controller.resetGame.bind(controller));
        },
        clearField: function () {
            for (var i = 0; i < this.cells.length; i++) {
                this.cells[i].innerText = '';
                this.cells[i].setAttribute('data-used', '');
            }
        },
        blockField: function () {
            for (var i = 0; i < this.cells.length; i++) {
                this.cells[i].setAttribute('data-used', 'true');
            }
        },
        showActivePlayer: function () {
            var className = 'active';
            var el = this.statsContainer[0];
            if (el.classList.contains(className)) {
                el.classList.remove(className);
                this.statsContainer[1].classList.add(className);
            } else {
                el.classList.add(className);
                this.statsContainer[1].classList.remove(className);
            }
        },
        showWinningLine: function (arr) {
            var el;
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < this.cells.length; j++) {
                    el = this.cells[j];
                    if(el.getAttribute('data-cell') == arr[i]) {
                        el.classList.add('marked')
                    }
                }
            }
        },
        hideWinningLine: function () {
            for (var i = 0; i < this.cells.length; i++) {
                this.cells[i].classList.remove('marked');
            }
        },
        renderStats: function (obj) {
            this.xStat.innerText = obj.a;
            this.oStat.innerText = obj.b;
        },
        renderMessage: function (message) {
            this.messageBox.innerText = message;
        }
    };

    var controller = {
        init: function () {
            model.init();
            view.init({
                message: model.message.start
            });
        },
        makeMove: function (e) {
            var tgt = e.target;
            if (tgt.tagName.toLowerCase() === 'td' && !tgt.getAttribute('data-used')) {
                var player = model.getCurrentPlayer();
                player(tgt.getAttribute('data-cell'));
                tgt.innerText = player.getFlag();
                tgt.setAttribute('data-used', 'true');
                model.switchPlayers();
                view.showActivePlayer();
                if (model.isOver) {
                    view.renderMessage(model.message.end);
                    view.renderStats({
                        a: model.player1.getStats(),
                        b: model.player2.getStats()
                    });
                    view.blockField();
                    if (!model.isTie) {
                        view.showWinningLine(model.winPattern);
                    }
                }
            }
        },
        restartGame: function () {
            model.restartGame();
            view.clearField();
            view.showActivePlayer();
            view.renderMessage(model.message.start);
            view.hideWinningLine();
        },
        resetGame: function () {
            model.resetGame();
            this.restartGame();
            view.renderStats({
                a: model.player1.getStats(),
                b: model.player2.getStats()
            });
        }
    };

    controller.init();
})();