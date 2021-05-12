class Vector2
{
	//returerar en normaliserad vektor där x eller y är 1/-1 och den andra siffran mindre/högre än 1/-1
	getNormalizedVector()
	{
		var x = MathExtension.getPositiveNumber(this.X);
		var y = MathExtension.getPositiveNumber(this.Y);
		var xProcentage = this.X / (x + y);
		var yProcentage = this.Y / (x + y);


		if (x == 0 && y == 0)
		{
			return zeroVector();
		}

		return new Vector2(xProcentage, yProcentage);
	}
	
	//returerar längden av hypotenusan
	getLength()
	{
		return Math.sqrt(this.X * this.X + this.Y * this.Y);
	}
	
	//statiskt funktion som returnern en vektor med positionen 0,0
	static zeroVector()
	{
		return new Vector2(0, 0);
	}
	
	//statiskt funktion som returnerar skillnaden mellan två vektorer
	static getDifference(triangle1, triangle2)
	{
		return new Vector2(triangle1.X - triangle2.X, triangle1.Y - triangle2.Y);
	}
	
	//statiskt funktion som returnernar kombinationen av två vektorer
	static combineTwoVectors(triangle1, triangle2)
	{
		return new Vector2(triangle1.X + triangle2.X, triangle1.Y + triangle2.Y);
	}
	
	//initierar en ny vektor
	constructor (X, Y)
	{
		this.X = X;
		this.Y = Y;
	}
}