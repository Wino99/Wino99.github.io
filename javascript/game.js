"use strict";
$(document).ready(init);
var gameLoop;
var music;


function init()
{	
	Graphics.init();
	music = new sound(musicPath);
	//Initialiserar spelet
	GameManager.init();
    gameLoop = setInterval(loop, TIME_PER_FRAME);
	$(document).keydown(keyDownHandler);
	$(document).keyup(keyUpHandler);
}
function loop()
{
	//spel logiken
	GameManager.update(TIME_PER_FRAME*3);
	//grafiken
	Graphics.refreshGraphics();
	UI.update();
}


var GameManager =
{
	//sköld funktionen
	smartBomb : function()
	{
		if (this.timeSinceLastSmartbomb > 2.5)
		{
			
			this.timeSinceLastSmartbomb = 0;
			var explosionEffect = new ExplosionEffect();
			//skapar effekten
			//ExplosionEffect.normalConstructor(this.playerShip.position, 2000, this.playerShip.velocity);
			explosionEffect.normalConstructor(this.playerShip.position, 2000, Vector2.zeroVector());
			explosionEffect.blueColor = true;
			this.explosionEffectList.push(explosionEffect);
			//repellerar alla asteroider inom 2000 distans
			for(var i = 0; i < this.asteroidList.length; i++)
			{
				var asteroid = this.asteroidList[i];
				if (Vector2.getDifference(asteroid.position, this.playerShip.position).getLength() < 2000 && asteroid.weight < 10000)
				{
					var distance = Vector2.getDifference(asteroid.position, this.playerShip.position).getLength();
					//distance = distance - asteroidList[i].size / 2;
					var difference = Vector2.getDifference(asteroid.position, this.playerShip.position);
					var angle = Math.atan2(difference.Y, difference.X);
					var toX = Math.cos(angle);
					var toY = Math.sin(angle);

					asteroid.velocity = new Vector2(
						asteroid.velocity.X + toX * 1000,
						asteroid.velocity.Y + toY * 1000
					);
				}
			}
			//repellerar all skott inom 2000 distans
			for(var i = 0; i < this.collisionModelList.length; i++)
			{
				var collisionModel = this.collisionModelList[i];
				if(collisionModel.isBullet)
				{
					if (Vector2.getDifference(collisionModel.position, this.playerShip.position).getLength() < 2000)
					{
						var distance = Vector2.getDifference(collisionModel.position, this.playerShip.position).getLength();
						//distance = distance - asteroidList[i].size / 2;
						var difference = Vector2.getDifference(collisionModel.position, this.playerShip.position);
						var angle = Math.atan2(difference.Y, difference.X);
						var toX = Math.cos(angle);
						var toY = Math.sin(angle);

						collisionModel.velocity = new Vector2(
							collisionModel.velocity.X + toX * 1000,
							collisionModel.velocity.Y + toY * 1000
						);
					}
				}
			}
		}
	},
	//återställ spelet
	resetgame : function()
	{
		//återställer spelet
		music.reset();
		//playerShip = null;
		//innehåller skepp och bullets
		this.collisionModelList = [];
		//innehåller alla asteroider
		this.asteroidList = [];
		//innehåller explosioneffekt partikeleffekterna
		this.explosionEffectList = [];
	},
	//sprider ut asteroid på spelbanan
	spawnAsteroids : function()
	{
		//olika grader av asteroider, stora, medium och små
		for (var i = 1; i < 150; i++)
		{
			this.asteroidList.push(new Asteroid(MathExtension.randomBetween(50, 1000), new Vector2(MathExtension.randomBetween(-10000, 10000), MathExtension.randomBetween(-10000, 10000)), new Vector2(MathExtension.randomBetween(-200, 200), MathExtension.randomBetween(-200, 200))));
		}
		for (var i = 1; i < 5; i++)
		{
			var toAdd = new Asteroid(MathExtension.randomBetween(2000, 3000), new Vector2(MathExtension.randomBetween(-10000, 10000), MathExtension.randomBetween(-10000, 10000)), new Vector2(MathExtension.randomBetween(-200, 200), MathExtension.randomBetween(-200, 200)));
			//toAdd.noVelocity = true;
			this.asteroidList.push(toAdd);
		}
		for (var i = 0; i < 5; i++)
		{
			var toAdd = new Asteroid(MathExtension.randomBetween(5000, 9000), new Vector2(MathExtension.randomBetween(-10000, 10000), MathExtension.randomBetween(-10000, 10000)), new Vector2(MathExtension.randomBetween(-100, 100), MathExtension.randomBetween(-100, 100)));
			//toAdd.noVelocity = true;
			this.asteroidList.push(toAdd);
		}
	},
	
	spawnRandomShips : function()
	{
		for (var i = 0; i < 3; i++)
		{
			var adder = new Ship(0.3, new Vector2(2, 2), new Vector2(2, 2), 100, 7, 400, 1, -1, 200, 0);

			adder.addCube(new Vector2(0, 0), new Vector2(0, 75), 3);

			adder.addCube(new Vector2(0, 0), new Vector2(-100, 35), 4);
			adder.addCube(new Vector2(0, 0), new Vector2(100, 35), 4);


			adder.addCube(new Vector2(0, 0), new Vector2(0, -25), 10);


			adder.addCube(new Vector2(0, 0), new Vector2(-5, 25), 2);
			adder.addCube(new Vector2(0, 0), new Vector2(5, 25), 2);

			adder.position = new Vector2(MathExtension.randomBetween(-1000, 1000), MathExtension.randomBetween(-1000, 1000));
			this.collisionModelList.push(adder);
		}
	},
	
	stationSpawn : function()
	{
		var shipTemplate = new Ship(0.01, new Vector2(10, 10), new Vector2(10, 10), 200, 30, 500, 0.3, -30, 1340, 10);

		shipTemplate.maxVelocity = 1;

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(0, 300), 40);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(0, 600), 30);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(0, 900), 20);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(0, 1000), 10);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(0, 1020), 5);

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(300, 100), 40);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-300, 100), 40);

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-300, 100), 40);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-300, 100), 40);

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-200, -75), 26);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(200, -75), 26);

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-100, -110), 18);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(100, -110), 18);

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-30, -135), 12);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(30, -135), 12);


		shipTemplate.maxVelocity = 1;
		shipTemplate.totalTimeToPurge = 30;
		shipTemplate.transparentTime = 27.5;
		shipTemplate.AIEnabled = true;
		shipTemplate.noVelocity = true;
		shipTemplate.explosionSize = 100000;

		shipTemplate.position = new Vector2(0, 0);

		this.stationShip = shipTemplate;
		this.collisionModelList.push(shipTemplate);
	},
	
	dreadSpawn : function()
	{
		var shipTemplate = new Ship(0.01, new Vector2(0.03, 0.03), new Vector2(0.03, 0.03), 100, 20, 800, 0.1, 30, 740, 10);

		shipTemplate.maxVelocity = 1;

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-100, 0), 40);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(100, 0), 40);


		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-100, 500), 20);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(100, 500), 20);

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-50, 300), 10);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(50, 300), 10);

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(200, -100), 40);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-200, -100), 40);


		shipTemplate.addCube(new Vector2(0, 0), new Vector2(200, 290), 20);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-200, 290), 20);


		shipTemplate.totalTimeToPurge = 30;
		shipTemplate.transparentTime = 27.5;
		shipTemplate.AIEnabled = true;
		//shipTemplate.noVelocity = true;
		shipTemplate.explosionSize = 100000;

		shipTemplate.position = new Vector2(0, 0);
		this.stationShip = shipTemplate;
		this.collisionModelList.push(shipTemplate);
	},
	
	playerSpawn : function()
	{
		//var shipTemplate = new Ship(0.14, new Vector2(65, 65), new Vector2(65, 65), 100, 7, 600, 0.15, -1);

		//shipTemplate.maxVelocity = 120;

		var shipTemplate = new Ship(0.14, new Vector2(70, 70), new Vector2(70, 70), 100, 7, 700, 0.015, -1, 100, 0);

		shipTemplate.maxVelocity = 120;


		shipTemplate.addCube(new Vector2(0, 0), new Vector2(0, 25), 10);

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(10, -25), 10);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-10, -25), 10);

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-100, 35), 10);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(100, 35), 10);

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-50, 17), 10);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(50, 17), 10);


		shipTemplate.addCube(new Vector2(0, 0), new Vector2(-75, 24), 10);
		shipTemplate.addCube(new Vector2(0, 0), new Vector2(75, 24), 10);

		shipTemplate.addCube(new Vector2(0, 0), new Vector2(75, 24), 10);


		shipTemplate.AIEnabled = false;

		shipTemplate.position = new Vector2(1350, 1350);
		this.playerShip = shipTemplate;

		this.collisionModelList.push(this.playerShip);
	},
	
	init : function()
	{
		this.currentLevel = 1;
		this.timeSinceLastSmartbomb = 0;
		this.explosionEffectList = [];
		this.collisionModelList = [];
		this.asteroidList = [];
		this.currentLevel = 1;
		this.cameraPosition = new Vector2(0, 0);
		Camera.rotation = 0;
		this.onFirstPage = true;
		this.onSecondPage = false;
		this.onThirdPage = false;
		this.onForthPage = false;
		GameManager.playerShip = new Ship(0.1, new Vector2(30, 30), new Vector2(30, 30), 1000, 700, 10000, 300, -1);
		//    spawnAsteroids();
		//spawnAmmoPickups();
		//stationSpawn();
		//  dreadSpawn();   
		// spawnFuelPickups();
		//var appPath = Path.GetDirectoryName(Application.ExecutablePath);
		// ExplosionSound = new SoundPlayer(appPath + "/explosion.wav");
		// FireSound = new SoundPlayer(appPath + "/fire.wav");
		// MusicSound = new SoundPlayer(appPath + "/music.wav");
		// ImpactSound = new SoundPlayer(appPath + "/impact.wav");
	},
	
	//De olika nivåerna
	level1 : function()
	{
		this.playerSpawn();
		this.spawnAsteroids();
		//spawnAmmoPickups();
		this.spawnRandomShips();
	},
	
	level2 : function()
	{
		this.playerSpawn();
		this.spawnAsteroids();
		// spawnAmmoPickups();
		this.spawnRandomShips();
		this.dreadSpawn();
	},
	
	level3 : function()
	{
		this.playerSpawn();
		this.spawnAsteroids();
		//spawnAmmoPickups();
		this.spawnRandomShips();
		this.stationSpawn();
	},
	//exploderar en bullet
	explode : function(bullet, sourceVelocity)
	{
		//hanterar om ett skott träffar någonting
		bullet.disabled = true;
		var explosionEffect = new ExplosionEffect();
		explosionEffect.normalConstructor(bullet.getScreenPosition(new Vector2(0, 0)), 100, sourceVelocity);
		GameManager.explosionEffectList.push(explosionEffect);
		//aoe skada
		for (var i = 0; i < this.collisionModelList.length; i++)
		{
			var CMS = this.collisionModelList[i];
			if (Vector2.getDifference(CMS.position, bullet.position).getLength() < 200 && CMS.disabled == false)
			{
				var distance = Vector2.getDifference(CMS.position, bullet.position).getLength();
				var difference = Vector2.getDifference(CMS.position, bullet.position);
				var angle = Math.atan2(difference.Y, difference.X);
				var toX = Math.cos(angle);
				var toY = Math.sin(angle);

				if (CMS.isShip)
				{
					//Explosion.Ctlcontrols.play();
					makePlayAudio(explosion);
					//CMS.rotationalVelocity = Math.random() * Math.PI * 0.8 - Math.PI * 0.4;
					CMS.velocity = new Vector2(
						CMS.velocity.X + toX * -10,
						CMS.velocity.Y + toY * -10
					);
					var Ship = CMS;
					Ship.takeDamage(bullet.getDamage(Ship.velocity));
				}
				if (CMS.isBullet)
				{
					this.explode(CMS, CMS.velocity);
				}
			}
		}
	},
	//updaterar spelet
	update : function(ticksPerSecond)
	{	
		//Om spelaren är död så updatera inte
		if(this.playerShip.disabled)
		{
			return;
		}
		if(!this.onForthPage)
		{
			this.score = this.score + 1;
		}
		this.timeSinceLastSmartbomb =  this.timeSinceLastSmartbomb + 1 / 100;
		
		//spelarskeppet återställer sakta skada, andra skepp gör ej det
		if (this.playerShip.HP < 100)
		{
			this.playerShip.HP = this.playerShip.HP + 0.04;
		}	
		//hanterar gravitation mellan asteroider
		for (var i = 0; i < this.asteroidList.length; i++)
		{
			for (var j = 0; j < this.asteroidList.length; j++)
			{
				if (i == j) //IF SAME, skip this
					continue;
				var distance = Vector2.getDifference(this.asteroidList[i].position, this.asteroidList[j].position).getLength();
				var difference = Vector2.getDifference(this.asteroidList[i].position, this.asteroidList[j].position);
				var angle = Math.atan2(difference.Y, difference.X);
				var toX = Math.cos(angle);
				var toY = Math.sin(angle);

				if (distance < (this.asteroidList[i].size + this.asteroidList[j].size))
				{
					var Over = (this.asteroidList[i].size + this.asteroidList[j].size) - distance;

					this.asteroidList[i].velocity = new Vector2(
						this.asteroidList[i].velocity.X + toX * 20,
						this.asteroidList[i].velocity.Y + toY * 20
					);
					this.asteroidList[j].velocity = new Vector2(
						this.asteroidList[j].velocity.X + toX * -20,
						this.asteroidList[j].velocity.Y + toY * -20
					);
					continue;
				}

				this.asteroidList[j].velocity = new Vector2
				(
					this.asteroidList[j].velocity.X + this.asteroidList[i].weight / (distance) * toX * 0.5 / ticksPerSecond,
					this.asteroidList[j].velocity.Y + this.asteroidList[i].weight / (distance) * toY * 0.5 / ticksPerSecond
				);
			}
		}

		//hanterar kollision av asteroider
		for (var i = 0; i < this.asteroidList.length; i++)
		{
			if (this.playerShip.asteroidToShipCollisionCheck(this.asteroidList[i].position, this.asteroidList[i].size) == true)
			{
				this.playerShip.takeDamage(10);
			}
			for (var j = 0; j < this.collisionModelList.length; j++)
			{
				var distance = Vector2.getDifference(this.asteroidList[i].position, this.collisionModelList[j].position).getLength();
				//distance = distance - asteroidList[i].size / 2;
				var difference = Vector2.getDifference(this.asteroidList[i].position, this.collisionModelList[j].position);
				var angle = Math.atan2(difference.Y, difference.X);
				var toX = Math.cos(angle);
				var toY = Math.sin(angle);

				if (distance < 5000)
				{

					if (this.collisionModelList[j].asteroidToShipCollisionCheck(this.asteroidList[i].position, this.asteroidList[i].size) == true)
					{
						// GameManager.Crash.Ctlcontrols.play();
						//makePlayAudio(collision);
						if (this.collisionModelList[j].isBullet)
						{
							this.explode(this.collisionModelList[j], this.asteroidList[i].velocity);
						}
						if (this.collisionModelList[j].isShip)
						{
							var tests = this.collisionModelList[j];
							// tests.HP = tests.HP - 10;
							//tests.takeDamage(10);
						}
						this.asteroidList[i].velocity = new Vector2(
							this.asteroidList[i].velocity.X + toX * 10,
							this.asteroidList[i].velocity.Y + toY * 10
						);
						this.collisionModelList[j].velocity = new Vector2(
							this.collisionModelList[j].velocity.X + toX * -100,
							this.collisionModelList[j].velocity.Y + toY * -100
						);
					}
				}

				this.collisionModelList[j].velocity = new Vector2
				(
					this.collisionModelList[j].velocity.X + this.asteroidList[i].weight / (distance) * toX * 1 / ticksPerSecond,
					this.collisionModelList[j].velocity.Y + this.asteroidList[i].weight / (distance) * toY * 1 / ticksPerSecond
				);
			}
		}

		//hanterar kollisioner mellan kollisionsmodeller
		for (var i = 0; i < this.collisionModelList.length; i++)
		{
			for (var j = 0; j < this.collisionModelList.length; j++)
			{
				if (i == j || this.collisionModelList[j].disabled || this.collisionModelList[i].disabled)
					continue;

				var distance = Vector2.getDifference(this.collisionModelList[i].position, this.collisionModelList[j].position).getLength();
				//distance = distance - asteroidList[i].size / 2;
				var difference = Vector2.getDifference(this.collisionModelList[i].position, this.collisionModelList[j].position);
				var angle = Math.atan2(difference.Y, difference.X);
				var toX = Math.cos(angle);
				var toY = Math.sin(angle);
				if (distance < 1000)
				{
					if (this.collisionModelList[i].shipToShipCollision(this.collisionModelList[j]) == true)
					{
						//  GameManager.Crash.Ctlcontrols.play();
						//makePlayAudio(collision);
						if (this.collisionModelList[j].isBullet)
						{
							this.explode(this.collisionModelList[j], this.collisionModelList[i].velocity);
						}
						if (this.collisionModelList[i].isBullet)
						{
							this.explode(this.collisionModelList[i], this.collisionModelList[j].velocity);
						}

						this.collisionModelList[i].velocity = new Vector2(
						this.collisionModelList[i].velocity.X + toX * 20,
						this.collisionModelList[i].velocity.Y + toY * 20
						);

						this.collisionModelList[j].velocity = new Vector2(
							this.collisionModelList[j].velocity.X + toX * -20,
							this.collisionModelList[j].velocity.Y + toY * -20
						);
					}
				}
			}
		}

		//updaterar kameran
		
		// cameraPosition = new Vector2(playerShip.position.X - Form1.ActiveForm.width / 2, playerShip.position.Y - Form1.ActiveForm.height / 2);
		Camera.position = this.playerShip.position;
		//Camera.rotation = this.playerShip.rotationHistory[2]  + Math.PI/2;
		Camera.rotation = this.playerShip.rotation  + Math.PI/2;
		this.cameraPosition = new Vector2(this.windowSize.X / 2, this.windowSize.Y / 2);
		//foreach (CollisionModel shi in collisionModelList.ToArray())
		
		//updaterar alla kollisonsmodeller
		for(var i = 0; i < this.collisionModelList.length; i++)
		{
			var shi = this.collisionModelList[i];
			shi.update(ticksPerSecond);
		}

		//updaterar alla asteroider
		for(var i = 0; i < this.asteroidList.length; i++)
		{
			var ast = this.asteroidList[i];
			ast.update(ticksPerSecond);
		}

		//updaterar alla explosioneffekter
		for(var i = this.explosionEffectList.length - 1; i > 0; i--)
		{
			var currentExplosionEffect = this.explosionEffectList[i];
			if (currentExplosionEffect.time > currentExplosionEffect.totalTimeBeforePurge)
			{
				this.explosionEffectList.splice(i,0);
			}
		}

		//tar bort förstörda skepp
		for(var i = this.collisionModelList.length - 1; i > 0; i--)
		{
			var shi = this.collisionModelList[i];
				if (shi.disabled)
				this.collisionModelList.splice(i,1);
		}
		
		//om det inte finns mer skep än ett så antars att spelaren har klarat nivån och förstört alla andra skepp
		var mounts = 0;
		for(var i = 0; i < this.collisionModelList.length; i++)
		{
			var asdd = this.collisionModelList[i];
			if (asdd.isShip)
			{
				mounts++;
			}
		}

		if (mounts == 1 && this.playerShip.disabled == false)
		{
			//visar nästa meny skärm t
			this.resetgame();
			//onxpage används för att kontrollera att menyn visas
			if (this.currentLevel == 1)
			{
				this.onFirstPage = false;
				this.onSecondPage = true;
				this.onThirdPage = false;
				this.onForthPage = false;
			}
			if (this.currentLevel == 2)
			{
				this.onFirstPage = false;
				this.onSecondPage = false;
				this.onThirdPage = true;
				this.onForthPage = false;
			}
			if (this.currentLevel == 3)
			{
				this.onFirstPage = false;
				this.onSecondPage = false;
				this.onThirdPage = false;
				this.onForthPage = true;
			}
		}
	}
};
  

function keyDownHandler(event)
{
	music.play();
	if (event.which === c_key)
	{
		if (GameManager.onFirstPage)
		{
			GameManager.score = 0;
			GameManager.resetgame();
			GameManager.level1();
			GameManager.onFirstPage = false;
			GameManager.currentLevel = 1;
		}
		else if (GameManager.onSecondPage)
		{
			GameManager.resetgame();
			GameManager.level2();
			GameManager.onSecondPage = false;
			GameManager.currentLevel++;

		}
		else if (GameManager.onThirdPage)
		{
			GameManager.resetgame();
			GameManager.level3();
			GameManager.onThirdPage = false;
			GameManager.currentLevel++;

		}
		else if (GameManager.onForthPage)
		{
			GameManager.resetgame();
			GameManager.level1();
			GameManager.onFirstPage = false;
			GameManager.currentLevel = 1;
		}
		if (GameManager.playerShip.disabled)
		{
			GameManager.onFirstPage = true;
		}
	}
	if(!GameManager.playerShip.disabled)
	{		
		if (event.which === x_key)
		{
			GameManager.playerShip.fireGun();
		}
		if (event.which === w_key)
		{
			GameManager.playerShip.posControlVectorThisTick.Y = 1;
		}
		if (event.which === a_key)
		{
			GameManager.playerShip.posControlVectorThisTick.X = -1;
		}
		if (event.which === s_key)
		{
			GameManager.playerShip.posControlVectorThisTick.Y = -1;
		}
		if (event.which === d_key)
		{
			GameManager.playerShip.posControlVectorThisTick.X = 1;
		}
		if (event.which === q_key)
		{
			GameManager.playerShip.rotControlVectorAccThisTick = 1;
		}
		if (event.which === down_arrow_key)
		{
			Camera.zoomScalar = Camera.zoomScalar * 0.9;
		}
		if (event.which === up_arrow_key)
		{
			Camera.zoomScalar = Camera.zoomScalar * 1.1;
		}
		if (event.which === e_key)
		{
			GameManager.playerShip.rotControlVectorAccThisTick = -1;
		}
		if (event.which === left_arrow_key)
		{
			GameManager.playerShip.rotControlVectorAccThisTick = 1;
		}
		if (event.which === right_arrow_key)
		{
			GameManager.playerShip.rotControlVectorAccThisTick = -1;
		}
		if (event.which === f_key)
		{
			GameManager.smartBomb();
		}
	}
}

function keyUpHandler(event)
{
	if (event.which === w_key)
	{
		GameManager.playerShip.posControlVectorThisTick.Y = 0;
	}
	if (event.which === a_key)
	{
		GameManager.playerShip.posControlVectorThisTick.X = 0;
	}
	if (event.which === s_key)
	{
		GameManager.playerShip.posControlVectorThisTick.Y = 0;
	}
	if (event.which === d_key)
	{
		GameManager.playerShip.posControlVectorThisTick.X = 0;
	}
	if (event.which === q_key)
	{
		GameManager.playerShip.rotControlVectorAccThisTick = 0;
	}
	if (event.which === e_key)
	{
		GameManager.playerShip.rotControlVectorAccThisTick = 0;
	}
	if (event.which === left_arrow_key)
	{
		GameManager.playerShip.rotControlVectorAccThisTick = 0;
	}
	if (event.which === right_arrow_key)
	{
		GameManager.playerShip.rotControlVectorAccThisTick = 0;
	}
}