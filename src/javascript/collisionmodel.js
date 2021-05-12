class CollisionModel extends Transform
{
	//lägg till en kub till kollisionsmodellen
	addCube(StartPos, endPos, xSize)
	{
		var localPositionRelative = new Vector2(StartPos.X - endPos.X, StartPos.Y - endPos.Y);

		var angle = Math.atan2(localPositionRelative.Y, localPositionRelative.X);
		var length = Math.sqrt(localPositionRelative.X * localPositionRelative.X + localPositionRelative.Y * localPositionRelative.Y);

		var toAdd = new Square(StartPos, new Vector2(xSize, length), angle, this);
		this.squareList.push(toAdd);
	}
	
	//Från en riktning inom det lokala nätet av den här kollisionsmodellen få skärm riktning
	getScreenDirection(localDirection)
	{
		localDirection = new Vector2(Math.cos(this.rotation) * localDirection.X - Math.sin(this.rotation) * localDirection.Y, Math.sin(this.rotation) * localDirection.X + Math.cos(this.rotation) * localDirection.Y);
		return localDirection;
	}
	
	//Från en position inom det lokala nätet av den här kollisionsmodellen få skärm position
	getScreenPosition(localPosition)
	{
		localPosition = new Vector2(Math.cos(this.rotation) * localPosition.X - Math.sin(this.rotation) * localPosition.Y + this.position.X, Math.sin(this.rotation) * localPosition.X + Math.cos(this.rotation) * localPosition.Y + this.position.Y);
		return localPosition;
	}
	
	//konverterar kubarna till en mängd punkter beroende på kollisonsmodellens rotation
	getRenderableMeshes(cameraPosition, zoomScalar)
	{
		var renderObjectlist = [];
		for(var i = 0; i < this.squareList.length; i++)				
		{
			var SBMC = this.squareList[i];

			var renderObject = new GraphicsPath();
			//definerar kubens punkter från dess position i skärmposition
			var bottomLeft = SBMC.getScreenPosition(new Vector2(-SBMC.size.X, 0));
			var bottomRight = SBMC.getScreenPosition(new Vector2(SBMC.size.X, 0));
			var topRight = SBMC.getScreenPosition(new Vector2(SBMC.size.X, SBMC.size.Y));
			var topLeft = SBMC.getScreenPosition(new Vector2(-SBMC.size.X, SBMC.size.Y));

			//konverterar deras positin till kamerans från skärmen
			bottomLeft = Camera.getLocalPosition(bottomLeft);
			bottomRight = Camera.getLocalPosition(bottomRight);
			topRight = Camera.getLocalPosition(topRight);
			topLeft = Camera.getLocalPosition(topLeft);
			
			//zoomar kuben beroende på kamerams zoom
			bottomLeft = new Vector2(bottomLeft.X * zoomScalar, bottomLeft.Y * zoomScalar);
			bottomRight = new Vector2(bottomRight.X * zoomScalar, bottomRight.Y * zoomScalar);
			topRight = new Vector2(topRight.X * zoomScalar, topRight.Y * zoomScalar);
			topLeft = new Vector2(topLeft.X * zoomScalar, topLeft.Y * zoomScalar);

			//ritar kuben
			renderObject.addLine(bottomLeft.X + cameraPosition.X, bottomLeft.Y + cameraPosition.Y, bottomRight.X + cameraPosition.X, bottomRight.Y + cameraPosition.Y);
			renderObject.addLine(bottomRight.X + cameraPosition.X, bottomRight.Y + cameraPosition.Y, topRight.X + cameraPosition.X, topRight.Y + cameraPosition.Y);
			renderObject.addLine(topRight.X + cameraPosition.X, topRight.Y + cameraPosition.Y, topLeft.X + cameraPosition.X, topLeft.Y + cameraPosition.Y);
			renderObject.addLine(topLeft.X + cameraPosition.X, topLeft.Y + cameraPosition.Y, bottomLeft.X + cameraPosition.X, bottomLeft.Y + cameraPosition.Y);
			renderObject.closeFigure();
			// renderObjectlist.Add(new GraphicsObject(renderObject, Brushes.White));
			renderObjectlist.push(new GraphicsObject(renderObject, darkGray));
		}
		return renderObjectlist;
	}
	
	//från skärmrposition få position inom denna transformen
	getLocalPosition(screenPosition)
	{
		var parentSpacePosition = screenPosition;

		//Ändra position noll axis till den här pivoten
		parentSpacePosition = new Vector2(parentSpacePosition.X - this.position.X, parentSpacePosition.Y - this.position.Y);
		//ändra position beroende på rotationen av pivoten
		parentSpacePosition = new Vector2(Math.cos(this.rotation) * parentSpacePosition.X + Math.sin(this.rotation) * parentSpacePosition.Y, -Math.sin(this.rotation) * parentSpacePosition.X + Math.cos(this.rotation * 1) * parentSpacePosition.Y);
		return parentSpacePosition;
	}
	
	//Kolla om denna modell kolliderar med en vektor(punkt)
	pointToShipCollisionCheck(screenPos)
	{
		for(var i = 0; i < this.squareList.length; i++)
		{
			var sq = squareList[i];
			if (sq.isPositionCollidingFromWorld(screenPos))
				return true;
		}
		return false;
	}

	//Kolla om denna modell kolliderar med en cirkel(asteroid)
	asteroidToShipCollisionCheck(position, size)
	{
		var boundingBoxPointCollection = this.getBoundingBoxPoints();
		for(var i = 0; i < boundingBoxPointCollection.length; i++)
		{
			var currentPoint = boundingBoxPointCollection[i];
			if (Vector2.getDifference(currentPoint, position).getLength() < size / 2)
			{
				return true;
			}
		}
		return false;
	}

	//Kolla om denna modell kolliderar med en modell(skepp)
	shipToShipCollision(collisionModelToChecks)
	{
		var listOfBoundingBoxPoints = collisionModelToChecks.getBoundingBoxPoints();
		for(var i = 0; i < listOfBoundingBoxPoints.length; i++)
		{
			var point = listOfBoundingBoxPoints[i];
			for(var j = 0; j < this.squareList.length; j++)
			{
				var currentSquare = this.squareList[j];
				if (currentSquare.isPositionCollidingFromWorld(point))
					return true;
			}
		}
		return false;
	}

	//returnerna alla punkter som definera detta skepp (Kuber > vektorer)
	getBoundingBoxPoints()
	{
		var listOfBoundingBoxPoints = [];
		for(var i = 0; i < this.squareList.length; i++)
		{
			var sq = this.squareList[i];
			var boundBoxPointList = sq.getBoundingBoxPointsWorld();
			for(var j = 0; j < boundBoxPointList.length; j++)
			{
				var currentPoint = boundBoxPointList[j];
				listOfBoundingBoxPoints.push(currentPoint);
			}
		}
		return listOfBoundingBoxPoints;
	}

	constructor() 
	{
		super();
		this.disabled = false;
		this.squareList = [];
	}
}