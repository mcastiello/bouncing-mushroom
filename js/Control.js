var Control = function(keyCode)
{
	this.isDown = false;
	this.isUp = true;
	this.enabled = false;

	var _press = undefined;
	var _release = undefined;

	var _downHandler = function(event)
	{
		if(event.keyCode === keyCode)
		{
            if(this.isUp && _press && this.enabled)
            {
                _press();
            }
			this.isDown = true;
			this.isUp = false;
			event.preventDefault();
		}
	}.bind(this);

	var _upHandler = function(event)
	{
		if(event.keyCode === keyCode)
		{
            if(this.isDown && _release && this.enabled)
            {
                _release();
            }
			this.isDown = false;
			this.isUp = true;
			event.preventDefault();
		}
	}.bind(this);

	window.addEventListener(
		"keydown", _downHandler, false
	);

	window.addEventListener(
		"keyup", _upHandler, false
	);

	this.onPress = function(callback)
	{
		_press = callback;

		return this;
	};

	this.onRelease = function(callback)
	{
		_release = callback;

		return this;
	};

	this.press = function()
	{
		if(_press !== undefined && this.enabled)
		{
			_press();
		}
		return this;
	};

	this.release = function()
	{
		if(_release !== undefined && this.enabled)
		{
			_release();
		}
		return this;
	};
};