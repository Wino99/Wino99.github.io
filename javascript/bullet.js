class Bullet extends CollisionModel
{
	update(ticksPerSecond)
	{
		this.timeAlive = this.timeAlive + 1 / 100;
		if (this.timeAlive > 3)
		{
			GameManager.explode(this, this.velocity);
		}
		this.updateRotThrust(ticksPerSecond);
		this.rotationalAndPositionalupdate(ticksPerSecond);
	}
	
	updateRotThrust(ticksPerSecond)
	{
		var velocityAngle = Math.atan2(this.velocity.Y, this.velocity.X);
		var rotationalDelta = (this.rotation - velocityAngle);

		//om rotation är högre än math.pi, återvänd rotationen igen
		var amountToRemove = 0;
		// Debug.WriteLine("rotationalDelta " + rotationalDelta);
		// Debug.WriteLine("positionalDeltaa.x " + positionalDelta.X);
		// Debug.WriteLine("positionalDeltaa.y " + positionalDelta.Y);
		if (rotationalDelta > (Math.PI * 1))
		{
			amountToRemove = Math.floor(this.rotation % (Math.PI * 1));
		}
		if (rotationalDelta < (Math.PI * -1))
		{
			amountToRemove = Math.floor(this.rotation % (Math.PI * 1));
		}

		rotationalDelta = rotationalDelta - (amountToRemove * Math.PI * 2);

		this.rotationalVelocity = this.rotationalVelocity - rotationalDelta / 100 / ticksPerSecond;
	}
	
	//returnernar mängden skada
	getDamage(velocityOfImpactedObject)
	{
		//Vector2 diff = Vector2.getDifference(velocity, velocityOfImpactedObject);
		//return diff.getLength() * weight;
		return bulletDamage;
	}
	
	constructor(position, velocity, weight)
	{
		super();
		this.isBullet = true;
		this.timeAlive = 0;
		this.rotation = Math.atan2(velocity.Y, velocity.X);
		this.weight = weight;
		this.velocity = velocity;
		this.position = position;
		this.addCube(new Vector2(0, 0), new Vector2(weight * 1, -6 * weight), (weight * 1));
		this.addCube(new Vector2(0, 0), new Vector2(-weight * 1, -6 * weight), (weight * 1));
		this.color = red;
	}
}