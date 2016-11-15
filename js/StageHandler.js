var StageHandler = function(width, height, container)
{
	var w = width || 512;
	var h = height || 384;
	var c = container || document.body;

	var stage = new PIXI.Container();

	var renderer = PIXI.autoDetectRenderer(w, h);

	renderer.autoResize = true;

	this.isMouseDown = false;
	this.isMouseUp = true;

	this.appendTo = function(target)
	{
		target.appendChild(renderer.view);
	};

	this.getWidth = function()
	{
		return w;
	};

	this.getHeight = function()
	{
		return h;
	};

	this.getContainer = function()
	{
		return c;
	};

	this.getStage = function()
	{
		return stage;
	};

	this.getRenderer = function()
	{
		return renderer;
	};

	this.render = function()
	{
		renderer.render(stage);
	};

	this.resize = function(width, height)
	{
		w = width;
		h = height;

		renderer.resize(width, height);

		this.render();
	};

	this.addSprite = function(sprite)
	{
		stage.addChild(sprite);

		this.render();
	};

	this.removeSprite = function(sprite)
	{
		stage.removeChild(sprite);

		this.render();
	};
};