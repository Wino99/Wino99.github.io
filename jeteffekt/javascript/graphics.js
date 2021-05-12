"use strict";
class Graphics
{	
	static init()
	{
		this.ctx = $("#gameCanvas")[0].getContext("2d");
		$('body').css('margin', '0');  //No margins
		$('body').css('overflow', 'hidden'); //Hide scrollbars
		this.updateWindowsSize();
	
	}
	static drawBackground() 
	{
		this.ctx.fillStyle="#000000";
		this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
	}
	
	static updateWindowsSize()
	{
		//återställer storleken av canvasen efter webbläsarens storlek
		this.ctx.canvas.width  = $(window).width();
		this.ctx.canvas.height = $(window).height();	
		//updaterar även spelets interna upplösning för skalning
		GameManager.windowSize = new Vector2(this.ctx.canvas.width, this.ctx.canvas.height);
	}
	static fillTextWithLineBreaks(font,color,text,fontSize,position)
	{
		var seperator = "\n";
		var splitIntoLines = text.split(seperator);
		for(var i = 0; i < splitIntoLines.length; i++)
		{
			var newPosition = new Vector2(position.X, position.Y + fontSize*i);
			this.fillText(font,color,splitIntoLines[i],newPosition);	
		}
	}
	static fillText(font,color,text,position)
	{
			this.ctx.fillStyle = color;
			this.ctx.font = font;
			this.ctx.fillText(text, position.X, position.Y);
	}
	static refreshGraphics()
	{
		this.updateWindowsSize();
		this.drawBackground();
		this.updateGraphics();
	}

	static drawLine(origin, destination,color)
	{
		this.ctx.beginPath();
		this.ctx.strokeStyle=color;
		this.ctx.lineWidth = 0.5;
		this.ctx.moveTo(Math.floor(origin.X + GameManager.cameraPosition.X), Math.floor(origin.Y + GameManager.cameraPosition.Y));
		this.ctx.lineTo(Math.floor(destination.X + GameManager.cameraPosition.X), Math.floor(destination.Y + GameManager.cameraPosition.Y));
		this.ctx.stroke();
		this.ctx.lineWidth = 1;
	}
	
	//takes color and a graphicpath
	static fillPath(color,renderObject, transparency)
	{
		this.ctx.beginPath();
		this.ctx.fillStyle=color;
		this.ctx.globalAlpha = transparency;
		this.ctx.moveTo(renderObject.positionList[0].X, renderObject.positionList[0].Y);
		for(var x = 1; x < renderObject.positionList.length; x++)
		{
			//vector2
			var currentPoint = renderObject.positionList[x];
			this.ctx.lineTo(renderObject.positionList[x].X, renderObject.positionList[x].Y);
		}
		this.ctx.closePath();
		//this.ctx.stroke();
		this.ctx.fill();
		this.ctx.globalAlpha = 1;
	}
	
	static updateGraphics()
	{
		for(var i = 0; i < GameManager.collisionModelList.length; i++)
		{
			var currentShip = GameManager.collisionModelList[i];

			if (currentShip.isShip)
			{
				UI.drawTargetLines(currentShip);
			}
			//foreach (GraphicsObject renderObject in currentShip.getRenderableMeshes(Vector2.zeroVector(), 1))
			//foreach (GraphicsObject renderObject in currentShip.getRenderableMeshes(GameManager.cameraPosition, Camera.zoomScalar))
			
			//får geometrin för modellen
			var list = currentShip.getRenderableMeshes(GameManager.cameraPosition, Camera.zoomScalar);
			//ritar varje del av geometrin
			for(var j = 0; j < list.length; j++)
			{
				var renderObject = list[j];
				this.fillPath(currentShip.color, renderObject.renderObject, 1);
			}
		}
		for(var j = 0; j < GameManager.asteroidList.length; j++)
		{
			var currentAsteroid = GameManager.asteroidList[j];
			var renderObject = currentAsteroid.getRenderableMeshes(GameManager.cameraPosition, Camera.zoomScalar);
			this.fillPath(currentAsteroid.color, renderObject.renderObject, 1);
		}
		for(var i = 0; i < GameManager.explosionEffectList.length; i++)
		{
			var currentExplosionEffect = GameManager.explosionEffectList[i];
			var renderObject = currentExplosionEffect.nextframe(GameManager.cameraPosition, Camera.zoomScalar, 10);
			this.fillPath(renderObject.color.getColorInText(), renderObject.renderObject, renderObject.color.a);
		}
	}
}