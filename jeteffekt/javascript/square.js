class Square
{
	//returerar denna kubs position inom dess förälders nät (där rotation är 0)
	getLocalPositionFromParent(parentPostion)
	{
		var parentSpacePosition = parentPostion;

		//Ändra position noll axis till den här pivoten
		parentSpacePosition = new Vector2(parentSpacePosition.X - this.position.X, parentSpacePosition.Y - this.position.Y);
		//ändra position beroende på rotationen av pivoten
		parentSpacePosition = new Vector2(Math.cos(this.rotation) * parentSpacePosition.X + Math.sin(this.rotation) * parentSpacePosition.Y, -Math.sin(this.rotation) * parentSpacePosition.X + Math.cos(this.rotation * 1) * parentSpacePosition.Y);
		return parentSpacePosition;
	}
	
	//returerar en position inom denna kuben ifrån världsposition eller en position utan föräldrar transforms
	getLocalPositionFromWorld(screenPosition)
	{

		var parentSpacePosition = this.parent.getLocalPosition(screenPosition);

		//Ändra position noll axis till den här pivoten
		parentSpacePosition = new Vector2(parentSpacePosition.X - this.position.X, parentSpacePosition.Y - this.position.Y);
		//ändra position beroende på rotationen av pivoten
		parentSpacePosition = new Vector2(Math.cos(this.rotation) * parentSpacePosition.X + Math.sin(this.rotation) * parentSpacePosition.Y, -Math.sin(this.rotation) * parentSpacePosition.X + Math.cos(this.rotation * 1) * parentSpacePosition.Y);
		return parentSpacePosition;
	}
	
	//kollar om denna position från världsnätet kolliderar med denna kub
	isPositionCollidingFromWorld(screenPos)
	{
		var localPosition = this.getLocalPositionFromWorld(screenPos);

		if (localPosition.X > -this.size.X && localPosition.X < this.size.X)
		{
			if (localPosition.Y > 0 && localPosition.Y < this.size.Y)
				return true;
		}
		return false;
	}
	
	//returerar punkterna som gör upp denna kub
	getBoundingBoxPointsWorld()
	{
		var boundingBoxPointsList = [Vector2.zeroVector(),Vector2.zeroVector(),Vector2.zeroVector(),Vector2.zeroVector()];
		boundingBoxPointsList[0] = this.getScreenPosition(new Vector2(this.size.X, 0));
		boundingBoxPointsList[1] = this.getScreenPosition(new Vector2(-this.size.X, 0));
		boundingBoxPointsList[2] = this.getScreenPosition(new Vector2(this.size.X, this.size.Y));
		boundingBoxPointsList[3] = this.getScreenPosition(new Vector2(-this.size.X, this.size.Y));
		return boundingBoxPointsList;
	}
	
	//återvänder kubens position i världsnätet
	getScreenPosition(localPosition)
	{
		localPosition = new Vector2(Math.cos(this.rotation) * localPosition.X - Math.sin(this.rotation) * localPosition.Y + this.position.X, Math.sin(this.rotation) * localPosition.X + Math.cos(this.rotation) * localPosition.Y + this.position.Y);
		localPosition = this.parent.getScreenPosition(localPosition);
		return localPosition;
	}
	
	//initierar en kub
	constructor(position, size, rotation, parent)
	{
		this.rotation = rotation;
		this.position = position;
		this.size = size;
		this.parent = parent;
	}
}
