var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function()
{
	if(this.readyState == 4 && this.status == 200)
	{
		var config = JSON.parse(this.responseText);

		window.title = config.title;
		document.getElementById("favicon").href = config.icon;

		var font = new XMLHttpRequest();
		font.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				var stage = new StageHandler(
					document.body.clientWidth, document.body.clientHeight
				);

				stage.appendTo(document.body);

				var loader = new Loader(config.source, function()
				{
					var game = new Bouncing(loader, stage);

					game.loadBackgrounds(config.backgrounds)
						.loadPlayground(config.playground)
						.loadCharacter(config.character)
						.loadBank(config.coins)
						.loadTimer(config.duration, config.warning)
						.loadBoard(config.board)
						.initGame();
				});
			}
		}.bind(this);
		font.open("GET", config.font, true);
		font.send();
	}
};
xhttp.open("GET", configFile, true);
xhttp.send();