var Timer = function(duration, warningThreshold)
{
	duration = duration || 60;
	warningThreshold = warningThreshold || 30;

	var style = new PIXI.TextStyle({
		fontFamily: "Lobster",
		fontSize: 40,
		fill: '#FFFFFF',
		fontWeight: 'bold',
		stroke: 'black',
		strokeThickness: 2,
		align: 'center'
	});

	var _secondsToString = function(seconds)
	{
		var date = new Date(0);
		date.setSeconds(seconds);

		var min = date.getMinutes();
		var sec = date.getSeconds();

		return "" + min + ":" + (sec < 10 ? "0" : "") + sec;
	};

	var interval;
	var sprite = new PIXI.Text(_secondsToString(duration), style);
	var actualTime = duration;

	var _timeout;
	var _tick;
	var _update = function()
	{
		sprite.setText(_secondsToString(actualTime));
		if(actualTime <= warningThreshold)
		{
			sprite.style.fill = 'red';
		}
		_tick();

		if(actualTime > 0)
		{
			actualTime--;
		}
		else
		{
			this.stop()
		}
	}.bind(this);

	this.setDuration = function(sec)
	{
		duration = sec;

		return this;
	};

	this.setWarningThreshold = function(sec)
	{
		warningThreshold = sec;

		return this;
	};

	this.getWarningThreshold = function()
	{
		return warningThreshold;
	};

	this.getDuration = function()
	{
		return duration;
	};

	this.stop = function()
	{
		if(interval !== undefined)
		{
			clearInterval(interval);
			_timeout();
		}

		return this;
	};

	this.start = function()
	{
		this.reset();
		_update();
		interval = setInterval(_update, 1000);

		return this;
	};

	this.reset = function()
	{
		actualTime = duration;
		sprite.style.fill = '#FFFFFF';
		sprite.setText(_secondsToString(actualTime));

		return this;
	};

	this.getSprite = function()
	{
		return sprite;
	};

	this.onTimeout = function(callback)
	{
		_timeout = callback;

		return this;
	};

	this.setPosition = function(top, left)
	{
		sprite.position.x = left;
		sprite.position.y = top;

		return this;
	};

	this.resetPosition = function(stageHeight, stageWidth)
	{
		this.setPosition(
			10,
			stageWidth / 2 - this.getWidth() / 2
		);

		return this;
	};

	this.getWidth = function()
	{
		return sprite.texture.frame.width;
	};

	this.onTick = function(callback)
	{
		_tick = callback;

		return this;
	};
};