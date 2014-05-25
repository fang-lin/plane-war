$(function(){

	var setSkySize = function(){
		$('#sky').attr('height', $('body').height()).attr('width', Math.ceil($('body').height()));
	};
	setSkySize();

	var sky = new Sky($('#sky'));
	sky.init();

	$(window.event?window:'body').keydown(function(event){

		// console.log(event.keyCode);
		switch(event.keyCode){
			case 38: // up
				event.preventDefault();
				sky.running && sky.pilot.setY(sky, sky.pilot.y - sky.width*.075);
				break;

			case 40: // down
				event.preventDefault();
				sky.running && sky.pilot.setY(sky, sky.pilot.y + sky.width*.075);
				break;

			case 37: // left
				event.preventDefault();
				sky.running && sky.pilot.setX(sky, sky.pilot.x - sky.width*.075);
				break;

			case 39: // right
				event.preventDefault();
				sky.running && sky.pilot.setX(sky, sky.pilot.x + sky.width*.075);
				break;
			case 32: // pause
				event.preventDefault();
				sky.running ? sky.pause() : sky.play();
				break;
			default:
				break;
		}
	}).keyup(function(event){
		// $('#dir_wrap a').mouseout();
	});

	var resizeThrottle = _.throttle(function(){
		setSkySize();
		sky.resize($('#sky').width(), $('#sky').height());
		$('#score_wrap:visible').css('top', ($('body').height() - $('#score_wrap:visible').height())/2 + 'px');
		$('#player_wrap:visible').css('top', ($('body').height() - $('#player_wrap:visible').height())/2 + 'px');
		$('#top10_wrap:visible').css('top', ($('body').height() - $('#top10_wrap:visible').height())/2 + 'px');
	}, 50);
	$(window.event?window:'body').resize(resizeThrottle);

	var movePilot = function(event){
		sky.pilot.health &&
		sky.pilot.setX(sky, event.clientX - $('#sky').offset().left - sky.pilot.width*sky.zoom/2) &&
		sky.pilot.setY(sky, event.clientY - sky.pilot.height*sky.zoom/2);
	};

	$(window.event?window:'body').mousedown(function(event){
		sky.running && $(window.event?window:'body').on('mousemove', movePilot);
		$('body').addClass('moving');
	}).mouseup(function(event){
		$(window.event?window:'body').off('mousemove', movePilot);
		$('body').removeClass('moving');
	});

	$(window.event?window:'body').dblclick(function(event){
		sky.pilot && sky.pilot.useBomb(sky);
	});

	$('#restart').click(function(){
		$('#score_wrap').animate({
			'top' : - $('#score_wrap').height() + 'px'
		}, 500, 'easeOutElastic', function(){
			$('#score_wrap').removeAttr('style');
			sky.restart();
			sky.pilot.player;
		});
	});

	$('#back').click(function(event){
		$('#top10_wrap').animate({
			'top' : - $('#top10_wrap').height() + 'px'
		}, 500, 'easeOutElastic', function(){
			$('#top10_wrap').removeAttr('style');
			$('#score_wrap').show(0).css('top', '-' + $('#score_wrap').height() + 'px').animate({
				'top' : ($('body').height() - $('#top10_wrap').height())/2 + 'px'
			}, 500, 'easeOutElastic');
		});
	});
	$('#top10').click(function(event) {
		$('#top10_wrap').showTop10();
	});
});

(function($){
	$.fn.showScoreBoard = function(player, score){
		this.each(function(i, el){

			$.post('./query.php?action=set_score&sid=' + _.random(0x100000, 0x999999).toString(16), {
				player: player,
				score: score[0],
				statistics_0: score[1][0],
				statistics_1: score[1][1],
				statistics_2: score[1][2]
			}, function(data, textStatus, xhr) {

				(textStatus == 'success') && $('#ranking').html(data.ranking || '-');

				$('#player').html(player);
				$('#skeeters').html(score[1][0]);
				$('#flies').html(score[1][1]);
				$('#hornets').html(score[1][2]);
				$('#total_score').html(score[0]);

				$(el).show(0).css('top', '-' + $('#score_wrap').height() + 'px').animate({
					'top' : ($('body').height() - $(el).height())/2 + 'px'
				}, 500, 'easeOutElastic');

			});


		});
	};
	$.fn.showPlayerForm = function(fn){
		this.each(function(i, el){
			$(el).show(0).css('top', '-' + $('#player_wrap').height() + 'px').animate({
				'top' : ($('body').height() - $(el).height())/2 + 'px'
			}, 500, 'easeOutElastic', function(){

				$('#submit').click(function(event){
					var player = $.trim($('#player_input').val());
					if(player.length < 5){
						$('#player_notice').html(' (Too Short)');
						$('#player_input').focus();
						return true;
					}else if(player.length > 32){
						$('#player_notice').html(' (Too Long)');
						$('#player_input').focus();
						return true;
					}

					$(el).animate({
						'top' : - $(el).height() + 'px'
					}, 500, 'easeOutElastic', function(){
						$(el).removeAttr('style');
						$('#player_notice').html('');
						fn(player);
					});
				});

				$(window.event?window:'body').keydown(function(event){
					(event.keyCode == 13) && $('#submit').click();
				});
			});
		});
	};
	$.fn.showTop10 = function(){
		this.each(function(i, el){

			$.post('./query.php?action=get_top10&sid=' + _.random(0x100000, 0x999999).toString(16), {
			}, function(data, textStatus, xhr) {
				var tab = '';
				tab += '<tr><td id="tab_td_0">Ranking</td><td id="tab_td_1">Player</td><td id="tab_td_2">Score</td></tr>';
				for (var i in data.top10) {
					tab += '<tr><td>' + (i*1+1) + '</td><td>' + data.top10[i].player + '</td><td>' + data.top10[i].score + '</td></tr>';
				}
				$('#tab_top10').html(tab);
				$('#score_wrap').animate({
					'top' : - $('#score_wrap').height() + 'px'
				}, 500, 'easeOutElastic', function(){
					$('#score_wrap').removeAttr('style');
					$(el).show(0).css('top', '-' + $('#player_wrap').height() + 'px').animate({
						'top' : ($('body').height() - $(el).height())/2 + 'px'
					}, 500, 'easeOutElastic');
				});
			});
		});
	};
})(jQuery);