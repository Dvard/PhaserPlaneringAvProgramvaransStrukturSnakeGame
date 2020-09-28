const MainGame = {
	// These values are used for controlling the "speed" of update().
	counter: 0,
	frames: 0,

	rez: 20,
	score: 0,

	food: {
		sprite: null,
	},

	snake: {
		body: [],
		xDir: 1,
		yDir: 0,
	},

	eat: function () {
		this.eatSound.play();
		this.score++;
		this.text.text = this.score;

		let tmp_x, tmp_y;

		if (this.snake.yDir) {
			tmp_x = this.snake.body[this.snake.body.length-1].sprite.x;
			tmp_y = this.snake.body[this.snake.body.length-1].sprite.y - this.rez;
		} else {
			tmp_x = this.snake.body[this.snake.body.length-1].sprite.x - this.rez;
			tmp_y = this.snake.body[this.snake.body.length-1].sprite.y;
		}

		let tmp_sprite = game.add.sprite(tmp_x, tmp_y, 'body')
		tmp_sprite.height = this.rez;
		tmp_sprite.width = this.rez;

		this.snake.body.push(
			{
				sprite: tmp_sprite,
			}
		);

		this.frames -= 0.1;
	},

	// Loads the snake's cell positions.
	updateSnake: function () {
		let last_x = null, last_y = null;

		for (let i = 0; i < this.snake.body.length; i++) {
			if (last_x !== null && last_y !== null) {
				const tmp_last_x = last_x;
				const tmp_last_y = last_y;

				last_x = this.snake.body[i].sprite.x;
				last_y = this.snake.body[i].sprite.y;

				this.snake.body[i].sprite.x = tmp_last_x;
				this.snake.body[i].sprite.y = tmp_last_y;
			} else {
				last_x = this.snake.body[i].sprite.x;
				last_y = this.snake.body[i].sprite.y;

				this.snake.body[i].sprite.x += this.snake.xDir * this.rez;
				this.snake.body[i].sprite.y += this.snake.yDir * this.rez;
			}
		}
	},

	preload: function() {
		game.load.image('food', './assets/food.gif');
		game.load.image('body', './assets/body.gif');
		game.load.image('head', './assets/head.gif');
		game.load.image('end', './assets/end.gif');
		game.stage.backgroundColor = '#dddddd';

		game.load.audio('eat', './assets/eat.m4a');
		game.load.audio('die', './assets/die.m4a');

		game.load.image('arrow', './assets/arrow.png');
	},

	create: function () {
		this.text = game.add.text(0, 0, this.score);

		this.cursors = game.cursors;
		this.cursors = game.input.keyboard.createCursorKeys();

		this.food.sprite = game.add.sprite(0, 0, 'food');
		this.food.sprite.height = this.rez;
		this.food.sprite.width = this.rez;

		this.eatSound = game.add.sound('eat');
		this.dieSound = game.add.sound('die');

		this.leftBtn = game.add.sprite(140, 340, 'arrow');
		this.upBtn = game.add.sprite(180, 300, 'arrow');
		this.rightBtn = game.add.sprite(220, 340, 'arrow');
		this.downBtn = game.add.sprite(180, 380, 'arrow');

		[this.leftBtn, this.upBtn, this.rightBtn, this.downBtn].forEach(btn => {
			btn.height = this.rez * 2;
			btn.width = this.rez * 2;
			btn.anchor.setTo(.5, .5);
			btn.inputEnabled = true;
		})

		this.leftBtn.angle -= 90;
		this.rightBtn.angle += 90;
		this.downBtn.angle += 180;

		this.leftBtn.events.onInputDown.add(this.mobileControl, this);
		this.upBtn.events.onInputDown.add(this.mobileControl, this);
		this.rightBtn.events.onInputDown.add(this.mobileControl, this);
		this.downBtn.events.onInputDown.add(this.mobileControl, this);

		this.startGame();
	},

	mobileControl: function (btn) {
		let x, y;

		switch (btn.angle) {
			case -180:
				// Down
				x = 0;
				y = 1;
				break;
			case 0:
				// Up
				x = 0;
				y = -1;
				break;
			case -90:
				// Left
				x = -1;
				y = 0;
				break;
			default:
				// Right (and other)
				x = 1;
				y = 0;
				break;

		}
		this.snake.xDir = x;
		this.snake.yDir = y;
	},

	// Resets the head cell of the snake.
	startGame: function () {
		this.snake.body = [];

		this.score = 0;
		this.frames =  4;

		let tmp_sprite = game.add.sprite(0, 0, 'head')
		this.snake.body = [{sprite: tmp_sprite}]
		tmp_sprite.height = this.rez;
		tmp_sprite.width = this.rez;

		this.snake.xDir = 1;
		this.snake.yDir = 0;

		this.placeFood();
	},

	// Places food in a random location.
	placeFood: function () {
		let cols = Math.floor(game.width / this.rez);
		let rows = Math.floor(game.height / this.rez);

    	this.food.sprite.x = (Math.floor(Math.random() * cols)) * this.rez;
		this.food.sprite.y = (Math.floor(Math.random() * rows)) * this.rez;
	},

	// Checks if the snake's head is in collision with any cell of the snake or the world border.
	isDead: function () {
		let killZones = [];

		const snake_head = this.snake.body[0].sprite;

		if (snake_head.y < 0 || snake_head.y > 400 || snake_head.x < 0 || snake_head.x > 400) {
			this.die();
			return
		}

		for (let i = 1; i < this.snake.body.length - 2; i++) {
			killZones.push(this.snake.body[i].sprite)
		}

		for (let i = 0; i < killZones.length; i++) {
			if (snake_head.x === killZones[i].x && snake_head.y === killZones[i].y) {
				this.die();
			}
		}
	},

	// Deletes all cells of the snake
	die: function () {
		this.dieSound.play();
		game.state.start('GameOver');
	},


	// Controls movement and detects collision with kill zones and food.
	update: function () {
		if (this.isDead()) {
			this.die();
		}

		if (this.cursors.down.isDown) {
			this.snake.xDir = 0;
			this.snake.yDir = 1;
		} else if (this.cursors.up.isDown) {
			this.snake.xDir = 0;
			this.snake.yDir = -1;
		} else if (this.cursors.right.isDown) {
			this.snake.xDir = 1;
			this.snake.yDir = 0;
		} else if (this.cursors.left.isDown) {
			this.snake.xDir = -1;
			this.snake.yDir = 0;
		}


		this.counter += 0.1;

		if (this.counter > this.frames - 1 && this.counter < this.frames + 1) {
			this.counter = 0;
			if (this.snake.body[0].sprite.x === this.food.sprite.x && this.snake.body[0].sprite.y === this.food.sprite.y) {
				this.eat();
				this.placeFood();
			}
			this.updateSnake();
		}
	},
};
