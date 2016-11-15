var Interaction = function()
{
	var bindings = [];
	var _render;

	var _buildBinding = function(object, mousedown, mouseup)
	{
		var _createFakeEvent = function(x, y, object)
		{
			return {
				'clientX': x || 0,
				'clientY': y || 0,
				'target': object
			};
		};
		var binding = {
			'object': object,
			'events': {
				'up': function(x, y)
				{
					if(mouseup !== undefined)
					{
						mouseup(_createFakeEvent(x, y, object));
					}
				},
				'down': function(x, y)
				{
					if(mousedown !== undefined)
					{
						mousedown(_createFakeEvent(x, y, object));
					}
				},
				'click': function(x, y)
				{
					if(mousedown !== undefined)
					{
						mousedown(_createFakeEvent(x, y, object));
					}
					if(mouseup !== undefined)
					{
						mouseup(_createFakeEvent(x, y, object));
					}
				}
			}
		};

		bindings.push(binding);
	};

	this.setInteraction = function(object, mousedown, mouseup)
	{
		object.interactive = true;
		var _handleEvent = function(evt)
		{
			//evt.stopPropagation();
			return evt.data.originalEvent;
		};
		var _downHandler = function(evt)
		{
			if(mousedown !== undefined)
			{
				mousedown(_handleEvent(evt));
			}
		};
		var _upHandler = function(evt)
		{
			if(mouseup !== undefined)
			{
				mouseup(_handleEvent(evt));
			}
		};
		object.on("mousedown", _downHandler, false);
		object.on("touchstart", _downHandler, false);
		object.on("mouseup", _upHandler, false);
		object.on("touchend", _upHandler, false);

		_buildBinding(object, mousedown, mouseup);

		return this;
	};

	this.onRender = function(callback)
	{
		_render = callback;

		return this;
	};

	this.removeInteraction = function(object)
	{
		object.interactive = false;
		object.removeEvents();

		return this;
	};

	this.getInteraction = function(object)
	{
		for(var i in bindings)
		{
			if(bindings[i].object === object)
			{
				return bindings[i].events;
			}
		}

		return null;
	};

};