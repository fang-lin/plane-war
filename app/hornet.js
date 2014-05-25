/***
 * Class : Hornet
 * Author : Justin Fang
 * Date : 2013-09-21
 * Email : oglen.net@gmail.com
 ***/

var Hornet = function(){
	Plane.call(
		this,
		_.uniqueId(), // id
		169, // width
		258, // height
		36, // point
		[0, _.random(2, 3)], // speed
		-1000, // x
		-1000, // y
		14, // health
		81 // radius
	);

	this.flySp = [
		[335, 750, 169, 258],
		[504, 750, 169, 258]
	];
	this.hitSp = [166, 750, 169, 258];
	this.explSp = [
		[0, 486, 165, 261],
		[0, 225, 165, 261],
		[839, 748, 165, 260],
		[165, 486, 165, 261],
		[673, 748, 166, 260],
		[0, 747, 166, 261]
	];

	this.explCount = 6;
};

Hornet.prototype = new Plane();

Hornet.prototype.fly = function(){
	return this.flySp[_.random(0, 1)];
};

Hornet.prototype.explode = function(){
	(this.explCount == 6) && sound.get('enemy3_down').play();
	return Plane.prototype.explode.call(this);
};

Hornet.prototype.className = function(){
	return 'Hornet';
};