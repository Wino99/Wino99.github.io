"use strict";
class Camera
{
	//ger den lokala positionen inom kameran som används för att rita grafiken
	static getLocalPosition(screenPosition)
	{
		var rotation = Camera.rotation + Math.PI / 2;
		var parentSpacePosition = screenPosition;

		//Ändra position noll axis till den här pivoten
		parentSpacePosition = new Vector2(parentSpacePosition.X - Camera.position.X, parentSpacePosition.Y - Camera.position.Y);
		//ändra position beroende på rotationen av pivoten
		parentSpacePosition = new Vector2(Math.cos(Camera.rotation) * parentSpacePosition.X + Math.sin(Camera.rotation) * parentSpacePosition.Y, -Math.sin(Camera.rotation) * parentSpacePosition.X + Math.cos(Camera.rotation * 1) * parentSpacePosition.Y);
		return parentSpacePosition;
	}
};
Camera.position = Vector2.zeroVector();
Camera.zoomScalar = 1;
Camera.rotation = 0;