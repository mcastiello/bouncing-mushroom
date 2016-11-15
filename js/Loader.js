var Loader = function(url, callback)
{
	var loaded = false;

	var textures;

	var onLoad = function()
	{
		loaded = true;

		textures = PIXI.loader.resources[url].textures;

        if(callback !== undefined)
        {
            callback();
        }
	};

	this.getTexture = function(name)
	{
		if(loaded && textures[name] !== undefined)
		{
			return textures[name];
		}
		return null;
	};

	this.getTextureWidth = function(name)
	{
		if(loaded && textures[name] !== undefined)
		{
			return textures[name].frame.width;
		}
		return 0;
	};

	this.getTextureHeight = function(name)
	{
		if(loaded && textures[name] !== undefined)
		{
			return textures[name].frame.height;
		}
		return 0;
	};

	PIXI.loader
		.add(url)
		.load(onLoad);

};
