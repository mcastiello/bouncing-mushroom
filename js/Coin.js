var Coin = function(texture, value)
{
	var sprite = new PIXI.Sprite(texture);

	var _isHit = false;

	var _onHit;

	this.getSprite = function()
	{
		return sprite;
	};

	this.getValue = function()
	{
		return value;
	};

	this.setPosition = function(xPos, yPos)
	{
		sprite.position.x = xPos;
		sprite.position.y = yPos;

		return this;
	};

	this.resetPosition = function(yPos)
	{
		sprite.position.y = yPos;

		return this;
	};

	this.getHitArea = function()
	{
		return new PIXI.Rectangle(
			sprite.x + 2,
			sprite.y + 2,
			sprite.width - 4,
			sprite.height - 4
		);
	};

	this.hit = function()
	{
		if(!_isHit)
		{
			_isHit = true;
			sprite.visible = false;
			if(_onHit !== undefined)
			{
				_onHit(this);
			}
		}

		return this;
	};

	this.isHit = function()
	{
		return _isHit;
	};

	this.onHit = function(callback)
	{
		_onHit = callback;

		return this;
	};
};