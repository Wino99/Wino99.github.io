class SolidBrush
{
	//initiera en ny färg
	constructor(a,r,g,b)
	{
		this.r = Math.floor(r);
		this.g = Math.floor(g);
		this.b = Math.floor(b);
		this.a = a/255;
	}
	
	//returnerna färgen i ett format som html5 känner igen
	getColorInText()
	{
		return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
	}
}
