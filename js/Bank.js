var Bank = function(coins)
{
	var sprites = [];
	var amount = 0;

	var balance;
	var balanceText;

	var style = new PIXI.TextStyle({
		fontFamily: "Lobster",
		fontSize: 24,
		fill: '#FFFFFF',
		fontWeight: 'bold',
		stroke: 'black',
		strokeThickness: 2
	});

	var _loadTexture;

	for(var i in coins)
	{
		var name = coins[i].name;
		var probability = coins[i].probability;

		for(var k = 0; k < probability; k++)
		{
			sprites.push({
				source: name,
				value: coins[i].value
			});
		}
	}

	this.getCoin = function()
	{

		var rand = Math.floor((Math.random() * 1000) % sprites.length);

        if(sprites[rand].source === undefined)
        {
            return null;
        }

		var texture = _loadTexture(sprites[rand].source);
		var value = sprites[rand].value;

		return new Coin(texture, value);
	};

	this.loadBalance = function()
	{
		balance = new PIXI.Container();

		var coinTexture = _loadTexture(sprites[0].source);

		var coinIcon = new PIXI.Sprite(coinTexture);
		coinIcon.width = 30;
		coinIcon.height = 30;
		balance.addChild(coinIcon);

		var x = new PIXI.Text("x", style);
		x.position.x = 33;
		x.position.y = -3;
		balanceText = new PIXI.Text("0", style);
		balanceText.position.x = 52;
		balanceText.position.y = -2;
		balance.addChild(x);
		balance.addChild(balanceText);
		balance.position.x = 10;
		balance.position.y = 10;

		return balance;
	};

	this.addAmount = function(value)
	{
		amount += value;
		balanceText.setText(amount);

		return this;
	};

	this.getAmount = function()
	{
		return amount;
	};

	this.reset = function()
	{
		amount = 0;
		balanceText.setText("0");

		return this;
	};

	this.onLoadTexture = function(callback)
	{
		_loadTexture = callback;

		return this;
	};
};