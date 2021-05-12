"use strict";

function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.volume = 0.4;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.setAttribute("loop", "false");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function()
	{
		this.sound.play();
	};
	this.stop = function()
	{
		this.sound.pause();
	};
	this.reset = function()
	{
		this.sound.pause();
		this.sound.currentTime = 0;
		this.sound.play();  	
	};
}
var makePlayAudio = function(src) 
{
	var aud = new Audio();
	aud.src = src;
	aud.volume = 0.03;
	aud.play();
};