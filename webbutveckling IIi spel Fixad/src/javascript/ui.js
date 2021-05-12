"use strict";
class UI
{
	static update()
	{
		//visar var spelaren åker
		this.drawVelocityWayPoint();

		//spelaren har inte dött
		if (GameManager.playerShip.disabled != true)
			this.drawHUD();

		//spelaren har dött
		if (GameManager.playerShip.disabled)
			this.drawGameOverScreen();

		//ritar menun som kontroller flödet mellan nivåer
		this.drawMenu();
	}

	static drawVelocityWayPoint()
	{
		var velocityWaypoint = GameManager.playerShip.velocity; //.getNormalizedVector();
		velocityWaypoint = new Vector2(velocityWaypoint.X * 10, velocityWaypoint.Y * 10);
		velocityWaypoint = new Vector2(velocityWaypoint.X + GameManager.playerShip.position.X, velocityWaypoint.Y + GameManager.playerShip.position.Y);

		velocityWaypoint = Camera.getLocalPosition(velocityWaypoint);
		velocityWaypoint = new Vector2(velocityWaypoint.X * Camera.zoomScalar, velocityWaypoint.Y * Camera.zoomScalar);
		var velocityOrigin = Camera.getLocalPosition(GameManager.playerShip.position);
		velocityOrigin = new Vector2(velocityOrigin.X * Camera.zoomScalar, velocityOrigin.Y * Camera.zoomScalar);
		Graphics.drawLine(velocityOrigin,velocityWaypoint,blue);
	}
	
	static drawGrid()
	{
		var distanceBetweenLines = 100;

		var AXOver = GameManager.cameraPosition.X % distanceBetweenLines;
		var AYOver = GameManager.cameraPosition.Y % distanceBetweenLines;

		for (var height = -GameManager.windowSize.Y * 2; height < GameManager.windowSize.Y * 2; height = height + distanceBetweenLines)
		{
			for (var width = -GameManager.windowSize.X * 2; width < GameManager.windowSize.X * 2; width = width + distanceBetweenLines)
			{
				var newpos = Camera.getLocalPosition(new Vector2(Camera.position.X + width - AXOver, Camera.position.Y + height - AYOver));
				newpos = new Vector2(newpos.X * Camera.zoomScalar, newpos.Y * Camera.zoomScalar);
				//Vector2 newpos = new Vector2(width - AXOver, height - AYOver);

				//g.FillRectangle(Brushes.black, (float)width - (float)AXOver, height - (float)AYOver, 2, 2);
				// g.FillRectangle(Brushes.White, (int)newpos.X + (int)GameManager.cameraPosition.X, (int)newpos.Y + (int)GameManager.cameraPosition.Y, (float)2, (float)2);
				// base.OnPaint(e);
			}
		}
	}
	static drawGameOverScreen()
	{
		var coveringRectangle = new GraphicsPath();
		coveringRectangle.addRectangle(new Vector2(0,GameManager.windowSize.Y / 2), new Vector2(3000, 140));
		Graphics.fillPath(darkGoldenrod,coveringRectangle,1);


		Graphics.fillTextWithLineBreaks("140px sans-serif", darkRed, "DU DOG",140, new Vector2(Math.floor(GameManager.windowSize.X / 20), Math.floor(GameManager.windowSize.Y / 2) + 120));

		Graphics.fillTextWithLineBreaks("80px sans-serif", darkRed, "tryck C för att pröva igen",80, new Vector2(Math.floor(GameManager.windowSize.X / 20), Math.floor(GameManager.windowSize.Y / 1.1)));
	}
	static drawHUD()
	{
		var append = "";
		if (GameManager.playerShip.bulletFireRate < GameManager.playerShip.timeSinceLastBulletShot)
		{
			append = "(X) kan skjuta";
		}
		else
		{
			append = "kan skjuta om " + ((GameManager.playerShip.bulletFireRate - GameManager.playerShip.timeSinceLastBulletShot) * 2).toFixed(2);
		}
		append = append + "\n";
		if (GameManager.timeSinceLastSmartbomb > 2.5)
		{
			append = append + "(F) kan aktivera sköld";
		}
		else
		{
			append = append + "Sköld laddad om " + ((2.5 - GameManager.timeSinceLastSmartbomb) * 2).toFixed(2);
		}
		var finalString = "Sköld styrka " + GameManager.playerShip.HP.toFixed(2) + "%\n" + append;			
		Graphics.fillTextWithLineBreaks("40px sans-serif", darkGreen, finalString,40, new Vector2(Math.floor(GameManager.windowSize.X / 10), Math.floor(GameManager.windowSize.Y / 1.4)));
	}
	//ritar menyn
	static drawMenu()
	{
		var backgroundCover = new GraphicsPath();
		if (GameManager.onFirstPage)
		{
			backgroundCover.addRectangle(Vector2.zeroVector(), new Vector2(GameManager.windowSize.X, GameManager.windowSize.Y));
			Graphics.fillPath(black, backgroundCover, 1);

			Graphics.fillTextWithLineBreaks("40px sans-serif", darkGreen, "Isboi har anfallit \nDu måste stoppa han \nFörstör isbois rymdstation\nW A S D för att kontrollera skeppets rörelse\nUpp och ner piltangenter för att zooma in och ut\nVänster och höger piltangenter för att rotera skeppet\n(X) för att skjuta, (F) för att aktivera sköld\ntryck C för att fortsätta",40, new Vector2(Math.floor(GameManager.windowSize.X / 20), Math.floor(GameManager.windowSize.Y / 2)));
		}
		if (GameManager.onSecondPage)
		{
			backgroundCover.addRectangle(Vector2.zeroVector(), new Vector2(GameManager.windowSize.X, GameManager.windowSize.Y));
			Graphics.fillPath(black, backgroundCover, 1);

			Graphics.fillTextWithLineBreaks("40px sans-serif", darkGreen, "Du lyckades slå isbois första anfall\nMen det kommer mer\n(C)",40, new Vector2(Math.floor(GameManager.windowSize.X / 20), Math.floor(GameManager.windowSize.Y / 2)));
		}
		if (GameManager.onThirdPage)
		{
			backgroundCover.addRectangle(Vector2.zeroVector(), new Vector2(GameManager.windowSize.X, GameManager.windowSize.Y));
			Graphics.fillPath(black, backgroundCover, 1);

			Graphics.fillTextWithLineBreaks("40px sans-serif", darkGreen, "Nu är det bara rymdstationen kvar\n(C)",40, new Vector2(Math.floor(GameManager.windowSize.X / 20), Math.floor(GameManager.windowSize.Y / 2)));
		}
		if (GameManager.onForthPage)
		{
			backgroundCover.addRectangle(Vector2.zeroVector(), new Vector2(GameManager.windowSize.X, GameManager.windowSize.Y));
			Graphics.fillPath(black, backgroundCover, 1);

			Graphics.fillTextWithLineBreaks("40px sans-serif", darkGreen, "ISBOI ÄR besegrad\nDu fick " + 1/GameManager.score*1000000 + " poäng, \nklara spelet snabbare för mer poäng",40, new Vector2(Math.floor(GameManager.windowSize.X / 20), Math.floor(GameManager.windowSize.Y / 2)));
		}
	}
	//ritar linjer mellan spelar skeppet och fiender
	static drawTargetLines(currentShip)
	{
		var waypoint = currentShip.decideDestination();

		waypoint = Camera.getLocalPosition(waypoint);

		waypoint = new Vector2(waypoint.X * Camera.zoomScalar, waypoint.Y * Camera.zoomScalar);

		var origin = Camera.getLocalPosition(currentShip.position);

		origin = new Vector2(origin.X * Camera.zoomScalar, origin.Y * Camera.zoomScalar);
		Graphics.drawLine(origin,waypoint,red);
	}
}