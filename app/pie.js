/***
 * Class : Pie 
 * Author : Justin Fang
 * Date : 2013-10-08
 * Email : oglen.net@gmail.com
 ***/


var Pie = function(type){

	Plane.call(
		this,
		_.uniqueId(), // id
		58, // width
		88, // height
		0, // point
		[0, 16], // speed
		-1000, // x
		-1000, // y
		1, // health
		26 // radius
	);

	this.type = _.random(0, 1);
	this.pop = true;
	this.sp = [[267, 398, 58, 88], [102, 118, 60, 107]];
};

Pie.prototype = new Plane();

Pie.prototype.move = function(sky){

	(this.y > sky.height/5 && this.pop) && (this.speed[1] = -this.speed[1]) && (this.pop = false);
	this.y < -this.height && (this.speed[1]= -this.speed[1]);

	Plane.prototype.move.call(this, sky);
};

Pie.prototype.fly = function(){
	return this.sp[this.type];
};

Pie.prototype.className = function(){
	return 'Pie';
};