var screen_azimuth; //方位
var screen_elevation; //高角度
var ready_db_flag = 0;
var frame_count = 0;
(function(window) {
    $(function() {
        // 初期化処理...
        // HTMLロード後に実行
        if(supports_canvas()) {
            console.log("supports_canvas");
            var canvas = $("#stageCanvas")[0];
            //アドレスバーを消すためにcanvasの高さを調整しておき100ms後に1ピクセルスクロール
            canvas.height = $(document).height()+60;
            setTimeout(start, 100);
        } else {
            var wrapper = $("#main")[0];
            wrapper.innerHTML = "Your browser does not appear to support " + "the HTML5 Canvas element";
        }
    });
    function start(){
        scrollTo(0,1);
        var canvas = $("#stageCanvas")[0];
        canvas.height = $(document).height();
        canvas.width = $(document).width();
        var m = main().init(canvas);
    }
    function supports_canvas() {
        return !!document.createElement("canvas").getContext;
    }

    var main = function(spec, my) {
        console.log("in main");
        var SCREEN_WIDTH    = innerWidth;
        var SCREEN_HEIGHT   = innerHeight;

        var canvas;
        var stage;
        var starfield;
        var stars = new Array();
        //var stars_data = STARS_DATA;
        var stars_name = new Array();
        var sky;
        var result = [];

        //var STAR_NUM = stars_data.length;
        var STAR_NUM = 0;

        var my = my || {};
        var that = {};
        ////ローカル変数
        that.init = function(canvas,stat) {
            console.log("init");

            $(window).bind('space_geosocial_ready', function(){
                var s = window.space_geosocial;
                s.get_near_stars(function(stars_db_data){
                    console.log("stars");
                    console.log(stars_db_data.length);
                    STAR_NUM = stars_db_data.length;
                    for(var i = 0; i < stars.length; i++){
                        stars_data[i].id = stars_db_data[i].id;
                        stars_data[i].vmag = stars_db_data[i].vmag;
                        stars_data[i].azimuth = stars_db_data[i].azimuth;
                        stars_data[i].elevation = stars_db_data[i].elevation;
                    }
                }, 10, 30, 15);

                canvas = document.getelementbyid("stagecanvas");
                stage = new stage(canvas);
                // draw the sky:
                sky = new shape();
                sky.graphics.beginlineargradientfill(["#204","#003","#000"], [0,0.15,0.6], 0, screen_height, 0, 0);
                sky.graphics.drawrect(0, 0, screen_width, screen_height);
                stage.addchild(sky);
                // create a shape instance to draw the vectors stars in, and add it to the stage:
                starfield = new shape();
                stage.addChild(starfield);

                // set up the cache for the star field shape, and make it the same size as the canvas:

                for(var i=0;i<0;i++){
                    //Position
                    var pos_x = Math.floor( Math.random() * SCREEN_WIDTH );
                    var pos_y = Math.floor( Math.random() * SCREEN_HEIGHT );
                    //var size = Math.floor( Math.random() * 4 ) + 1;
                    var size = Math.floor(-stars_data[i].vmag + 5);
                    //console.log("in loop");

                    //Shape
                    stars[i] = new Shape();
                    stars[i].graphics.beginFill("#FFF").drawCircle(pos_x, pos_y, size);
                    //stars[i].graphics.beginFill(Graphics.getRGB(0xFFFFFF,Math.random())).drawPolyStar(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*20+1, 5, 0.6, Math.random()*360);
                    //stars[i].rotation = Math.floor( Math.random() * 100 ) -50;
                    stage.addChild(stars[i]);

                    //star name
                    stars_name[i] = new Text(stars_data[i].Name, "18px Arial", "#AAA");
                    console.log(stars_data[i].Name);
                    stars_name.textBaseline = "top";
                   // stars_name[i] = new Text("HW", "22px Arial", "#AAA");
                    stars_name[i].x = pos_x + 5;
                    stars_name[i].y = pos_y + 5;
                    stage.addChild(stars_name[i]);
                }
                starfield.cache(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
                stage.update();
                Ticker.setFPS(30);
                Ticker.addListener(that);
            });
        }

        that.tick = function() {
            //console.log("in tick " + frame_count);
            frame_count++;
            //もしDBの用意ができていれば実行
            if(ready_db_flag === 1 && (frame_count % 60) === 0){
                var s = window.space_geosocial;
                s.get_near_stars(function(stars_db_data){
                    console.log("stars");
                    console.log(stars_db_data.length);
                    STAR_NUM = stars_db_data.length;
                    ready_db_flag = 1;
                    for(var i = 0; i < stars.length; i++){
                        stars_data[i].id = stars_db_data[i].id;
                        stars_data[i].vmag = stars_db_data[i].vmag;
                        stars_data[i].azimuth = stars_db_data[i].azimuth;
                        stars_data[i].elevation = stars_db_data[i].elevation;
                        //console.log('id : ' + stars_db_data[i].id + ', name: ' + stars_db_data[i].name + ', bfid: ' + stars_db_data[i].bfid + ', vmag: ' + stars_db_data[i].vmag + ', azimuth: ' + stars_db_data[i].azimuth + ', elevation: ' + stars_db_data[i].elevation);
                    }
                }, screen_azimuth, screen_elevation, 15);
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
            var w = SCREEN_WIDTH+200;
            for(var i=0;i<STAR_NUM;i++){
                var azimuth = screen_azimuth;
                var elevation = screen_elevation;
                stars[i].x = azimuth;
                stars[i].y = elevation;
                stars_name[i].x = azimuth;
                stars_name[i].y = elevation;

                //stars[i].x = (stars[i].x+1);
                //stars[i].y = stars[i].y;
                //stars_name[i].x = (stars_name[i].x+1);
                //stars_name[i].y = stars_name[i].y;
                //stars[i].y = 250-Math.sin(stars[i].x/w*Math.PI)*150;
            }
            // draw the updates to stage:
            stage.update();
        }
        return that;
    }
})(window);

function setValue(data) {
    screen_azimuth = data.alpha;
    screen_elevation = data.gamma;
};

window.ondeviceorientation = function(event) {
    var data = {
        alpha:event.alpha,
        beta: event.beta,
        gamma: event.gamma
    };
    setValue(data);
};

