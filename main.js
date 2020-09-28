const game = new Phaser.Game(400, 400, Phaser.AUTO, 'gameDiv');

game.state.add('Menu', Menu);
game.state.add('MainGame', MainGame);
game.state.add('GameOver', GameOver);

game.state.start('Menu');
