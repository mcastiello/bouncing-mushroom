var Bouncing = function(loader, stage)
{
	var character;
	var backgrounds = [];
	var playground;
	var playgroundElements = [];
	var bank;
	var timer;
	var input;
	var board;
	var coins = [];
	var controls = {
		left: undefined,
		right: undefined,
		up: undefined,
		space: undefined
	};

	var forward = false;
	var started = false;

	var _createTile = function(config)
	{
		var name = config.name;

		var tile = new Tile(
			loader.getTexture(name),
			stage.getWidth(),
			stage.getHeight(),
			config.fill ? null : stage.getHeight() - loader.getTextureHeight(name)
		);

		tile.setSpeed(config.speed);
		stage.addSprite(tile.getSprite());

		return tile;
	};

	this.loadBackgrounds = function(bgSprites)
	{
		for(var i in bgSprites)
		{
			var tile = _createTile(bgSprites[i]);
			backgrounds.push(tile);
		}

		return this;
	};

	this.getBackgrounds = function()
	{
		return backgrounds;
	};

	this.addPlaygroundElement = function(config)
	{
		var name = config.name;
		var texture = loader.getTexture(name);

		var element = new PIXI.Sprite(texture);

		stage.addSprite(element);
		playground.bind(element);

		playgroundElements.push({
			sprite: element,
			top: config.top,
			left: config.left
		});

		return this;
	};

	this.getPlaygroundElements = function()
	{
		return playgroundElements;
	};

	this.resetPlaygroundElements = function()
	{
		for(var i in playgroundElements)
		{
			var sprite = playgroundElements[i].sprite;
			var texture = sprite.texture;

			var top = playgroundElements[i].top;
			top = top < 0 ? stage.getHeight() - texture.frame.height + top : top;
			var left = playgroundElements[i].left;
			left = left < 0 ? stage.getWidth() - left : left;

			sprite.position.x = left;
			sprite.position.y = top;
		}

		return this;
	};

	this.loadPlayground = function(playSprite)
	{
		playground = _createTile(playSprite);
		backgrounds.push(playground);

		for(var i in playSprite.elements)
		{
			this.addPlaygroundElement(playSprite.elements[i]);
		}

		this.resetPlaygroundElements();

		return this;
	};

	this.getPlayground = function()
	{
		return playground;
	};

	this.loadCharacter = function(charSprites)
	{
		character = new Character(
			{
				left: loader.getTexture(charSprites.left),
				right: loader.getTexture(charSprites.right),
				rest: loader.getTexture(charSprites.rest)
			},
			backgrounds
		);
		character.resetPosition(stage.getHeight(), stage.getWidth());
		stage.addSprite(character.getSprite());

		character.onUpdate(function()
		{
			stage.render();
		});

		return this;
	};

	this.getCharacter = function()
	{
		return character;
	};

	this.loadBank = function(coinSprites)
	{
		bank = new Bank(coinSprites);

		bank.onLoadTexture(function(name)
		{
			return loader.getTexture(name);
		});

		stage.addSprite(bank.loadBalance());

		return this;
	};

	this.getBank = function()
	{
		return bank;
	};

	this.loadKeyboardControls = function()
	{
		controls.left = new Control(37);
		controls.up = new Control(38);
		controls.right = new Control(39);
		controls.space = new Control(32);

		controls.space.onRelease(function()
		{
			this.start();
		}.bind(this));

		controls.left.onPress(function()
		{
			character.left();
			character.move(true);
		}).onRelease(function()
		{
			character.move(false);
		});

		controls.up.onPress(function()
		{
			character.jump();
		}).onRelease(function()
		{
		});

		controls.right.onPress(function()
		{
			character.right();
			character.move(true);
		}).onRelease(function()
		{
			character.move(false);
		});

		controls.space.enabled = true;

		return this;
	};

	this.loadTouchControls = function()
	{

		input = new Interaction();

		var _touchRight = function()
		{
			if(stage.isMouseUp)
			{
				if(forward && character.bouncing)
				{
					controls.up.press();
				}
				else
				{
					controls.right.press();
					forward = true;
				}
			}
		};
		var _touchLeft = function()
		{
			if(stage.isMouseUp)
			{
				if(!forward && character.bouncing)
				{
					controls.up.press();
				}
				else
				{
					controls.left.press();
					forward = false;
				}
			}
		};
		var _touchStart = function()
		{
			this.start();
			controls.right.press();
			forward = true;
			started = true;
		}.bind(this);

		// Defining default mouse or touch interaction with the stage
		input.setInteraction(stage.getStage(),
			// Mouse Down Handler
			function(event)
			{
				var centerX = stage.getContainer().clientWidth / 2;

				if(event.clientX > centerX)
				{
					_touchRight();
				}
				else
				{
					_touchLeft();
				}

				stage.isMouseUp = false;
				stage.isMouseDown = true;
			}.bind(this),
			// Mouse Up Handler
			function(event)
			{
                if(stage.isMouseDown)
                {
                    controls.up.release();
                }

				stage.isMouseUp = true;
				stage.isMouseDown = false;
			}.bind(this)
		);

		input.setInteraction(board.getButton(), function()
		{
			board.press();
			stage.render();
		}, function()
		{
			board.release();
			stage.render();
		});

		return this;
	};

	this.loadControls = function()
	{
		this.loadKeyboardControls();
		this.loadTouchControls();
	};

	this.getKeyboardControls = function()
	{
		return controls;
	};

	this.getTouchControls = function()
	{
		return input;
	};

	this.enableControls = function()
	{
		controls.left.enabled = true;
		controls.right.enabled = true;
		controls.up.enabled = true;
		controls.space.enabled = false;
	};

	this.disableControls = function()
	{
		controls.left.enabled = false;
		controls.right.enabled = false;
		controls.up.enabled = false;
		controls.space.enabled = true;
	};

	this.loadBoard = function(config)
	{
		board = new Board({
			"logo": loader.getTexture(config.logo),
			"board": loader.getTexture(config.board),
			"title": loader.getTexture(config.title)
		}, stage.getHeight(), stage.getWidth());
		board.onRender(function()
		{
			stage.render();
		});

		stage.addSprite(board.getSprite());
		board.resetPosition(stage.getHeight(), stage.getWidth());

		return this;
	};

	this.getBoard = function()
	{
		return board;
	};

	this.loadTimer = function(sec, warning)
	{
		timer = new Timer(sec, warning);

		timer.onTick(function()
		{
			stage.render();
		});

		timer.onTimeout(function()
		{
			var amount = bank.getAmount();
			this.resetGame(function()
			{
				this.showBoard("Your score is: " + amount,
					"Catch more coins! Press 'Start' to play again!");
			}.bind(this));
		}.bind(this));

		stage.addSprite(timer.getSprite());
		timer.resetPosition(stage.getHeight(), stage.getWidth());

		return this;
	};

	this.getTimer = function()
	{
		return timer;
	};

	this.resetGame = function(callback)
	{

		var _reset = function()
		{
			character.rest();

			// Resetting bank
			bank.reset();

			// Cleaning all the coins
			for(var i in coins)
			{
				playground.unbind(coins[i].getSprite());
				stage.removeSprite(coins[i].getSprite());
				coins[i].getSprite().destroy();
			}
			coins = [];

			// Resetting backgrounds
			for(var k in backgrounds)
			{
				backgrounds[k].reset();
			}

			this.resetPlaygroundElements();

			timer.reset();

			board.resetPosition(stage.getHeight(), stage.getWidth());

			if(callback !== undefined)
			{
				callback();
			}

			stage.render();

		}.bind(this);

		this.disableControls();

		character.move(false);

		if(character.bouncing)
		{
			character.enqueueAction(_reset);
		}
		else
		{
			_reset();
		}

		forward = false;
		started = false;

		stage.isMouseDown = false;
		stage.isMouseUp = true;

		stage.render();

		return this;
	};

	this.initGame = function()
	{
		this.loadControls();

		playground.onMoved(function()
		{
			var coin = bank.getCoin();
			if(coin !== null)
			{
				coin.setPosition(stage.getWidth() + 10, stage.getHeight() - 150);
				coin.onHit(function(coin)
				{
					bank.addAmount(coin.getValue());
				});
				coins.push(coin);

				stage.addSprite(coin.getSprite());
				playground.bind(coin.getSprite());
			}
		});

		character.onHitCheck(function(area)
		{
			for(var i = 0; i < coins.length; i++)
			{
				if(!coins[i].isHit())
				{
					var coin = coins[i].getHitArea();
					if(
						area.contains(coin.x, coin.y) ||
						area.contains(coin.x + coin.width, coin.y) ||
						area.contains(coin.x, coin.y + coin.height) ||
						area.contains(coin.x + coin.width, coin.y + coin.height)
					)
					{
						coins[i].hit();
						stage.removeSprite(coins[i].getSprite());
						playground.unbind(coins[i].getSprite());
						coins[i].getSprite().destroy();
						coins.splice(i, 1);

						i--;
					}
				}
			}
		});

		board.onClick(function()
		{
			this.start();
			controls.right.press();
			forward = true;
			started = true;
		}.bind(this));

		window.addEventListener('resize', function(evt)
		{
			stage.resize(document.body.clientWidth, document.body.clientHeight);
			for(var i in backgrounds)
			{
				backgrounds[i].setWidth(document.body.clientWidth)
					.setHeight(document.body.clientHeight)
					.setPosition(stage.getHeight() - backgrounds[i].getHeight());
			}
			for(var k in coins)
			{
				coins[k].resetPosition(stage.getHeight() - 150);
			}
			character.resetPosition(stage.getHeight(), stage.getWidth());
			timer.resetPosition(stage.getHeight(), stage.getWidth());
			board.resetPosition(stage.getHeight(), stage.getWidth());
			this.resetPlaygroundElements();
			stage.render();
		}.bind(this));

		this.showBoard("Press 'Start' to play",
			"Collect all the coins but avoid the black ones!");

		return this;
	};

	this.showBoard = function(line1, line2)
	{
		board.setMessage(line1, line2);
		board.show();

		return this;
	};

	this.hideBoard = function()
	{
		board.hide();

		return this;
	};

	this.start = function()
	{
		this.enableControls();
		this.hideBoard();

		timer.start();

		return this;
	};
};
