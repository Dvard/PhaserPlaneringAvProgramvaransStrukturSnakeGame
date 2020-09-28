const Menu = {

    preload: function () {
        game.load.image('btn', 'assets/btn.png');
    },

    create: function () {
        this.btn = this.add.button(0, 0, 'btn', this.startGame, this);
        this.btn.height = game.height;
        this.btn.width = game.width;
    },

    startGame: function () {
        game.state.start('MainGame');
    },

};
