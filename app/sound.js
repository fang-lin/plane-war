/***
 * Class : Plane war sound
 * Author : Justin Fang
 * Date : 2013-09-30
 * Email : oglen.net@gmail.com
 ***/

var Sound = function(){

	this.dir = 'sound/';
	this.type = 'ogg';
	this.files = ['achievement', 'big_spaceship_flying', 'bullet', 'button', 'enemy1_down', 'enemy2_down', 'enemy3_down', 'game_music', 'game_over', 'get_bomb', 'get_double_laser', 'out_porp', 'use_bomb'];
	this.audios = [];
};

Sound.prototype.load = function(fn){
	var count = 0,
		self = this;
	var loadAudio = function(audio){
		count++;
		(count == self.files.length) && fn();
	};
	for(i in this.files){
		this.audios.push(new Audio());
		this.audios[i].src = this.dir + this.files[i] + '.' + this.type;
		this.audios[i].onloadedmetadata = loadAudio(this.audios[i]);
	}
};

Sound.prototype.get = function(filename){
	var file = filename || 'game_music';
	return this.audios[_.indexOf(this.files, filename)];
};

var sound = new Sound();