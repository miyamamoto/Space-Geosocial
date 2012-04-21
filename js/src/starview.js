var screen_azimuth; //方位
var screen_elevation; //高角度
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
        var stars_data = STARS_DATA;
        var stars_name = new Array();
        var stars_azimuth = new Array();
        var stars_elevation = new Array();
        var sky;
        var result = [];

        //var STAR_NUM = stars_data.length;
        var STAR_NUM = 10;

        var my = my || {};
        var that = {};
        ////ローカル変数
        that.init = function(canvas,stat) {
            console.log("init");

            console.log("SCREEN_SIZE");
            console.log(SCREEN_WIDTH);
            console.log(SCREEN_HEIGHT);


            console.log('stars_data');
            console.log(stars_data[0]);

            // create a new stage and point it at our canvas:
            canvas = document.getElementById("stageCanvas");
            //canvas.width = SCREEN_WIDTH;
            //canvas.height= SCREEN_HEIGHT;
            stage = new Stage(canvas);

            // draw the sky:
            sky = new Shape();
            sky.graphics.beginLinearGradientFill(["#204","#003","#000"], [0,0.15,0.6], 0, SCREEN_HEIGHT, 0, 0);
            sky.graphics.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            stage.addChild(sky);

            // create a Shape instance to draw the vectors stars in, and add it to the stage:
            starfield = new Shape();
            stage.addChild(starfield);

            // set up the cache for the star field shape, and make it the same size as the canvas:

            for(var i=0;i<STAR_NUM;i++){
                //Position
                var pos_x = Math.floor( Math.random() * SCREEN_WIDTH );
                var pos_y = Math.floor( Math.random() * SCREEN_HEIGHT );
                //var size = Math.floor( Math.random() * 4 ) + 1;
                var size = Math.floor(-stars_data[i].Vmag + 5);
                console.log("in loop");
                console.log(stars_data[i].Vmag);

                //Shape
                stars[i] = new Shape();
                stars[i].graphics.beginFill("#FFF").drawCircle(pos_x, pos_y, size);
                //stars[i].graphics.beginFill(Graphics.getRGB(0xFFFFFF,Math.random())).drawPolyStar(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*20+1, 5, 0.6, Math.random()*360);
                //stars[i].rotation = Math.floor( Math.random() * 100 ) -50;
                stage.addChild(stars[i]);

                //star name
                stars_name[i] = new Text(stars_data[i].name, "18px Arial", "#AAA");
                stars_name.textBaseline = "top";
               // stars_name[i] = new Text("HW", "22px Arial", "#AAA");
                stars_name[i].x = pos_x + 5;
                stars_name[i].y = pos_y + 5;
                stage.addChild(stars_name[i]);
            }
            starfield.cache(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
            stage.update();
            Ticker.setFPS(24);
            Ticker.addListener(that);
        }

        that.tick = function() {
            console.log("in tick");

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
                //stars[i].x = screen_azimuth;
                //stars[i].y = screen_elevation;
                //stars_name[i].x = azimuth;
                //stars_name[i].y = elevation;

                //stars[i].x = (stars[i].x+100+1+w)%w-100;
                //stars[i].y = stars[i].y;
                //stars_name[i].x = (stars_name[i].x+100+1+w)%w-100;
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
        alpha:(event.alpha < 180 ) ? event.alpha/10 : (event.alpha - 360)/10,
        beta: event.beta/10 ,
        gamma: (event.gamma + 90)/10
    };
    setValue(data);
};
