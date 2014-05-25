/***
 * Class : Sky
 * Author : Justin Fang
 * Date : 2013-09-20
 * Email : oglen.net@gmail.com
 ***/

var Sky = function(canvas){

	this.canvas = canvas[0].getContext('2d');
	this.planes = [];
	this.pie = null;
	this.defer = 80;
	this.bullets = [];
	this.pilot;
	this.score;
	this.scoreboard = new Scoreboard();
	this.grow = 1.0005;
	this.running;
	this.width = canvas.width();
	this.height = canvas.height();
	this.duration = 25;
	this.count = 0;

	this.imgs = [new Image(), new Image()];
	this.imgs[0].src = 'images/shoot.png';
	this.imgs[1].src = 'images/shoot_background.png';

	this.actorImg = this.imgs[0];
	this.stageImg = this.imgs[1];

	this.bgSp = [0, 0, 852, 852];
	this.bgSpeed = 1;
	this.logoSp = [191, 856, 428, 84];
	this.bgVernier = 0;

	this.zoom = this.height/this.bgSp[3];
	this.timeStamp;
	this.music;
	this.player;
};

Sky.prototype.resize = function(width, height){
	this.width = width;
	this.height = height;
	this.zoom = this.height/this.bgSp[3];

	this.pilot && this.pilot.setX(this, this.pilot.x) && this.pilot.setY(this, this.pilot.y);
};

Sky.prototype.makePlanes = function(){

	this.pilot && (this.score = [this.pilot.score, this.pilot.statistics]);

	if(this.count % Math.ceil(Math.pow(this.grow, Math.log(20)/Math.log(this.grow) - this.score[0]) + 1) == 0){
		var plane = new Skeeter();
		plane.speed[1] += Math.floor(Math.floor(this.score[0]/600));
		this.enterPlane(plane);
	}
	if(this.count % Math.ceil(Math.pow(this.grow, Math.log(80)/Math.log(this.grow) - this.score[0]) + 1) == 0){
		var plane = new Fly();
		plane.speed[1] += Math.floor(Math.floor(this.score[0]/600));
		this.enterPlane(plane);
	}
	if(this.count % Math.ceil(Math.pow(this.grow, Math.log(600)/Math.log(this.grow) - this.score[0]) + 1) == 0){
		var plane = new Hornet();
		plane.speed[1] += Math.floor(Math.floor(this.score[0]/600));
		this.enterPlane(plane);
	}
	return true;
}

Sky.prototype.enterPlane = function(plane){
	plane.enter(this);
	this.planes.push(plane);
	return true;
};

Sky.prototype.makePie = function(){
	this.pilot && (this.count % 1200 || (this.pie = new Pie()) && this.pie.enter(this) && sound.get('out_porp').play());
	return true;
}

Sky.prototype.exitPlanesAndBullets = function(){
	for(i in this.planes){
		(this.planes[i].y > this.height || this.planes[i].explCount == 0) &&
		this.planes.splice(i, 1);
	}
	for(i in this.bullets){
		(this.bullets[i].y > this.height) && this.bullets.splice(i, 1);
	}
};

Sky.prototype.refresh = function(){

	this.count++;
	
	this.exitPlanesAndBullets();
	this.collision();
	this.movePlanesAndBulletsAndPie();
	this.moveBg();
	
	(this.count == 40) && this.pilot.reset();
	(this.count > 40) &&
	(this.count % 6 || this.pilot && this.pilot.shoot(this, this.pilot.weapon)) &&
	(this.pilot.immortal = false);
	this.pilot && (this.pilot.pieTime ? --this.pilot.pieTime : this.pilot.weapon = 1);


	(this.count > 60) && this.makePlanes() && this.makePie();

	this.render();

	if(! (this.count%4)){
		console.log();
		var now = new Date();
		$('#fps').html(Math.round(4000/(now.getTime() - this.timeStamp)));
		this.timeStamp = now.getTime();
	}
};

Sky.prototype.movePlanesAndBulletsAndPie = function(){
	for(i in this.planes){
		this.planes[i].move(this);
	}
	for(i in this.bullets){
		this.bullets[i].move(this);
	}
	this.pie && this.pie.move(this);
};

Sky.prototype.moveBg = function(speed){
	this.bgVernier += this.bgSpeed;
	(this.bgVernier > this.bgSp[3]) && (this.bgVernier = this.bgVernier - this.bgSp[3]);
};

Sky.prototype.render = function(){

	// render background
	this.drawSky(this.bgVernier);

	for(i in this.planes){ // render planes
		var xy;
		this.planes[i].health ? xy = (this.planes[i].hitCount ? this.planes[i].hitting() : this.planes[i].fly()) : xy = this.planes[i].explode();
		this.planes[i].hitCount = 0;
		this.drawPlane(this.planes[i], xy);
	}

	for(i in this.bullets){ // render bullets
		var xy = this.bullets[i].fly();
		this.drawPlane(this.bullets[i], xy);
	}

	if(this.pilot){ // render pilot
		var xy, self = this;
		this.pilot.health ? xy = this.pilot.fly() : xy = this.pilot.explode(function(){
			// game over
			self.music.pause();
			self.music = null;
			sound.get('game_over').play();
			$('#score_wrap').showScoreBoard(self.player, self.score);
			self.pilot = false;
		});
		this.pilot.hide || this.drawPlane(this.pilot, xy);
	}
	
	if(this.pie){ // render pie
		var xy = this.pie.fly();
		this.drawPlane(this.pie, xy);
	}
	// render scoreboard
	this.count > 40 && this.scoreboard.show(this);
	// render bombs
	this.pilot && this.canvas.drawImage(this.actorImg,
		this.pilot.bombSp[0], this.pilot.bombSp[1], this.pilot.bombSp[2], this.pilot.bombSp[3],
		10*this.zoom, this.height-this.pilot.bombSp[2]*this.zoom, this.pilot.bombSp[2]*this.zoom, this.pilot.bombSp[3]*this.zoom);
	this.scoreboard.showBombCount(this);
};

Sky.prototype.drawPlane = function(plane, xy){
	this.canvas.drawImage(this.actorImg,
			xy[0], xy[1], xy[2], xy[3],
			plane.x, plane.y, xy[2]*this.zoom, xy[3]*this.zoom);
	return true;
}

Sky.prototype.drawSky = function(bgVernier){
	try{
		this.canvas.drawImage(this.stageImg,
		this.bgSp[0], this.bgSp[1], this.bgSp[2], this.bgSp[3] - bgVernier,
		0, bgVernier*this.zoom, this.width, Math.abs(this.height - bgVernier*this.zoom));
		this.canvas.drawImage(this.stageImg,
			this.bgSp[0], this.bgSp[1] + this.bgSp[3] - bgVernier, this.bgSp[2], bgVernier,
			0, 0, this.width, Math.abs(bgVernier*this.zoom));
	}catch(e){};
}

Sky.prototype.drawSky = function(bgVernier){
	try{
		this.canvas.drawImage(this.stageImg,
		this.bgSp[0], this.bgSp[1], this.bgSp[2], this.bgSp[3] - bgVernier,
		0, bgVernier*this.zoom, this.width, Math.abs(this.height - bgVernier*this.zoom));
		this.canvas.drawImage(this.stageImg,
			this.bgSp[0], this.bgSp[1] + this.bgSp[3] - bgVernier, this.bgSp[2], bgVernier,
			0, 0, this.width, Math.abs(bgVernier*this.zoom));
	}catch(e){};
}

Sky.prototype.drawLogo = function(){
	this.canvas.drawImage(this.stageImg,
		this.logoSp[0], this.logoSp[1], this.logoSp[2], this.logoSp[3],
		(this.width-this.logoSp[2]*this.zoom)/2, 180*this.zoom, this.logoSp[2]*this.zoom, this.logoSp[3]*this.zoom);
}


Sky.prototype.collision = function(){

	for(i in this.planes){
		// check pilot and planes
		this.pilot.health && !this.pilot.immortal &&
		this.isCoincide(this.pilot, this.planes[i]) &&
		this.pilot.setHealth(0) && this.planes[i].setHealth(0);

		//check pilot and pie
		this.pilot.health && this.pie &&
		this.isCoincide(this.pilot, this.pie) &&
		this.pilot.eat(this.pie) && (this.pie = null);

		// check planes and bullets
		for(n in this.bullets){
			this.isCoincide(this.planes[i], this.bullets[n]) &&
			this.planes[i].beHit(this.bullets[n]) && this.bullets.splice(n, 1);
		};

		// add score to pilot
		this.planes[i].health || this.planes[i].beScored || this.pilot && this.pilot.addScore(this.planes[i]) && (this.planes[i].beScored = true);
	}
};

Sky.prototype.isCoincide = function(planeA, planeB){

	return Math.pow(Math.pow((planeA.x + planeA.width*this.zoom/2) - (planeB.x + planeB.width*this.zoom/2), 2) + Math.pow((planeA.y + planeA.height*this.zoom/2) - (planeB.y + planeB.height*this.zoom/2), 2), 0.5) < planeA.radius*this.zoom + planeB.radius*this.zoom;
}

Sky.prototype.init = function(){
	var self = this;
	this.loading(function(){
		$('#loading').fadeOut();
		self.drawSky(0);
		self.drawLogo();
		$('#player_wrap').showPlayerForm(function(player){
			self.restart();
			self.player = player;
			self.play();
		});
	});
};

Sky.prototype.restart = function(){
	this.music = sound.get('game_music');
	this.music.loop = true;
	this.music.play();
	this.allExplode();
	this.count = 0;
	this.enterPilot();
	this.pilot.immortal = true;
};

Sky.prototype.enterPilot = function(){
	this.pilot = new Drone();
	this.pilot.weapon = 1;

	this.pilot.setX(this, (this.width - this.pilot.width*this.zoom)/2);
	this.pilot.setY(this, this.height - this.pilot.height*this.zoom);
};

Sky.prototype.play = function(){
	this.music.play();
	var self = this;
	this.pilot && this.pilot.health && (this.running = window.setInterval(function(){
		self.refresh();
	}, this.duration));
};

Sky.prototype.pause = function(){
	if(this.pilot){
		this.music.pause();
		(this.running = window.clearInterval(this.running));
	}
};

Sky.prototype.loading = function(fn){

	var complete = 0;
	for(i in this.imgs){
		$(this.imgs[i]).load(function(event){
			complete++;
			(complete == 3) && fn();
		});
	}
	sound.load(function(count, total){
		(count == total) && complete++;
		(complete == 3) && fn();
	});
};

Sky.prototype.allExplode = function(fn){
	for(i in this.planes){
		this.planes[i].setHealth(0);
	}
};


