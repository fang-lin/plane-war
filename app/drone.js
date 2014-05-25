/***
 * Class : Drone
 * Author : Justin Fang
 * Date : 2013-09-21
 * Email : oglen.net@gmail.com
 ***/

var Drone = function(){

	Plane.call(
		this,
		_.uniqueId(), // id
		102, // width
		126, // height
		1, // point
		[0, 0], // speed
		-1000, // x
		-1000, // y
		1, // health
		38 // radius
	);

	this.score = 0;
	this.statistics = [0, 0, 0];
	this.flySp = [
		[0, 99, 102, 126],
		[165, 360, 102, 126]
	];
	this.explSp = [
		[165, 234, 102, 126],
		[330, 624, 102, 126],
		[330, 498, 102, 126],
		[432, 624, 102, 126]
	];
	this.bombSp = [810, 691, 63, 57];

	this.explCount = 4;
	this.prop;
	this.propCount = 0;
	this.clearSky = 0;

	this.hide = false;
	this.immortal = false;
	this.weapon = 1;
	this.pieTime;
	this.bombsCount = 0;
};

Drone.prototype = new Plane();

Drone.prototype.eat = function(pie){
	if(pie.type){
		sound.get('get_bomb').play();
		this.bombsCount++;
	}else{
		sound.get('get_double_laser').play();
		this.weapon = _.random(2, 3);
		this.pieTime = 600;
	}
	return true;
};

Drone.prototype.useBomb = function(sky){
	this.bombsCount && this.bombsCount-- && sky.allExplode();
};

Drone.prototype.reset = function(){
	this.score = 0;
	this.statistics = [0, 0, 0];
	return true;
};

Drone.prototype.addScore = function(plane){
	this.score += plane.point;
	switch(plane.className()){
		case 'Skeeter':
			this.statistics[0]++;
			break;
		case 'Fly':
			this.statistics[1]++;
			break;
		case 'Hornet':
			this.statistics[2]++;
			break;
	}
	return true;
};

Drone.prototype.fly = function(){
	return this.flySp[_.random(0, 1)];
};

Drone.prototype.explode = function(callback){
	this.explCount > 0 ? (this.explCount -= .25) : callback();
	return this.explSp[this.explSp.length - Math.floor(this.explCount) - 1];
};

Drone.prototype.shoot = function(sky, amount){

	switch(amount){
		case 1:
			sound.get('bullet').play();
			var bullet = new Bullet(this.x, this.y, 1);
			bullet.setX(this.x + (this.width*sky.zoom - bullet.width*sky.zoom)/2);
			bullet.setY(this.y - bullet.height*(sky.zoom));
			sky.bullets.push(bullet);
			break;
		case 2:
			sound.get('bullet').play();
			var bullets = [new Bullet(this.x, this.y, 0), new Bullet(this.x, this.y, 0)];

			bullets[0].setX(this.x + (this.width*sky.zoom - bullets[0].width*sky.zoom)/2 + this.width*sky.zoom*.3);
			bullets[1].setX(this.x + (this.width*sky.zoom - bullets[1].width*sky.zoom)/2 - this.width*sky.zoom*.3);

			bullets[0].setY(this.y - bullets[0].height*(sky.zoom-1.6));
			bullets[1].setY(this.y - bullets[1].height*(sky.zoom-1.6));

			sky.bullets.push(bullets[0], bullets[1]);
			break;
		case 3:
			sound.get('bullet').play();
			var bullets = [new Bullet(this.x, this.y, 1), new Bullet(this.x, this.y, 0), new Bullet(this.x, this.y, 0)];

			bullets[0].setX(this.x + (this.width*sky.zoom - bullets[0].width*sky.zoom)/2);
			bullets[1].setX(this.x + (this.width*sky.zoom - bullets[1].width*sky.zoom)/2 - this.width*sky.zoom*.3);
			bullets[2].setX(this.x + (this.width*sky.zoom - bullets[2].width*sky.zoom)/2 + this.width*sky.zoom*.3);

			bullets[0].setY(this.y - bullets[0].height*(sky.zoom));
			bullets[1].setY(this.y - bullets[1].height*(sky.zoom-1.6));
			bullets[2].setY(this.y - bullets[2].height*(sky.zoom-1.6));

			bullets[1].setSpeed(-3, null);
			bullets[2].setSpeed(3, null);

			sky.bullets.push(bullets[0], bullets[1], bullets[2]);
			break;
		case 4:
			sound.get('bullet').play();
			var bullets = [new Bullet(this.x, this.y, 0), new Bullet(this.x, this.y, 0), new Bullet(this.x, this.y, 0), new Bullet(this.x, this.y, 0)];

			bullets[0].setX(this.x + (this.width*sky.zoom - bullets[0].width*sky.zoom)/2);
			bullets[1].setX(this.x + (this.width*sky.zoom - bullets[1].width*sky.zoom)/2);
			bullets[2].setX(this.x + (this.width*sky.zoom - bullets[2].width*sky.zoom)/2 - this.width*sky.zoom*.3);
			bullets[3].setX(this.x + (this.width*sky.zoom - bullets[3].width*sky.zoom)/2 + this.width*sky.zoom*.3);

			bullets[0].setY(this.y - bullets[0].height*(sky.zoom));
			bullets[1].setY(this.y - bullets[1].height*(sky.zoom));
			bullets[2].setY(this.y - bullets[2].height*(sky.zoom-1.6));
			bullets[3].setY(this.y - bullets[3].height*(sky.zoom-1.6));

			bullets[0].setSpeed(-2, null);
			bullets[1].setSpeed(2, null);
			bullets[2].setSpeed(-4, null);
			bullets[3].setSpeed(4, null);

			sky.bullets.push(bullets[0], bullets[1], bullets[2], bullets[3]);
			break;
		case 5:
			sound.get('bullet').play();
			var bullets = [new Bullet(this.x, this.y, 1), new Bullet(this.x, this.y, 0), new Bullet(this.x, this.y, 0), new Bullet(this.x, this.y, 0), new Bullet(this.x, this.y, 0)];

			bullets[0].setX(this.x + (this.width*sky.zoom - bullets[0].width*sky.zoom)/2);
			bullets[1].setX(this.x + (this.width*sky.zoom - bullets[1].width*sky.zoom)/2 - this.width*sky.zoom*.3);
			bullets[2].setX(this.x + (this.width*sky.zoom - bullets[2].width*sky.zoom)/2 + this.width*sky.zoom*.3);
			bullets[3].setX(this.x + (this.width*sky.zoom - bullets[3].width*sky.zoom)/2 - this.width*sky.zoom*.3);
			bullets[4].setX(this.x + (this.width*sky.zoom - bullets[4].width*sky.zoom)/2 + this.width*sky.zoom*.3);

			bullets[0].setY(this.y - bullets[0].height*(sky.zoom));
			bullets[1].setY(this.y - bullets[1].height*(sky.zoom-1.6));
			bullets[2].setY(this.y - bullets[2].height*(sky.zoom-1.6));
			bullets[3].setY(this.y - bullets[3].height*(sky.zoom-1.6));
			bullets[4].setY(this.y - bullets[4].height*(sky.zoom-1.6));

			bullets[1].setSpeed(-2, null);
			bullets[2].setSpeed(2, null);
			bullets[3].setSpeed(-6, null);
			bullets[4].setSpeed(6, null);

			sky.bullets.push(bullets[0], bullets[1], bullets[2], bullets[3], bullets[4]);
			break;
		case 6:
			sound.get('bullet').play();
			var bullets = [new Bullet(this.x, this.y, 1), new Bullet(this.x, this.y, 1), new Bullet(this.x, this.y, 0), new Bullet(this.x, this.y, 0), new Bullet(this.x, this.y, 0), new Bullet(this.x, this.y, 0)];

			bullets[0].setX(this.x + (this.width*sky.zoom - bullets[0].width*sky.zoom)/2);
			bullets[1].setX(this.x + (this.width*sky.zoom - bullets[0].width*sky.zoom)/2);
			bullets[2].setX(this.x + (this.width*sky.zoom - bullets[2].width*sky.zoom)/2 - this.width*sky.zoom*.3);
			bullets[3].setX(this.x + (this.width*sky.zoom - bullets[3].width*sky.zoom)/2 + this.width*sky.zoom*.3);
			bullets[4].setX(this.x + (this.width*sky.zoom - bullets[4].width*sky.zoom)/2 - this.width*sky.zoom*.3);
			bullets[5].setX(this.x + (this.width*sky.zoom - bullets[5].width*sky.zoom)/2 + this.width*sky.zoom*.3);

			bullets[0].setY(this.y - bullets[0].height*(sky.zoom));
			bullets[1].setY(this.y - bullets[0].height*(sky.zoom));
			bullets[2].setY(this.y - bullets[2].height*(sky.zoom-1.6));
			bullets[3].setY(this.y - bullets[3].height*(sky.zoom-1.6));
			bullets[4].setY(this.y - bullets[4].height*(sky.zoom-1.6));
			bullets[5].setY(this.y - bullets[5].height*(sky.zoom-1.6));
			
			bullets[0].setSpeed(-2, null);
			bullets[1].setSpeed(2, null);
			bullets[2].setSpeed(-6, null);
			bullets[3].setSpeed(6, null);
			bullets[4].setSpeed(-16, null);
			bullets[5].setSpeed(16, null);

			sky.bullets.push(bullets[0], bullets[1], bullets[2], bullets[3], bullets[4], bullets[5]);
			break;
		default:
			break;
	}
};

Drone.prototype.setX = function(sky, x){
	return (x > sky.width - this.width*sky.zoom/2) && Plane.prototype.setX.call(this, sky.width - this.width*sky.zoom/2) ||
	(x < -this.width*sky.zoom/2) && Plane.prototype.setX.call(this, -this.width*sky.zoom/2) ||
	Plane.prototype.setX.call(this, x);
};

Drone.prototype.setY = function(sky, y){
	return (y > sky.height - this.height*sky.zoom/2) && Plane.prototype.setY.call(this, sky.height - this.height*sky.zoom/2) ||
	(y < -this.height*sky.zoom/2) && Plane.prototype.setY.call(this, -this.height*sky.zoom/2) ||
	Plane.prototype.setY.call(this, y);
};

Drone.prototype.className = function(){
	return 'Drone';
};
