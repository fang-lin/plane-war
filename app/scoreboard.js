/***
 * Class : Plane war scoreboard
 * Author : Justin Fang
 * Date : 2013-10-08
 * Email : oglen.net@gmail.com
 ***/

var Scoreboard = function(){

	this.sp = [
		[370, 947, 26, 39],	// 0
		[463, 947, 5, 39],	// 1
		[341, 947, 28, 39],	// 2
		[221, 947, 26, 39],	// 3
		[191, 947, 29, 39],	// 4
		[428, 947, 34, 39],	// 5
		[397, 947, 30, 39],	// 6
		[469, 947, 32, 39],	// 7
		[278, 947, 32, 39],	// 8
		[311, 947, 29, 39],	// 9
		[248, 947, 28, 39]	// x
	];
};

Scoreboard.prototype.show = function(sky){

	if(sky.pilot){

		var score = sky.pilot.score.toString().split('');
		var x = 30*sky.zoom;
		for(i in score){

			sky.canvas.drawImage(sky.stageImg,
				this.sp[score[i]][0], this.sp[score[i]][1], this.sp[score[i]][2], this.sp[score[i]][3],
				x, 20*sky.zoom, this.sp[score[i]][2]*sky.zoom*.75, this.sp[score[i]][3]*sky.zoom*.75);
			x += this.sp[score[i]][2]*sky.zoom*.8;
		}
	}
};

Scoreboard.prototype.showBombCount = function(sky){

	if(sky.pilot){

		var score = sky.pilot.bombsCount.toString().split('');
		var x = 80*sky.zoom;
		sky.canvas.drawImage(sky.stageImg,
			this.sp[10][0], this.sp[10][1], this.sp[10][2], this.sp[10][3],
			x, sky.height-48*sky.zoom, this.sp[10][2]*sky.zoom*.75, this.sp[10][3]*sky.zoom*.75);
		x += this.sp[10][2]*sky.zoom*.8;
		for(i in score){

			sky.canvas.drawImage(sky.stageImg,
				this.sp[score[i]][0], this.sp[score[i]][1], this.sp[score[i]][2], this.sp[score[i]][3],
				x, sky.height-48*sky.zoom, this.sp[score[i]][2]*sky.zoom*.75, this.sp[score[i]][3]*sky.zoom*.75);
			x += this.sp[score[i]][2]*sky.zoom*.8;
		}
	}
};