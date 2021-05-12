"use strict";
class MathExtension
{
	static getPositiveNumber(number)
	{
		return Math.sqrt(number * number);
	}
	
	static radianToDegree(radian)
	{
		return (radian / Math.PI) * 180;
	}   
	
	static randomBetween(low,high)
	{
		var x = (high - low) * Math.random();
		x+=low;
		return x;
	}
	
	static getTriangleRotation(triangleSize)
	{
		return Math.atan2(triangleSize.Y, triangleSize.X);
	}
};