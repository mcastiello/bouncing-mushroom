var Board = function(textures, height, width)
{
	var _line1 = "";
	var _line2 = "";

	var container;
	var background;
	var boardContainer;
	var line1Text;
	var line2Text;
	var button;

	var _click;
	var _render;
	var style = new ExternalDiv();

	var line1Style = new PIXI.TextStyle({
		fontFamily: "Lobster",
		fontSize: 28,
		fill: '#FFFFFF',
		fontWeight: 'bold',
		stroke: 'black',
		strokeThickness: 2,
		align: 'center'
	});
	var line2Style = new PIXI.TextStyle({
		fontFamily: "Lobster",
		fontSize: 20,
		fill: '#FFFFFF',
		fontWeight: 'bold',
		stroke: 'black',
		strokeThickness: 2,
		align: 'center'
	});
	var buttonStyle = new PIXI.TextStyle({
		fontFamily: "Lobster",
		fontSize: 34,
		fill: '#00AFDD',
		fontWeight: 'bold',
		stroke: 'black',
		strokeThickness: 2,
		align: 'center'
	});

	var _boardWidth;
	var _boardHeight;
	var _boardTop;
	var _boardLeft;
	var _boardScale = 50;
	var _boardScaleFactor = 1;

	this.setMessage = function(line1, line2)
	{
		line1Text.setText(line1);
		line2Text.setText(line2);

		return this;
	};

	var _setBoardScale = function(percent)
	{

		boardContainer.width = Math.round(_boardWidth * percent / 100);
		boardContainer.height = Math.round(_boardHeight * percent / 100);

		boardContainer.position.x = _boardLeft + (_boardWidth - boardContainer.width) / 2;
		boardContainer.position.y = _boardTop + (_boardHeight - boardContainer.height) / 2;

		if(boardContainer.alpha < 1)
		{
			boardContainer.alpha = (percent < 100) ? percent / 100 : 1;
		}

		_render();
	};

	var _growStep = function()
	{
		if(_boardScale < 80)
		{
			_boardScale += Math.round(_boardScaleFactor);
			_boardScaleFactor += _boardScaleFactor / 2;

			_setBoardScale(_boardScale);

			requestAnimationFrame(_growStep);
		}
		else if(_boardScale < 110)
		{
			_boardScale += Math.round(_boardScaleFactor);
			_boardScaleFactor--;

			_setBoardScale(_boardScale);

			requestAnimationFrame(_growStep);
		}
		else
		{
			requestAnimationFrame(_reduceStep);
		}
	};

	var _reduceStep = function()
	{
		if(_boardScale > 100)
		{
			_boardScale--;

			_setBoardScale(_boardScale);

			requestAnimationFrame(_reduceStep);
		}
		else
		{
			_boardScaleFactor = 1;
			_boardScale = 50;
			style.show();
		}
	};

	this.show = function()
	{
		_boardTop = boardContainer.position.y;
		_boardLeft = boardContainer.position.x;
		_boardWidth = boardContainer.width;
		_boardHeight = boardContainer.height;

		_setBoardScale(_boardScale);

		container.visible = true;
		boardContainer.visible = true;

		requestAnimationFrame(_growStep);

		return this;
	};

	this.hide = function()
	{
		container.visible = false;
		boardContainer.visible = false;
		style.hide();

		return this;
	};

	this.getSprite = function()
	{
		return container;
	};

	this.getButton = function()
	{
		return button;
	};

	this.onClick = function(callback)
	{
		_click = callback;

		return this;
	};

	this.onRender = function(callback)
	{
		_render = callback;

		return this;
	};

	this.press = function()
	{
		button.style.fill = "red";

		return this;
	};

	this.release = function()
	{
		button.style.fill = "#00AFDD";
		if(_click !== undefined)
		{
			_click();
		}

		return this;
	};

	this.resetPosition = function(height, width)
	{
		container.position.x = 0;
		container.position.y = 0;

		background.width = width;
		background.height = height;

		boardContainer.position.x = width / 2 - boardContainer.width / 2;
		boardContainer.position.y = height / 2 - boardContainer.height / 2;

		style.setArea(
			boardContainer.position.y + button.position.y,
			boardContainer.position.x + button.position.x,
			button.width,
			button.height
		);

		return this;
	};

	container = new PIXI.Container();
	container.width = width;
	container.height = height;

	background = new PIXI.Graphics();
	background.beginFill(0x000000, 0.4);
	background.drawRect(0, 0, width, height);

	container.addChild(background);

	boardContainer = new PIXI.Container();
	var board = new PIXI.Sprite(textures.board);
	var logo = new PIXI.Sprite(textures.logo);

	boardContainer.width = board.width;
	boardContainer.height = board.height;

	boardContainer.addChild(board);
	boardContainer.addChild(logo);

	logo.position.x = -70;
	logo.position.y = -30;

	line1Text = new PIXI.Text("", line1Style);
	line2Text = new PIXI.Text("", line2Style);
	button = new PIXI.Text("Start", buttonStyle);
	style.setStyle("cursor", "pointer");

	line1Text.position.x = logo.width + logo.position.x + 30;
	line1Text.position.y = 55;
	line2Text.position.x = logo.width + logo.position.x - 30;
	line2Text.position.y = line1Text.position.y + line1Text.height;
	button.position.x = board.width - button.width - 30;
	button.position.y = board.height - button.height - 15;

	boardContainer.addChild(line1Text);
	boardContainer.addChild(line2Text);
	boardContainer.addChild(button);

	container.addChild(boardContainer);
};