class Asteroid
{
	/*
	public bool noVelocity;
	public double weight;
	public Vector2 position;
	public Vector2 velocity;
	public double size;
	*/
	update(ticksPerSecond)
	{
		this.rotationalAndPositionalupdate(ticksPerSecond);
	}
	
	rotationalAndPositionalupdate(ticksPerSecond)
	{
		if (this.noVelocity == false)
		{
			this.position.X += this.velocity.X / ticksPerSecond;
			this.position.Y += this.velocity.Y / ticksPerSecond;
		}
	}
	
	//Standard cirkel kollisionscheck
	isPositionWithinThisCollider(worldPos)
	{
		var diff = Vector2.getDifference(this.position, worldPos);
		if (diff.getLength() < size)
		{
			return true;
		}
		return false;
	}
	
	//Standard cirkel kollisionscheck
	isPositionWithinThisColliderCircleCheck(worldPos, sizeOfObject)
	{
		var diff = Vector2.getDifference(this.position, worldPos);
		if (diff.getLength() < this.size + sizeOfObject)
		{
			return true;
		}
		return false;
	}
	
	//returnern grafiken för denna asteroid
	getRenderableMeshes(cameraPosition, zoomScalar)
	{
		var renderObjectlist;

		var renderObject = new GraphicsPath();

		var playerPosition = Camera.getLocalPosition(new Vector2(this.position.X, this.position.Y));

		playerPosition = new Vector2(playerPosition.X * zoomScalar, playerPosition.Y * zoomScalar);

		var constantIncrease = Math.PI / 3;

		//ritar en cirkel
		for (var i = constantIncrease; i < Math.PI * 2; i += constantIncrease)
		{
			renderObject.addLine(
				 Math.floor(((playerPosition.X + cameraPosition.X) + Math.cos(i - constantIncrease) * this.size * zoomScalar))
				  , Math.floor(((playerPosition.Y + cameraPosition.Y) + Math.sin(i - constantIncrease) * this.size * zoomScalar))
				,Math.floor(((playerPosition.X + cameraPosition.X) + Math.cos(i) * this.size * zoomScalar)), Math.floor(((playerPosition.Y + cameraPosition.Y) + Math.sin(i) * this.size * zoomScalar)));
		}
		//var matrix = new Matrix();
		//matrix.translate(playerPosition.X + cameraPosition.X, playerPosition.Y + cameraPosition.Y);
				   // matrix.rotate(Camera.rotation);

		//renderObject.Transform(matrix);
		//renderObject.AddEllipse((float)playerPosition.X + (float)cameraPosition.X, (float)playerPosition.Y + (float)cameraPosition.Y, (float)size, (float)size);
		renderObject.closeFigure();
		renderObjectlist = new GraphicsObject(renderObject, this.color);

		return renderObjectlist;
	}
	
	constructor(weight, position, velocity)
	{
		//size = Math.Pow(san.weight,(double)1/3)

		this.weight = weight;
		//this.size = Math.Pow(weight, (double)1 / 3);
		this.size = Math.sqrt(weight);

		this.position = position;
		this.velocity = velocity;
		this.noVelocity = false;
		this.color = white;
	}
}