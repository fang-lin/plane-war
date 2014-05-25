/***
 * Class : Skeeter
 * Author : Justin Fang
 * Date : 2013-09-21
 * Email : oglen.net@gmail.com
 ***/

var Skeeter = function(){

	Plane.call(
		this,
		_.uniqueId(), // id
		57, // width
		43, // height
		1, // point
		[_.random(0, 2), _.random(4, 7)], // speed
		-1000, // x
		-1000, // y
		1, // health
		18 // radius
	);

	this.flySp = [534, 612, 57, 43];
	this.hitSp = [];
	this.explSp = [
		[267, 347, 57, 51],
		[873, 697, 57, 51],
		[267, 296, 57, 51],
		[930, 697, 57, 51]
	];

	this.hitCount = 0;
	this.explCount = 4;
	this.rock = _.random(30, 50);
};

Skeeter.prototype = new Plane();

Skeeter.prototype.move = function(sky){
	sky && (sky.count % this.rock || (this.speed[0] = - this.speed[0]) );
	Plane.prototype.move.call(this, sky);
};

Skeeter.prototype.explode = function(){
	(this.explCount == 4) && (this.y -= 4) && sound.get('enemy1_down').play();
	return Plane.prototype.explode.call(this);
};

Skeeter.prototype.className = function(){
	return 'Skeeter';
};