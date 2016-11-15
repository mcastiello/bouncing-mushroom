var Character = function(textures, backgrounds, top, left)
{
	var step = 0;

	this.bouncing = false;

	var _moving = false;

	var moveHeight = 1;
	var jumpHeight = 4;

	var yPos = top || 5;
	var xPos = left || 5;

	var sprite = new PIXI.Sprite(textures.rest);
	sprite.position.x = xPos;
	sprite.position.y = yPos;

	var _update;
	var _hitCheck;
	var _enqueuedAction;
	var _queueJump = false;

	var _changeDirection = function(dir)
	{
		for(var i in backgrounds)
		{
			backgrounds[i][dir]();
		}
		sprite.texture = textures[dir];
		_update();
		return this;
	};

	this.right = function()
	{
		return _changeDirection('right');
	};

	this.left = function()
	{
		return _changeDirection('left');
	};

	this.rest = function()
	{
		sprite.texture = textures.rest;
		_update();
		return this;
	};

	this.setPosition = function(top, left)
	{
		yPos = top || 5;
		xPos = left || 5;
		sprite.position.x = xPos;
		sprite.position.y = yPos;
	};

	this.resetPosition = function(stageHeight, stageWidth)
	{
		var _resetPosition = function()
		{
			this.setPosition(
				stageHeight - this.getHeight() - 5,
				stageWidth / 2 - this.getWidth() / 2
			);
		}.bind(this)

		if(this.bouncing)
		{
			this.enqueueAction(_resetPosition);
		}
		else
		{
			_resetPosition();
		}

		return this;
	};

	this.getWidth = function()
	{
		return textures.rest.frame.width;
	};

	this.getHeight = function()
	{
		return textures.rest.frame.height;
	};

	this.getSprite = function()
	{
		return sprite;
	};

	this.onUpdate = function(callback)
	{
		_update = function(action)
		{
			requestAnimationFrame(function()
			{
				if(action !== undefined)
				{
					action();
				}
				callback();
			});
		};
		_update();
		return this;
	};

	var _bouncingStep = function(height, bgMove, repeat)
	{
		var _bgMoving = bgMove;

		if(step >= 0 && step < 4)
		{
			sprite.height -= height;
			sprite.width++;
			sprite.y += height;
			sprite.x--;
		}
		else if(step >= 4 && step < 12)
		{
			sprite.height += height;
			sprite.width--;
			sprite.y -= 3 * height;
			sprite.x++;
		}
		else if(step >= 12 && step < 20)
		{
			sprite.height -= height;
			sprite.width++;
			sprite.y -= height;
			sprite.x--;
		}
		else if(step >= 20 && step < 28)
		{
			sprite.height += height;
			sprite.width--;
			sprite.y += 3 * height;
			sprite.x++;
		}
		else if(step >= 28 && step < 32)
		{
			sprite.height -= height;
			sprite.width++;
			sprite.y += height;
			sprite.x--;
		}
		else
		{
			this.bouncing = false;

			if(repeat)
			{
				if(_moving)
				{
					this.bounce(bgMove, repeat);
				}
				else
				{
					_bgMoving = false;
					this.rest();
				}
			}
			if(_enqueuedAction !== undefined)
			{
				_enqueuedAction();
				_enqueuedAction = undefined;
			}
			return;
		}

		step++;

		if(_bgMoving)
		{
			for(var i in backgrounds)
			{
				backgrounds[i].move();
			}
		}

		if(_hitCheck !== undefined)
		{
			_hitCheck(new PIXI.Rectangle(sprite.x, sprite.y, sprite.width, sprite.height));
		}

		_update(function()
		{
			_bouncingStep(height, bgMove, repeat);
		});
	}.bind(this);

	this.onHitCheck = function(callback)
	{
		_hitCheck = callback;

		return this;
	};

	this.move = function(moving)
	{
		_moving = moving;

		if(!moving)
		{
			_queueJump = false;
		}

		if(_moving && !this.bouncing)
		{
			this.bounce(true, true);
		}

		return this;
	};

	this.jump = function()
	{
		_queueJump = true;

		if(!this.bouncing)
		{
			this.bounce(false, false);
		}

		return this;
	};

	this.enqueueAction = function(callback)
	{
		_enqueuedAction = callback;

		return this;
	};

	this.bounce = function(bgMove, repeat)
	{
		this.bouncing = true;

		step = 0;

		height = moveHeight;
		if(_queueJump)
		{
			_queueJump = false;
			height = jumpHeight;
		}

		_bouncingStep(height, bgMove, repeat);

		return this;
	};
};
