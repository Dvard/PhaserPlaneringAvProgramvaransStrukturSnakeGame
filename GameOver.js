const GameOver = {

    preload: function () {
        game.load.image('game-over', 'assets/game-over.jpeg');
    },

    create: function () {
        this.btn = this.add.button(0, 0, 'game-over', this.startGame, this);
        this.btn.height = game.height;
        this.btn.width = game.width;
    },

    startGame: function () {
        game.state.start('MainGame');
    },

};
