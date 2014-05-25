/***
 * Class : Plane
 * Author : Justin Fang
 * Date : 2013-09-20
 * Email : oglen.net@gmail.com
 ***/

var Plane = function(
	id,
	width,
	height,
	point,
	speed,
	x,
	y,
	health,
	radius
){

	this.id = id;
	this.width = width;
	this.height = height;
	this.point = point;
	this.speed = speed;
	this.x = x;
	this.y = y;
	this.health = health;
	this.beScored = false;
	this.radius = radius;
	this.flySp = [];
	this.hitSp = [];
	this.explSp = [];

	this.flyCount;
	this.hitCount;
	this.explCount;
};

Plane.prototype.move = function(sky){
	var zm = 1;
	sky && (zm = sky.zoom);
	this.x += this.speed[0]*zm;
	this.y += this.speed[1]*zm;
};

Plane.prototype.beHit = function(bullet){
	this.hitCount = 1;
	this.health -= bullet.power;
	(this.health < 0) && (this.health = 0);
	return true;
}

Plane.prototype.enter = function(sky){
	this.x = _.random(0, sky.width - this.width*sky.zoom);
	this.y = - this.height*sky.zoom;
	return true;
};

Plane.prototype.setSpeed = function(x, y){
	this.speed[0] = x || this.speed[0];
	this.speed[1] = y || this.speed[1];
	return true;
};
Plane.prototype.setX = function(x){
	this.x = Math.ceil(x) || this.x;
	return true;
};

Plane.prototype.setY = function(y){
	this.y = Math.ceil(y) || this.y;
	return true;
};

Plane.prototype.setHealth = function(health){
	this.health = health;
	return true;
}

Plane.prototype.fly = function(){
	return this.flySp;
};

Plane.prototype.hitting = function(){
	return this.hitSp;
};

Plane.prototype.explode = function(){
	this.explCount > 0 && (this.explCount -= .25);
	return this.explSp[this.explSp.length - Math.floor(this.explCount) - 1];
};

Plane.prototype.className = function(){
	return 'Plane';
};



