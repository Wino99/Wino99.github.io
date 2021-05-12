class Ship extends CollisionModel
{
	//Kontrollerar om skeppet är död eller inte
	takeDamage(dmg)
	{
		this.HP = this.HP - dmg;
		if (this.HP <= 0)
		{
			this.disabled = true;
			var news = new ExplosionEffect();
			news.longConstructor(this.getScreenPosition(new Vector2(0, 0)), this.explosionSize, this.velocity, this.transparentTime, this.totalTimeToPurge);
			GameManager.explosionEffectList.push(news);
		}
	}
	
	//skjuter vapnet
	fireGun()
	{
		if(this.disabled)
			return;
		if (this.timeSinceLastBulletShot >= this.bulletFireRate && this.bulletsLeft != 0)
		{
			// GameManager.Fire.Ctlcontrols.play();
			makePlayAudio(laser);
			this.bulletsLeft--;
			this.timeSinceLastBulletShot = 0;
			var bullet = new Bullet(this.getScreenPosition(new Vector2(this.bulletSpawnDistance, 0)), this.getScreenDirection(new Vector2(this.bulletVelocity, 0)), this.bulletSize);
			bullet.velocity.X = bullet.velocity.X + this.velocity.X;
			bullet.velocity.Y = bullet.velocity.Y + this.velocity.Y;
			GameManager.collisionModelList.push(bullet);
		}
	}
	
	//genererar effekter beroende på vad skeppet gör
	thrustUpdater(ticksPerSecond)
	{
		var news = new ExplosionEffect();
		if (this.posControlVectorThisTick.X > 0)
		{
			
			news.normalConstructor(this.getScreenPosition(new Vector2(0, -120)), 30, Vector2.combineTwoVectors(this.velocity, this.getScreenDirection(new Vector2(0, -0.5 * this.velocity.getLength()))));

			this.velocity.X = this.velocity.X + -1 * this.posControlVectorThisTick.X * Math.sin(this.rotation) * this.XPositionalAccelerationPerSecond.X / ticksPerSecond;
			this.velocity.Y = this.velocity.Y + this.posControlVectorThisTick.X * Math.cos(this.rotation) * this.XPositionalAccelerationPerSecond.X / ticksPerSecond;
		}
		else if (this.posControlVectorThisTick.X < 0)
		{
			news.normalConstructor(this.getScreenPosition(new Vector2(0, 120)), 30, Vector2.combineTwoVectors(this.velocity, this.getScreenDirection(new Vector2(0, 0.5 * this.velocity.getLength()))));

			this.velocity.X = this.velocity.X + -1 * this.posControlVectorThisTick.X * Math.sin(this.rotation) * this.XPositionalAccelerationPerSecond.Y / ticksPerSecond;
			this.velocity.Y = this.velocity.Y + this.posControlVectorThisTick.X * Math.cos(this.rotation) * this.XPositionalAccelerationPerSecond.Y / ticksPerSecond;
		}
		if (this.posControlVectorThisTick.Y > 0)
		{
			news.normalConstructor(this.getScreenPosition(new Vector2(-30, 0)), 30, Vector2.combineTwoVectors(this.velocity, this.getScreenDirection(new Vector2(-0.5 * this.velocity.getLength(), 0))));

			this.velocity.X = this.velocity.X + this.posControlVectorThisTick.Y * Math.cos(this.rotation) * this.YPositionalAccelerationPerSecond.X / ticksPerSecond;
			this.velocity.Y = this.velocity.Y + this.posControlVectorThisTick.Y * Math.sin(this.rotation) * this.YPositionalAccelerationPerSecond.X / ticksPerSecond;
		}
		else if (this.posControlVectorThisTick.Y < 0)
		{
			news.normalConstructor(this.getScreenPosition(new Vector2(30, 0)), 30, Vector2.combineTwoVectors(this.velocity, this.getScreenDirection(new Vector2(0.5 * this.velocity.getLength(), 0))));

			this.velocity.X = this.velocity.X + this.posControlVectorThisTick.Y * Math.cos(this.rotation) * this.YPositionalAccelerationPerSecond.Y / ticksPerSecond;
			this.velocity.Y = this.velocity.Y + this.posControlVectorThisTick.Y * Math.sin(this.rotation) * this.YPositionalAccelerationPerSecond.Y / ticksPerSecond;
		}

		if (this.rotControlVectorAccThisTick > 0)
		{
			news.normalConstructor(this.getScreenPosition(new Vector2(0, 100)), 30, Vector2.combineTwoVectors(this.velocity, this.getScreenDirection(new Vector2(-0.25 * this.velocity.getLength(), 0))));
		}
		else if (this.rotControlVectorAccThisTick < 0)
		{
			news.normalConstructor(this.getScreenPosition(new Vector2(0, -100)), 30, Vector2.combineTwoVectors(this.velocity, this.getScreenDirection(new Vector2(-0.25 * this.velocity.getLength(), 0))));
		}

		news.time = 0;
		news.bluecolor = true;
		//om thruster effekten faktiskt ska visas, tar mycket prestanda
		if(thrusterEffectEnabled)
		{
			GameManager.explosionEffectList.push(news);
		}
		
		this.rotationalVelocity = this.rotationalVelocity - this.rotControlVectorAccThisTick * (this.rotationalAccelerationPerSecond / ticksPerSecond);

		if (MathExtension.getPositiveNumber(this.rotationalVelocity) > this.maxRotationalVelocity)
		{
			this.rotationalVelocity = this.rotationalVelocity * 0.95;
			// rotationalVelocity = rotationalVelocity + rotControlVectorAccThisTick * (rotationalAccelerationPerSecond / ticksPerSecond);
		}

	}

	//Updatera skeppet
	update(ticksPerSecond)
	{
		if (this.noVelocity)
			this.velocity = Vector2.zeroVector();

		this.timeSinceLastBulletShot = this.timeSinceLastBulletShot + 1 / 100;
		//rotationshistoria används för att uppnå en försegad kamera rotation respons
		this.msTimesinceLastrotationupdate += 1000 / ticksPerSecond;
		if (this.msTimesinceLastrotationupdate > 10)
		{
			for (var i = this.rotationHistory.length - 2; i >= 0; i--)
			{
				this.rotationHistory[i + 1] = this.rotationHistory[i];
			}
		    this.rotationHistory[0] = this.rotation;
			this.msTimesinceLastrotationupdate = 0;
		}
		if (this.AIEnabled)
			this.AIupdate(ticksPerSecond);
		this.thrustUpdater(ticksPerSecond);
		this.rotationalAndPositionalupdate(ticksPerSecond);
		if (this.bulletsLeft == 0)
		{
			if (this.reloadTime > 0)
			{
				this.timeSpentReloading = this.timeSpentReloading + 0.01;
				if (this.timeSpentReloading > this.reloadTime)
				{
					this.timeSpentReloading = 0;
					this.bulletsLeft = 100;
				}
			}
		}


	}

	//updaterar ai
	AIupdate(ticksPerSecond)
	{
		this.fireGun();
		
		var waypoint = this.decideDestination();

		var rotationWanted = 0;

		var positionalDelta = this.getPositionDelta(waypoint);
		var rotationalDelta = (this.rotation - MathExtension.getTriangleRotation(positionalDelta)) - rotationWanted;

		//Håller rotationen mellan 180 och -180 grader
		var amountToRemove = 0;
		if (rotationalDelta > (Math.PI * 1))
		{
			amountToRemove = Math.floor((this.rotation % (Math.PI * 1)));
		}
		if (rotationalDelta < (Math.PI * -1))
		{
			amountToRemove = Math.floor((this.rotation % (Math.PI * 1)));
		}

		rotationalDelta = rotationalDelta - (amountToRemove * Math.PI * 2);
		
		//riktar skeppet mot waypoint(spelaren) sedan försöker upperättehålla distans prefershiporbit genom att kontrollera y thrustern
		this.posControlVectorThisTick.Y = Math.min(1, positionalDelta.getLength() / 800);
		if (positionalDelta.getLength() < preferShipOrbit)
		{
			this.posControlVectorThisTick.Y = -1 + positionalDelta.getLength() / 400;
		}
		this.rotControlVectorAccThisTick = rotationalDelta;
	}
	
	decideDestination()
	{
		//return new Vector2(3000, 3000);
		return GameManager.playerShip.position;
	}
	
	getPositionDelta(destinationPosition)
	{
		return new Vector2(destinationPosition.X - this.position.X, destinationPosition.Y - this.position.Y);
	}
	
	constructor(rotationalAccelerationPerSecond, XPositionalAccelerationPerSecond, YPositionalAccelerationPerSecond, HP, bulletSize, bulletVelocity, bulletFireRate, bulletsLeft, bulletSpawnDistance, reloadTime)
	{
		super();
		this.isShip = true;
		this.transparentTime = 2.5;
		this.totalTimeToPurge = 5;
		this.explosionSize = 2000;
		this.bulletSpawnDistance = 100;
		this.AIEnabled = true;
		this.maxVelocity = 30;
		this.maxRotationalVelocity = 0.2;
		this.posControlVectorThisTick = Vector2.zeroVector();
		this.rotControlVectorAccThisTick = 0;
		this.rotationHistory = new Array(100);
		this.msTimesinceLastrotationupdate = 0;

		this.bulletVelocity = bulletVelocity;
		this.bulletFireRate = bulletFireRate;
		this.bulletsLeft = bulletsLeft;
		this.rotationalAccelerationPerSecond = rotationalAccelerationPerSecond;
		this.XPositionalAccelerationPerSecond = XPositionalAccelerationPerSecond;
		this.YPositionalAccelerationPerSecond = YPositionalAccelerationPerSecond;
		this.HP = HP;
		this.bulletSize = bulletSize;
		this.color = darkGray;
		this.timeSinceLastBulletShot = 0;
		this.bulletSpawnDistance = bulletSpawnDistance;
		this.reloadTime = reloadTime;
		this.timeSpentReloading = 0;

		this.rotation = 0;
		this.rotationalVelocity = 0;
		this.msTimesinceLastrotationupdate = 0;
	}
}