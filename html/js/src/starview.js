var ready_db_flag = 0;
var ready_scroll_flag = 0;
var ready_stars_flag = 0;
var ready_place_info_flag = 0;
var compass_flag = 1;
var SHAKE_G = 10;
var dialog;
var dialog_open_flag;
var canvas
var place_info = {
  "latitude":35.658,
  "longitude":139.741,
  "altitude":0
};
var screen_azimuth = 0; //方位
var screen_elevation = 0; //高角度
var SCREEN_HORIZONTAL_VIEW_ANGLE = 90;
//var SCREEN_VERTICAL_VIEW_ANGLE = 20;
var SCREEN_VERTICAL_VIEW_ANGLE = 80;	//PCでのデバッグ用に高さを90に設定しています。20だと星がひとつも表示されない＞＜
var STAR_NUM = 50;
var low_pass_filter = 0.5;
var low_pass_azumith = [0, 0, 0];
var NEWS = {
    "N_LABEL" : "N",
    "S_LABEL" : "S",
    "E_LABEL" : "E",
    "W_LABEL" : "W",
    "N_AZIMUTH" : 0,
    "S_AZIMUTH" : 180,
    "E_AZIMUTH" : 90,
    "W_AZIMUTH" : 270,
};

(function(window) {
    function checkready(){
        if(ready_scroll_flag === 1
        	&& ready_place_info_flag === 1
        	&& ready_stars_flag === 1){
            canvas = $("#stageCanvas")[0];
            canvas.height = $(document).height();
            canvas.width = $(document).width();
			var m = main().init(canvas);
        }
    }
    
    function get_stars(){
    	$.ajax({
        	type: 'get',
        	dataType: 'json',
        	url: '/index.php/checkin/starlist',
        	success: function(data){
        		window.STARS_DATA = data;
        		ready_stars_flag = 1;
        		checkready();
			}
       });
    }
    
    function get_place_info(){
    	if (navigator.geolocation) {
    		 navigator.geolocation.getCurrentPosition(
    		 	function(pos){
    		 		place_info.latitude = pos.coords.latitude;
    		 		place_info.longitude = pos.coords.longitude;
    		 		ready_place_info_flag = 1;
    				checkready();
    		 	},
    		 	function(err){
    		 		ready_place_info_flag = 1;
    				checkready();
    		 	}
    		 );
    	}else{
    		ready_place_info_flag = 1;
    		checkready();
    	}
    }

    $(function() {
        // 初期化処理...
        // HTMLロード後に実行
        if(supports_canvas()) {
            canvas = $("#stageCanvas")[0];
            //アドレスバーを消すためにcanvasの高さを調整しておき100ms後に1ピクセルスクロール
            canvas.height = $(document).height()+70;
            setTimeout(start, 200);
            get_stars();
            get_place_info();
        } else {
            var wrapper = $("#main")[0];
            wrapper.innerHTML = "Your browser does not appear to support " + "the HTML5 Canvas element";
        }
        dialog = new Dialog($('#dialog'), $('#checkedin'));
    });
    function start(){
        if( (navigator.userAgent.match(/iPhone/i)) || 
			(navigator.userAgent.match(/iPod/i)) || 
			(navigator.userAgent.match(/iPad/i)) ) {
			scrollTo(0,2);
		}else if (navigator.userAgent.match(/Android/i)) {
			window.scrollTo(0,2);
		}
        ready_scroll_flag = 1;
        checkready();
    }
    function supports_canvas() {
        return !!document.createElement("canvas").getContext;
    }

    var main = function(spec, my) {
        var stage;
        var starfield;
        var star = [];
        var sky;
        var display = {};
        var date = new Date();

        //　観測者は東京に居るとする（あとで取得する）
        var observer = place_info;

        var my = my || {};
        var that = {};
        ////ローカル変数
        that.init = function(canvas,stat) {

            //KASHIWAI API
            //var bsc = BSC.BSC;
            bsc = window.STARS_DATA;
            
            STAR_NUM = bsc.length;

            var time = new Orb.Time(date);
            for(var i = 0; i < STAR_NUM; i++){
                var target = {　
                  "ra": bsc[i].rah,
                  "dec": bsc[i].ded
                };
                var observe = new Orb.Observation(observer,target);
                var look = observe.horizontal(time);
                star.push({"data" : look});
            }

            // create a new stage and point it at our canvas:
            canvas = $("#stageCanvas")[0];
            stage = new Stage(canvas);
            //stage.enableMouseOver(10);
            //Touch.enable(stage);

            // draw the sky:
            sky = new Shape();
            sky.graphics.beginLinearGradientFill(["#204","#003","#000"], [0,0.15,0.6], 0, canvas.height, 0, 0);
            sky.graphics.drawRect(0, 0, window.innerWidth, window.innerHeight);
            stage.addChild(sky);

            // create a Shape instance to draw the vectors star in, and add it to the stage:
            starfield = new Shape();
            stage.addChild(starfield);

            starfield.cache(0,0,window.innerWidth,window.innerHeight);

            for(var i = 0; i < STAR_NUM; i++){
                var pos_x;
                if ( star[i].data.azimuth >= screen_azimuth - SCREEN_HORIZONTAL_VIEW_ANGLE + 360){
                    pos_x = star[i].data.azimuth - 360 - screen_azimuth;
                } else if (star[i].data.azimuth <= screen_azimuth + SCREEN_HORIZONTAL_VIEW_ANGLE -360){
                    pos_x = star[i].data.azimuth + 360 - screen_azimuth;
                } else {
                    pos_x = star[i].data.azimuth - screen_azimuth;
                }
                pos_x = calc_screen_x(pos_x);
                var pos_y = calc_screen_y( star[i].data.elevation - screen_elevation );
                var size = ((5-bsc[i].vmag )*1.9)+1;

                var star_text = new Text(bsc[i].name ? bsc[i].name : bsc[i].bfid, "14px Arial", "#EEE");
                var dialog_data = {
                    id: bsc[i].starid,
                    name: star_text.text,
                    vmag: bsc[i].vmag,
                    count: bsc[i].count
                }

                star_text.data = dialog_data;
                star[i]["name"] = star_text;
                //Touch.enable(star[i].name);
                star[i].name.textBaseline = "top";
                star[i].name.onClick = function(evt) {
                    dialog.open(this.data.id, this.data.name, this.data.vmag, this.data.count);
                }
                stage.addChild(star[i].name);

                //Shape
                star[i]["shape"] = new Shape();
                star[i].shape.data = dialog_data;
                star[i].shape.graphics.beginFill("#FFF").drawCircle(0, 0, size);
                star[i].shape.x = pos_x;
                star[i].shape.y = pos_y;
                star[i].shape.onClick = function(evt) {
                    dialog.open(this.data.id, this.data.name, this.data.vmag, this.data.count);
                }

                stage.addChild(star[i].shape);

                star[i].shape.x = pos_x;
                star[i].shape.y = pos_y;
                star[i].name.x = pos_x + 10;
                star[i].name.y = pos_y - 10;
            }
            //console.log(star);

            //display azimuth and elevation
            var hours = date.getHours();
            if(hours.length < 10){
            	hours = '0' + hours;
            }
            var minutes = date.getMinutes();
            if(minutes.length < 10){
            	minutes = '0' + minutes;
            }
            display = {
                "azimuth" : new Text("azimuth", "12px Arial", "#AAA"),
                "elevation" : new Text("elevation", "12px Arial", "#AAA"),
                "time" : new Text("time = " + hours + " : " + minutes, "12px Arial", "#AAA"),
                "north" : new Text("N", "20px Arial", "#F00"),
                "south" : new Text("S", "20px Arial", "#00F"),
                "east" : new Text("E", "20px Arial", "#FFF"),
                "west" : new Text("W", "20px Arial", "#FFF")
            };
            display.azimuth.x = 20;
            display.azimuth.y = canvas.height - 20;

            display.elevation.x = 170;
            display.elevation.y = canvas.height -20;

            display.time.x = 320;
            display.time.y = canvas.height -20;

            display.north.x = calc_screen_x(NEWS.N_AZIMUTH - screen_azimuth);
            display.south.x = calc_screen_x(NEWS.S_AZIMUTH - screen_azimuth);
            display.east.x = calc_screen_x(NEWS.E_AZIMUTH - screen_azimuth);
            display.west.x = calc_screen_x(NEWS.W_AZIMUTH - screen_azimuth);

            display.north.y = canvas.height - 40;
            display.south.y = canvas.height - 40;
            display.east.y = canvas.height - 40;
            display.west.y = canvas.height - 40;

            stage.addChild(display.azimuth);
            stage.addChild(display.elevation);
            stage.addChild(display.time);
            stage.addChild(display.north);
            stage.addChild(display.south);
            stage.addChild(display.east);
            stage.addChild(display.west);

            Ticker.addListener(that);
            Ticker.setFPS(30);
        }

        that.stop = function(){
            Ticker.removeListener(that);
        }

        that.tick = function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            sky.graphics.drawRect(0, 0, canvas.width, canvas.height);
            //starfield.cache(0,0,canvas.width,canvas.height);
            // draw a vector star at a random location:
            starfield.graphics.beginFill(Graphics.getRGB(0xFFFFFF,Math.random())).drawPolyStar(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*4+1, 5, 0.93, Math.random()*360);

            // draw the new vector onto the existing cache, compositing it with the "source-overlay" composite operation:
            starfield.updateCache("source-overlay");

            // because the vector star has already been drawn to the cache, we can clear it right away:
            starfield.graphics.clear();

            // darken the sky:
            sky.alpha -= 0.0005;

            // move the moon across the sky:
            for(var i=0;i<STAR_NUM;i++){
                //if(1){continue;}
                var pos_x;
                if ( star[i].data.azimuth >= screen_azimuth - SCREEN_HORIZONTAL_VIEW_ANGLE + 360){
                    pos_x = star[i].data.azimuth - 360 - screen_azimuth;
                } else if (star[i].data.azimuth <= screen_azimuth + SCREEN_HORIZONTAL_VIEW_ANGLE -360){
                    pos_x = star[i].data.azimuth + 360 - screen_azimuth;
                } else {
                    pos_x = star[i].data.azimuth - screen_azimuth;
                }
                pos_x = calc_screen_x(pos_x);
                var pos_y = star[i].data.elevation - screen_elevation;
                pos_y = calc_screen_y(pos_y);
                star[i].shape.x = pos_x;
                star[i].shape.y = pos_y;
                star[i].name.x = pos_x + 10;
                star[i].name.y = pos_y - 10;
            }
            //NEWS
            if ( NEWS.N_AZIMUTH >= screen_azimuth - SCREEN_HORIZONTAL_VIEW_ANGLE + 360){
                display.north.x = calc_screen_x(NEWS.N_AZIMUTH - 360 - screen_azimuth);
            } else if (NEWS.N_AZIMUTH <= screen_azimuth + SCREEN_HORIZONTAL_VIEW_ANGLE -360){
                display.north.x = calc_screen_x(NEWS.N_AZIMUTH + 360 - screen_azimuth);
            } else {
                display.north.x = calc_screen_x(NEWS.N_AZIMUTH - screen_azimuth);
            }
            display.south.x = calc_screen_x(NEWS.S_AZIMUTH - screen_azimuth);
            display.east.x = calc_screen_x(NEWS.E_AZIMUTH - screen_azimuth);
            display.west.x = calc_screen_x(NEWS.W_AZIMUTH - screen_azimuth);

            display.north.y = canvas.height - 40;
            display.south.y = canvas.height - 40;
            display.east.y = canvas.height - 40;
            display.west.y = canvas.height - 40;

            display.azimuth.text =  "azimuth = " + Math.round(screen_azimuth);
            display.elevation.text = "elevation = " + Math.round(screen_elevation);
            display.azimuth.y = canvas.height - 20;
            display.elevation.y = canvas.height - 20;
            var date = new Date();
            var hours = date.getHours();
            if(hours.length < 10){
            	hours = '0' + hours;
            }
            var minutes = date.getMinutes();
            if(minutes.length < 10){
            	minutes = '0' + minutes;
            }
            display.time.text = "time = " + hours + " : " + minutes;
            display.time.y = canvas.height - 20;

            //display_azimuth.x = pos_x;
            //display_elevation.x = pos_x + 200;

            // draw the updates to stage:
            if (!dialog_open_flag) { 
                stage.update();
            }
        }
        return that;
    }

    function calc_screen_x(target_azimuth){
        return  ( (canvas.width / 2) * target_azimuth / SCREEN_HORIZONTAL_VIEW_ANGLE + canvas.width / 2);
    }

    function calc_screen_y(target_elevation){
        return  canvas.height - ( (canvas.height / 2) * target_elevation / SCREEN_VERTICAL_VIEW_ANGLE + canvas.height / 2);
    }

})(window);

window.ondeviceorientation = function(event) {
    if(compass_flag){
        var w = event.webkitCompassHeading - 270;
        w = w < 0 ? 360 + w : w ;
        //var a = 360 - (event.alpha*1/1);
        //var b =(event.beta*1/1);
        var g = (-(event.gamma*1/1) - 90 );
        //g = g * low_pass_filter + screen_elevation * (1.0 - low_pass_filter);
        g = (g < -180) ? (g >= -270 ? g + 360 : g ) : g ;
        g = (g > 90) ? 90 : ( g < -90 ? -90 : g );
        screen_azimuth = w ? w : 0;
        screen_elevation = g;
    }
}

window.addEventListener('devicemotion', function(e) {
    if( !compass_flag ) {
        var acc = e.accelerationIncludingGravity;
        curX = acc.x;
        curY = acc.y;
        curZ = acc.z;
        if( (curX > SHAKE_G || curX < -SHAKE_G || curY > SHAKE_G || curY < -SHAKE_G || curZ > SHAKE_G || curZ < -SHAKE_G)) {
            compass_flag = 1;
        }
    }
}, false);

//var is_touch = ('ontouchstart' in window);
//var touch_flag = 0;
//var touchX;
//var touchY;
//var moveX;
//var moveY;
//var offsetX;
//var offsetY;
//$(window).bind({
//    'touchstart mousedown': function(e) {
//        compass_flag = 0;
//        touch_flag = 1;
//        offsetX = screen_azimuth;
//        offsetY = screen_elevation;
//        e.preventDefault();
//        touchX = (is_touch ? event.changedTouches[0].clientX : e.clientX);
//        touchY = (is_touch ? event.changedTouches[0].clientY : e.clientY);
//    },
//    'touchmove mousemove': function(e) {
//        if (touch_flag && !dialog_open_flag){
//            moveX = (is_touch ? event.changedTouches[0].clientX : e.clientX);
//            moveY = (is_touch ? event.changedTouches[0].clientY : e.clientY);
//
//            e.preventDefault();
//            screen_azimuth = (-2 * SCREEN_HORIZONTAL_VIEW_ANGLE * (moveX - touchX) / canvas.width + offsetX) % 360;
//
//            screen_elevation = 2 * SCREEN_VERTICAL_VIEW_ANGLE * (moveY - touchY) / canvas.height + offsetY;
//            screen_elevation = (screen_elevation > 90) ? 90 : ( screen_elevation < -90 ? -90 : screen_elevation );
//        }
//    },
//    'touchend mouseup': function(e) {
//        touch_flag = 0;
//    }
//});

var Dialog,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Dialog = (function() {

    Dialog.name = 'Dialog';

    function Dialog(dialog, checkedin) {
      var _this = this;
      this.dialog = dialog;
      this.checkedin = checkedin;
      this.checkedin_list = $('#checkedin-list', checkedin);
      this.checkedin_base = $($('#checkedin_base').html());
      this.close = __bind(this.close, this);
      this.open = __bind(this.open, this);
      this.open_ci = __bind(this.open_ci, this);
      this.close_ci = __bind(this.close_ci, this);
      this.formatLocalTime = __bind(this.formatLocalTime, this);

      this.name = $('#star-name', this.dialog);
      this.vmag = $('#star-vmag', this.dialog);
      this.cicnt = $('#user-count a', this.dialog);
      this.form = $('#checkin-form', this.dialog);
      this.message = $('#checkin-message', this.dialog);
      this.latitude = $('input[name="latitude"]', this.form);
      this.longitude = $('input[name="longitude"]', this.form);
      this.submit = $('#checkin-btn', this.form);
      this.vmag_suffix = ' magnitude star';
      this.cicnt_suffix = ' check-ins';
      this.close_btn = $('#close-btn', this.dialog);
      this.close_btn.on('click', function() {
        _this.close();
        return false;
      });
    }
    
    Dialog.prototype.open_ci = function(id){
	console.log("open_ci dialog");
    	this.close();
	dialog_open_flag = 1;
    	var _this = this;
    	$.ajax({
    		type: 'get',
    		dataType: 'json',
    		url: '/index.php/checkin/checkinlist/' + id,
    		success: function(data){
    			_this.render_ci(data);
    		}
    	});
    }
    
    Dialog.prototype.formatLocalTime = function(time){
    	var checklen = function(num){
    		if(num < 10){
    			num = '0' + num;
    		}
    		return num;
    	}
    	var timeString = '';
    	timeString += time.getFullYear() + '/';
    	timeString += checklen(time.getMonth() + 1) + '/';
    	timeString += checklen(time.getDate()) + ' ';
    	timeString += checklen(time.getHours()) + ':';
    	timeString += checklen(time.getMinutes()); // + ':';
    	//timeString += checklen(time.getSeconds());
    	
    	return timeString;
    }
    
    Dialog.prototype.render_ci = function(data){
	console.log("render_ci dialog");
    	var _this = this;
    	this.checkedin_list.html('');
    	if(data.length === 0){
    		this.checkedin_list.html('<li><p>No check-in users.</p></li>');
    	}else{
    		var currentDate = new Date();
    		currentDate = new Date(currentDate.toGMTString());
	    	$.each(data, function(index, ci){
				var $li = _this.checkedin_base.clone();
				$('.checkin-image img', $li).attr('src', ci.icon);
				$('.checkin-name', $li).text(ci.uname);
				$('.checkin-message', $li).text(ci.message.replace(/(\r\n|\r|\n)/g, '<br />'));
				$('.checkin-place', $li).text(ci.location);
				
				var $checkindate = $('.checkin-date', $li);
				var viewTime = ci.checkintime;
				var matches = ci.checkintime.match(/([0-9]{4})(?:\/|\-)([0-9]{1,2})(?:\/|\-)([0-9]{1,2})\s+([0-9]{1,2})\:([0-9]{1,2})/);
				if(matches !== null){
					var listTime = new Date();
					listTime.setTime(Date.UTC(parseInt(matches[1]), parseInt(matches[2]) - 1, parseInt(matches[3]), parseInt(matches[4]), parseInt(matches[5]), 0));
					var listTimeString = _this.formatLocalTime(listTime);
					$checkindate.attr('title', listTimeString);
					
					var postedTime = ((currentDate.getTime() - listTime.getTime()) / 1000 / 60);
					
					if(postedTime < 60){
						viewTime = Math.floor(postedTime).toString() + '分前';
					}else if(postedTime < 60*12){
						console.log(postedTime % 60)
						var postedHours = Math.floor(postedTime / 60);
						var postedMinutes = Math.floor(postedTime % 60);
						viewTime = postedHours.toString() + '時間' + postedMinutes.toString() + '分前';
					}else{
						viewTime = listTimeString;
					}
				}
				
				
				$checkindate.text(viewTime);
				$li.appendTo(_this.checkedin_list);
				$li.css({
					//'background-color': 'rgb(' + Math.floor( Math.random() * 255 ) + ',' + Math.floor( Math.random() * 255 ) + ',' + Math.floor( Math.random() * 255 ) + ')'
					'background-color': '#f8f8f8'	//背景色を指定しないとtouchイベントが拾えない謎仕様。transparentだとダメ。
				})
			});
		}
		var current_y = 0;
		var drag_y = 0;
		var getY = function(event){
			if (navigator.userAgent.match(/Android/i)) {
				return event.originalEvent.originalEvent.touches[0].clientY;
			}else{
				return event.originalEvent.clientY;
			}
		}
		this.checkedin_list.flickable({
			dragStart: function(event, obj){
				current_y = getY(event);
			},
			drag: function(event, obj){
				drag_y = getY(event);
				if(current_y > drag_y){
					_this.checkedin_list[0].scrollTop += (current_y - drag_y);
				}else{
					_this.checkedin_list[0].scrollTop -= (drag_y - current_y);
				}
				current_y = drag_y;
			}
		}).flickable('refresh');
		
		$('#checkin-close-btn a', _this.checkedin).off('click').on('click', function(){
			_this.close_ci();
		});
		
		_this.checkedin.slideDown('slow', function(){
			_this.checkedin_list.height(_this.checkedin.height() - 40);
		});
    }
    
    Dialog.prototype.close_ci = function(){
	console.log("close_ci dialog");
	dialog_open_flag = 0;
    	this.checkedin_list.flickable('destroy');
    	this.checkedin.slideUp('slow');
    }

    Dialog.prototype.open = function(id, name, vmag, checkin_count) {
      console.log("open dialog");
      dialog_open_flag = 1;
      var _this = this;
      if (checkin_count == null) {
        checkin_count = 0;
      }
      this.message.val('');
      this.name.text(name);
      this.vmag.text((Math.round(vmag * 100) / 100) + this.vmag_suffix);
      this.cicnt.text(checkin_count + this.cicnt_suffix);
      this.submit.off('click').on('click', function() {
        //_this.send(id, 35.658, 139.741);
        $.ajax({
	    	type: 'post',
	    	dataType: 'json',
	    	data: {
	    		latitude: place_info.latitude,
	    		longitude: place_info.longitude,
	    		message: _this.message.val()
	    	},
	    	url: '/index.php/checkin/reg_checkin/' + id,
	    	success: function(data){
	    		_this.close();
	    		_this.render_ci(data);
	    		
	    	}
	    });
        return false;
      });
      this.cicnt.off('click').on('click', function(){
      	_this.open_ci(id);
      	return false;
      });
      return this.dialog.slideDown();
    };

    Dialog.prototype.close = function() {
      console.log("close dialog");
      dialog_open_flag = 0;
      return this.dialog.slideUp();
    };

    return Dialog;

  })();
