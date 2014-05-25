/***
 * Class : Fly
 * Author : Justin Fang
 * Date : 2013-09-21
 * Email : oglen.net@gmail.com
 ***/

var Fly = function(){
	Plane.call(
		this,
		_.uniqueId(), // id
		69, // width
		99, // height
		8, // point
		[_.random(0, 2), _.random(3, 5)], // speed
		-1000, // x
		-1000, // y
		4, // health
		32 // radius
	);

	this.flySp = [0, 0, 69, 99];
	this.hitSp = [432, 525, 69, 99];
	this.explSp = [
		[534, 655, 69, 95],
		[603, 655, 69, 95],
		[672, 653, 69, 95],
		[741, 653, 69, 95]
	];

	this.flyCount = 0;
	this.explCount = 4;
	this.rock = _.random(50, 80);
};

Fly.prototype = new Plane();

Fly.prototype.move = function(sky){
	sky && (sky.count % this.rock || (this.speed[0] = - this.speed[0]) );
	Plane.prototype.move.call(this, sky);
};

Fly.prototype.explode = function(){
	(this.explCount == 4) && (this.y += 2) && sound.get('enemy2_down').play();;
	return Plane.prototype.explode.call(this);
};

Fly.prototype.className = function(){
	return 'Fly';
};