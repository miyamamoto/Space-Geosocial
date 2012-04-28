var screen_azimuth; //方位
var screen_elevation; //高角度
var ready_db_flag = 0;
var ready_scroll_flag = 0;
var frame_count = 0;
var ERROR = 30;
var dialog;

(function(window) {
    function checkready(){
        if(ready_db_flag === 1 && ready_scroll_flag === 1){
            var canvas = $("#stageCanvas")[0];
            canvas.height = $(document).height();
            canvas.width = $(document).width();
            var m = main().init(canvas);
        }
    }

    $(function() {
        // 初期化処理...
        // HTMLロード後に実行
        if(supports_canvas()) {
            var canvas = $("#stageCanvas")[0];
            //アドレスバーを消すためにcanvasの高さを調整しておき100ms後に1ピクセルスクロール
            canvas.height = $(document).height()+60;
            setTimeout(start, 100);
        } else {
            var wrapper = $("#main")[0];
            wrapper.innerHTML = "Your browser does not appear to support " + "the HTML5 Canvas element";
        }
        //dialog = new Dialog($('#dialog'));
    });
    function start(){
        scrollTo(0,1);
        ready_scroll_flag = 1;
        checkready();
    }
    function supports_canvas() {
        return !!document.createElement("canvas").getContext;
    }

    var main = function(spec, my) {
        var SCREEN_WIDTH    = innerWidth;
        var SCREEN_HEIGHT   = innerHeight;

        var canvas;
        var stage;
        var starfield;
        var stars = new Array();
        var stars_data = new Array(); //= STARS_DATA;
        var stars_name = new Array();
        var sky;

        //var STAR_NUM = stars_data.length;
        var STAR_NUM;// = 100;

        var my = my || {};
        var that = {};
        ////ローカル変数
        that.init = function(canvas,stat) {
            // create a new stage and point it at our canvas:
            canvas = document.getElementById("stageCanvas");
            stage = new Stage(canvas);

            // draw the sky:
            sky = new Shape();
            sky.graphics.beginLinearGradientFill(["#204","#003","#000"], [0,0.15,0.6], 0, SCREEN_HEIGHT, 0, 0);
            sky.graphics.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            stage.addChild(sky);

            // create a Shape instance to draw the vectors stars in, and add it to the stage:
            starfield = new Shape();
            stage.addChild(starfield);

            starfield.cache(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
            stage.update();
            Ticker.setFPS(30);
            Ticker.addListener(that);
        }

        that.tick = function() {
            //console.log("WIDTH");
            //console.log(SCREEN_WIDTH);
            if((frame_count % 30) === 0){
                var s = window.space_geosocial;
                s.get_near_stars(function(stars_db_data){
                    STAR_NUM = stars_db_data.length;

                    stars = [];
                    stars_name = [];
                    stars_data = [];
                    for(var i = 0; i < stars_db_data.length; i++){
                        stars_data.push({
                            id: stars_db_data[i].id,
                            vmag: stars_db_data[i].vmag,
                            azimuth: stars_db_data[i].azimuth,
                            elevation: stars_db_data[i].elevation,
                            name: stars_db_data[i].name ? stars_db_data[i].name : stars_db_data[i].bfid
                        });
                        var pos_x = Math.floor( 2 * SCREEN_WIDTH * ( - stars_data[i].azimuth + screen_azimuth + ERROR )/ (ERROR) );
                        var pos_y = Math.floor( 2 * SCREEN_HEIGHT * ( - stars_data[i].elevation + screen_elevation + ERROR)/ (ERROR) );
                        console.log(pos_y);
                        console.log(stars_data[i].elevation);
                        console.log(0);
                        var size = Math.floor((7-stars_data[i].vmag )*1.5)+1;

                        ////Shape
                        stars[i] = new Shape();
                        stars[i].graphics.beginFill("#FFF").drawCircle(pos_x, pos_y, size);
                        stage.addChild(stars[i]);

                        stars_name[i] = new Text(stars_data[i].name, "8px Arial", "#AAA");
                        stars_name.textBaseline = "top";
                        stars_name[i].x = pos_x + 5;
                        stars_name[i].y = pos_y + 5;
                        stage.addChild(stars_name[i]);
                    }

                }, screen_azimuth, screen_elevation, 30);
            }

            // draw a vector star at a random location:
            starfield.graphics.beginFill(Graphics.getRGB(0xFFFFFF,Math.random())).drawPolyStar(Math.random()*SCREEN_WIDTH, Math.random()*SCREEN_HEIGHT, Math.random()*4+1, 5, 0.93, Math.random()*360);

            // draw the new vector onto the existing cache, compositing it with the "source-overlay" composite operation:
            starfield.updateCache("source-overlay");

            // because the vector star has already been drawn to the cache, we can clear it right away:
            starfield.graphics.clear();

            // darken the sky:
            sky.alpha -= 0.0005;

            // move the moon across the sky:
            //var w = SCREEN_WIDTH+200;
            //for(var i=0;i<STAR_NUM;i++){
            //    var azimuth = screen_azimuth - stars_data[i].azimuth.screen_azimuth;
            //    var elevation = stars_data[i].elevation.screen_elevation - screen_elevation;
                // stars[i].x = azimuth;
                // stars[i].y = elevation;
            //    stars.push({
            //        x: azimuth,
            //        y: elevation
            //    });
            //    stars_name.push({
            //        x: azimuth,
            //        y: elevation
            //    });
                // stars_name[i].x = azimuth;
                // stars_name[i].y = elevation;

            //}
            // draw the updates to stage:
            stage.update();
            frame_count++;
        }
        return that;
    }

    $(window).bind('space_geosocial_ready', function(){
        var s = window.space_geosocial;
        s.get_near_stars(function(stars_db_data){
            ready_db_flag = 1;
            checkready();
        }, screen_azimuth, screen_elevation, ERORR);
    });
})(window);

function setValue(data) {
    screen_azimuth = data.alpha ? data.alpha : 0;
    screen_elevation = data.gamma ? data.gamma : 0;
};

window.ondeviceorientation = function(event) {
    var data = {
        alpha:event.alpha,
        beta: event.beta,
        gamma: event.gamma
    };
    setValue(data);
};

