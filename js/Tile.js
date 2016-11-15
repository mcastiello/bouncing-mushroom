var Tile = function(texture, width, height, top)
{
	var sprite = new PIXI.extras.TilingSprite(texture, width, height);

	var speed = 0.1;

	var fill = top === null;
	var yPos = top || 0;
	yPos = yPos >= 0 ? yPos : 0;

	sprite.position.x = 0;
	sprite.position.y = yPos;
	sprite.tilePosition.x = 0;
	sprite.tilePosition.y = 0;

	var forward = true;
	var moved = 0;
	var moveCall = 70;
	var _movedCallback;

	var bindedElements = [];

	this.getSprite = function()
	{
		return sprite;
	};

	this.getSpeed = function()
	{
		return speed;
	};

	this.setSpeed = function(newSpeed)
	{
		speed = newSpeed;
		return this;
	};

	this.getWidth = function()
	{
		return texture.frame.width;
	};

	this.getHeight = function()
	{
		return texture.frame.height;
	};

	this.setWidth = function(val)
	{
		sprite.width = val;

		return this;
	};

	this.setHeight = function(val)
	{
		sprite.height = val;

		return this;
	};

	this.setPosition = function(val)
	{
		if(!fill)
		{
			sprite.position.y = val;
			yPos = val;
		}

		return this;
	};

	this.right = function()
	{
		forward = true;
		return this;
	};

	this.left = function()
	{
		forward = false;
		return this;
	};

	this.bind = function(element)
	{
		bindedElements.push(element);

		return this;
	};

	this.unbind = function(element)
	{
		for(var i = 0; i < bindedElements.length; i++)
		{
			if(bindedElements[i] === element)
			{
				bindedElements.splice(i, 1);
				break;
			}
		}

		return this;
	};

	this.onMoved = function(callback, move)
	{
		_movedCallback = callback;
		moveCall = move || moveCall;

		return this;
	};

	this.move = function()
	{
		var tileSpeed = forward ? speed : (speed * -1);
		sprite.tilePosition.x = sprite.tilePosition.x - tileSpeed;
		moved += tileSpeed;

		for(var i in bindedElements)
		{
			bindedElements[i].position.x -= tileSpeed;
		}

		if(moved > moveCall && _movedCallback !== undefined)
		{
			moved = 0;
			_movedCallback();
		}

		return this;
	};

	this.reset = function()
	{
		sprite.tilePosition.x = 0;
		sprite.tilePosition.y = 0;

		var forward = true;
		var moved = 0;

		return this;
	};
};
