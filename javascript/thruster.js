class thruster
{
	//returerar thruster effekt för denna thruster
	getEffectInstance()
	{
		var news = new ExplosionEffect();
		news.thrusterConstructor(parentShip.getScreenPosition(positionInLocalSpace), Vector2.combineTwoVectors(parentShip.velocity, parentShip.getScreenDirection(new Vector2(directionOfExhaust.X * parentShip.velocity.getLength(), directionOfExhaust.Y * parentShip.velocity.getLength()))), this);
		return news;
	}

	//initerar en ny thruster
	constructor(parentShip, directionOfExhaust, positionInLocalSpace, startColor, endColor)
	{
		this.startSize = 0;
		this.endSize = 250;
		this.timeBetweenStartAndEndSize = 4;

		this.startColor = startColor;
		this.endColor = endColor;

		this.startAlpha = 255;
		this.endAlpha = 0;
		this.timeBetweenStartAndEndSize = 3;
	}
}
