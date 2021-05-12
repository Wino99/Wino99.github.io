class Transform
{
	//initierar en ny Transform
	constructor()
	{
		this.noVelocity = false;
		this.position = Vector2.zeroVector();
		this.velocity = Vector2.zeroVector();
		this.rotation = 0;
		this.rotationalVelocity = 0;
		this.forceVectorThisTick = Vector2.zeroVector();
		this.color = white;

	}
	
	update(ticksPerSecond)
	{

	}
	
	//updaterar rotationen med rotationvelocity och position med velocity
	rotationalAndPositionalupdate(ticksPerSecond)
	{
		this.rotation += this.rotationalVelocity / ticksPerSecond;

		//håller rotationen mellann 180 och -180 grader
		var amountToRemove = 0;
		if (this.rotation > (Math.PI * 1))
		{
			amountToRemove = Math.floor((this.rotation / (Math.PI * 1)));
		}
		if (this.rotation < (Math.PI * -1))
		{
			amountToRemove = Math.floor((this.rotation / (Math.PI * 1)));
		}
		this.rotation = this.rotation - (amountToRemove * Math.PI * 2);

		if (this.noVelocity)
			return;

		this.position.X += this.velocity.X / ticksPerSecond;
		this.position.Y += this.velocity.Y / ticksPerSecond;

	}
}