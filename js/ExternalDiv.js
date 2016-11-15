var ExternalDiv = function()
{
	var anchor = document.createElement("DIV");
	anchor.setAttribute("class", "canvas-anchor");

	var styles = {};

	var _updateStyles = function()
	{
		var styleAttribute = [];

		for(var name in styles)
		{
			styleAttribute.push(name + ": " + styles[name]);
		}

		anchor.setAttribute("style", styleAttribute.join("; "));
	};

	this.setArea = function(top, left, width, height)
	{
		this.setStyle("top", top + "px");
		this.setStyle("left", left + "px");
		this.setStyle("width", width + "px");
		this.setStyle("height", height + "px");
	};

	this.setStyle = function(name, value)
	{
		styles[name] = value;

		_updateStyles();

		return this;
	};

	this.unsetStyle = function(name)
	{
		if(styles[name] !== undefined)
		{
			delete styles[name];

			_updateStyles();
		}

		return this;
	};

	this.getStyle = function(name)
	{
		return styles[name];
	};

	this.hide = function()
	{
		return this.setStyle("display", "none");
	};

	this.show = function()
	{
		return this.setStyle("display", "block");
	};

	this.setStyle("position", "absolute");

	document.body.appendChild(anchor);

};