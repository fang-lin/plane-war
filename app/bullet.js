/***
 * Class : Bullet
 * Author : Justin Fang
 * Date : 2013-09-20
 * Email : oglen.net@gmail.com
 ***/

var Bullet = function(
	x,
	y,
	style
){
	this.id = _.uniqueId();
	this.width = 9;
	this.height = 21;
	this.power = 1;
	this.speed = [0, -30];
	this.x = x;
	this.y = y;
	this.radius = 10;
	this.style = style;
	this.sp = [[1004, 987, 9, 21], [69, 78, 9, 21]];
};

Bullet.prototype.setX = function(x){
	this.x = Math.ceil(x);
	return true;
};

Bullet.prototype.setY = function(y){
	this.y = Math.ceil(y);
	return true;
};

Bullet.prototype.setSpeed = function(x, y){
	this.speed[0] = x || this.speed[0];
	this.speed[1] = y || this.speed[1];
	return true;
};

Bullet.prototype.move = function(sky){
	var zm = 1;
	sky && (zm = sky.zoom);
	this.x += this.speed[0]*zm;
	this.y += this.speed[1]*zm;
};

Bullet.prototype.fly = function(){
	return this.style ? this.sp[0] : this.sp[1];
};

Bullet.prototype.className = function(){
	return 'Bullet';
};



