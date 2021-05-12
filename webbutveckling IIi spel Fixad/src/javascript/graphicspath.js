class GraphicsPath
{
	//stänger figuren
	closeFigure()
	{
		this.positionList.push(new Vector2(this.positionList[0].X,this.positionList[0].Y));
	}
	
	//lägg till en kub till objektet
	addRectangle(topleftposition, size)
	{
		this.positionList.push(topleftposition);
		this.positionList.push(new Vector2(topleftposition.X + size.X, topleftposition.Y));
		this.positionList.push(new Vector2(topleftposition.X + size.X, topleftposition.Y + size.Y));
		this.positionList.push(new Vector2(topleftposition.X, topleftposition.Y + size.Y));
	}
	
	//initierar en nytt objekt
	constructor()
	{
		this.positionList = [];
	}
	
	//lägg till bara en position
	addPosition(position)
	{
		this.positionList.push(position);
	}
	
	//lägg till två positioner
	addLine(x1,y1,x2,y2)
	{
		var position1 = new Vector2(x1,y1);
		var position2 = new Vector2(x2,y2);

		this.positionList.push(position1);
		this.positionList.push(position2);
	}
}
