class ExplosionEffect extends Transform
{
	normalConstructor(position, sizeMultiplier, velocity)
	{
		this.velocity = velocity;
		this.time = 0;
		this.position = position;
		this.sizeMultiplier = sizeMultiplier;
	}
	
	longConstructor(position, sizeMultiplier, velocity, timeToTransparent, totalTimeBeforePurge)
	{
		this.velocity = velocity;
		this.time = 0;
		this.position = position;
		this.sizeMultiplier = sizeMultiplier;
		this.timeToTransparent = timeToTransparent;
		this.totalTimeBeforePurge = totalTimeBeforePurge;
	}
	
	thrusterConstructor(position, velocity, thruster)
	{
		this.velocity = velocity;
		this.time = 0;
		this.position = position;
	}
	
	constructor()
	{
		super();

		this.timeToTransparent = 2.5;
		this.totalTimeBeforePurge = 5;
	}
	
	//används för att uppnå en form av animation av explosioneffekterna så att den kan saktas mörknas
	nextframe(cameraPosition, zoomScalar, actualTicksPerSecond)
	{
		//velocity = new Vector2(velocity.X*0.95,velocity.Y*0.95);
		this.rotationalAndPositionalupdate(10);
		//animerar storleken på explosionen
		var thisFrame = this.getRenderableMeshes(cameraPosition, zoomScalar, Math.sqrt(this.time / 5) * this.sizeMultiplier, darkGreen);

		this.time += 1 / actualTicksPerSecond;
		
		//hanterar färg animeringen
		if (this.blueColor)
		{
			//blir synlig
			if (this.time < 2.5)
			{
				thisFrame.color = new SolidBrush
					(
					  255,
					  0,
					  100 + Math.floor(Math.sqrt(this.time)) * 40,
					  255 - Math.floor(Math.sqrt(this.time)) * 40
					)
				;
			}
			else //börjar bli icke synlig
			{
				thisFrame.color = new SolidBrush(
						Math.max((255 * (1 - ((this.time / 5)))), 0),
						0,
						((255 - Math.sqrt(2.5) * 10)),
						Math.max((255 * (1 - ((this.time / 5)))), 0)
				);
			}
		}
		else
		{
			if (this.time < 2.5)
			{
				thisFrame.color = new SolidBrush(
					255,
					255 - Math.sqrt(this.time) * 40,
					100 + Math.floor(Math.sqrt(this.time) * 40),
					0);
			}
			else
			{
				thisFrame.color = new SolidBrush(
						Math.min(Math.max((255 * (1 - (((this.time - this.timeToTransparent) / (this.totalTimeBeforePurge - this.timeToTransparent))))), 0), 255),
						((255 - Math.sqrt(2.5) * 10)),
						((100 + Math.sqrt(2.5) * 10)),
						0
				 );

			}
		}
		return thisFrame;
	}

	//returnern en cirkel grafik enligt denna explosionseffekts storlek och färg
	getRenderableMeshes(cameraPosition, zoomScalar, size, brush)
	{
		var renderObjectlist;

		var renderObject = new GraphicsPath();

		var playerPosition = Camera.getLocalPosition(new Vector2(this.position.X, this.position.Y));

		playerPosition = new Vector2(playerPosition.X * zoomScalar, playerPosition.Y * zoomScalar);

		var constantIncrease = Math.PI / 24; //circle radius

		for (var i = constantIncrease; i < Math.PI * 2; i += constantIncrease)
		{
			renderObject.addLine(
				  Math.floor(((playerPosition.X + cameraPosition.X) + Math.cos(i - constantIncrease) * size * zoomScalar))
				, Math.floor(((playerPosition.Y + cameraPosition.Y) + Math.sin(i - constantIncrease) * size * zoomScalar))
				, Math.floor(((playerPosition.X + cameraPosition.X) + Math.cos(i) * size * zoomScalar))
				, Math.floor(((playerPosition.Y + cameraPosition.Y) + Math.sin(i) * size * zoomScalar)));
		}
		renderObjectlist = new GraphicsObject(renderObject, brush);		
		return renderObjectlist;
	}
}
