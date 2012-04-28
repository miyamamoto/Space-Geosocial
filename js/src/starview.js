var ready_db_flag = 0;
var ready_scroll_flag = 0;
var frame_count = 0;
var dialog;
var screen_azimuth = 0; //方位
var screen_elevation = 0; //高角度
//var SCREEN_HORIZONTAL_VIEW_ANGLE = 7.125;
//var SCREEN_VERTICAL_VIEW_ANGLE = 4.764;
var SCREEN_HORIZONTAL_VIEW_ANGLE = 30;
var SCREEN_VERTICAL_VIEW_ANGLE = 20;
var STAR_NUM = 100;
var low_pass_filter = 0.5;
var low_pass_azumith = [0, 0, 0];
var NEWS = ["N", "E", "W", "S"];
var NEWS_AZMITH = [0, 90, 270, 180];

(function(window) {
    function checkready(){
        if(ready_scroll_flag === 1){
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
        console.log("SCREEN");
        console.log(SCREEN_WIDTH);
        console.log(SCREEN_HEIGHT);

        var canvas;
        var stage;
        var starfield;
        var news = [];
        var star = [];
        var star_data = []; //= STARS_DATA;
        var star_name = [];
        var sky;
        var display_azimuth;
        var display_elevation;


        //　観測者は東京に居るとする（あとで取得する）
        var observer = {
          "latitude":35.658,
          "longitude":139.741,
          "altitude":0
        }

        var my = my || {};
        var that = {};
        ////ローカル変数
        that.init = function(canvas,stat) {

            //KASHIWAI API
            var bsc = BSC.BSC;

            console.log("bsc");
            console.log(bsc[0]);
            var date = new Date();
            var time = new Orb.Time(date);
            for(var i = 0; i < STAR_NUM; i++){
                var target = {
                  "ra": bsc[i].RAh,
                  "dec": bsc[i].DEd
                };
                var observe = new Orb.Observation(observer,target);
                var look = observe.horizontal(time);
                star_data.push(look);
            }
            console.log("star_data");
            console.log(star_data);

            // create a new stage and point it at our canvas:
            canvas = $("#stageCanvas")[0];
            stage = new Stage(canvas);

            // draw the sky:
            sky = new Shape();
            sky.graphics.beginLinearGradientFill(["#204","#003","#000"], [0,0.15,0.6], 0, SCREEN_HEIGHT, 0, 0);
            sky.graphics.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            stage.addChild(sky);

            // create a Shape instance to draw the vectors star in, and add it to the stage:
            starfield = new Shape();
            stage.addChild(starfield);

            starfield.cache(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

            for(var i = 0; i < 4; i++){
                console.log("NEWS[i]");
                console.log(NEWS[i]);
                news[i] = new Text(NEWS[i], "20px Arial", "#FFF");
                var pos_x = ( (SCREEN_WIDTH / 2) * (NEWS_AZMITH[i] - screen_azimuth )/ SCREEN_HORIZONTAL_VIEW_ANGLE + SCREEN_WIDTH / 2);
                news[i].x = pos_x;
                news[i].y = SCREEN_HEIGHT -40;
                stage.addChild(news[i]);
            }

            for(var i = 0; i < STAR_NUM; i++){
                var pos_x = ( (SCREEN_WIDTH / 2) * (star_data[i].azimuth - screen_azimuth )/ SCREEN_HORIZONTAL_VIEW_ANGLE + SCREEN_WIDTH / 2);
                var pos_y = ( SCREEN_HEIGHT - ((SCREEN_HEIGHT/ 2) * ( star_data[i].elevation - screen_elevation )/ SCREEN_VERTICAL_VIEW_ANGLE + SCREEN_HEIGHT / 2));
                var size = ((7-bsc[i].Vmag )*1.5)+1;
                console.log("" + star_data[i].azimuth);
                console.log("" + star_data[i].elevation);
                console.log("" + pos_x);
                console.log("" + pos_y);
                console.log("" + size);

                //Shape
                star[i] = new Shape();
                star[i].graphics.beginFill("#FFF").drawCircle(pos_x, pos_y, size);
                stage.addChild(star[i]);

                star_name[i] = new Text(bsc[i].Name ? bsc[i].Name : bsc[i].bfID, "8px Arial", "#AAA");
                star_name[i].textBaseline = "top";
                star_name[i].x = pos_x;
                star_name[i].y = pos_y;
                stage.addChild(star_name[i]);
            }

            //display azimuth and elevation
            display_azimuth = new Text("azimuth", "8px Arial", "#AAA");
            display_elevation = new Text("elevation", "8px Arial", "#AAA");
            //star_name.textBaseline = "top";
            display_azimuth.x = 20;
            display_azimuth.y = SCREEN_HEIGHT - 20;
            display_elevation.x = 200;
            display_elevation.y = SCREEN_HEIGHT -20;
            stage.addChild(display_azimuth);
            stage.addChild(display_elevation);

            Ticker.addListener(that);
            Ticker.setFPS(30);
        }

        that.stop = function(){
            Ticker.removeListener(that);
        }
        that.tick = function() {
            // draw a vector star at a random location:
            starfield.graphics.beginFill(Graphics.getRGB(0xFFFFFF,Math.random())).drawPolyStar(Math.random()*SCREEN_WIDTH, Math.random()*SCREEN_HEIGHT, Math.random()*4+1, 5, 0.93, Math.random()*360);

            // draw the new vector onto the existing cache, compositing it with the "source-overlay" composite operation:
            starfield.updateCache("source-overlay");

            // because the vector star has already been drawn to the cache, we can clear it right away:
            starfield.graphics.clear();

            // darken the sky:
            sky.alpha -= 0.0005;

            // move the moon across the sky:
            for(var i=0;i<STAR_NUM;i++){
                var pos_x = ( (SCREEN_WIDTH / 2) * (star_data[i].azimuth - screen_azimuth )/ SCREEN_HORIZONTAL_VIEW_ANGLE + SCREEN_WIDTH / 2);
                var pos_y = ( SCREEN_HEIGHT - ((SCREEN_HEIGHT/ 2) * ( star_data[i].elevation - screen_elevation )/ SCREEN_VERTICAL_VIEW_ANGLE + SCREEN_HEIGHT / 2));
                star_name[i].x = pos_x;
                star_name[i].y = pos_y;
                star[i].x = pos_x ;
                star[i].y = pos_y;
                //console.log("" + star_data[i].azimuth);
                //console.log("" + star_data[i].elevation);
                //console.log("" + pos_x);
                //console.log("" + pos_y);
            }
            //NEWS
            for(var i = 0; i < 4; i++){
                var pos_x = ( (SCREEN_WIDTH / 2) * (NEWS_AZMITH[i] - screen_azimuth )/ SCREEN_HORIZONTAL_VIEW_ANGLE + SCREEN_WIDTH / 2);
                news[i].x = pos_x;
            }
            //display azimuth and elevation
            display_azimuth.text =  "azimuth : " + screen_azimuth;
            display_elevation.text = "elevation : " + screen_elevation;
            //display_azimuth.x = pos_x;
            //display_elevation.x = pos_x + 200;

            // draw the updates to stage:
            stage.update();
            frame_count++;
        }
        return that;
    }

})(window);

window.ondeviceorientation = function(event) {
    //var a = 360 - Math.round(event.alpha*1/1);
    //a = (a < 0 ) ? ( (a > -90) ? a + 360 : a) : a;
    //var b = Math.round(event.beta*1/1);
    //var g = -Math.round(event.gamma*1/1) - 90;
    var a = 360 - (event.alpha*1/1);
    //low_pass_azumith.shift();
    //low_pass_azumith.push(a);
    //var x1 = 0, y1 = 0;
    //console.log("get sensor");
    //for(var i = 0 ; i < low_pass_azumith.length ; i++){
    //    console.log("get sensor");
    //    x1 += Math.cos(low_pass_azumith[i] * Math.PI / 180);
    //    y1 += Math.sin(low_pass_azumith[i] * Math.PI / 180);
    //}
    //a = Math.atan2(y1, x1) * 180 / Math.PI;
    //a = a * low_pass_filter + screen_azimuth * (1.0 - low_pass_filter);
    a = (a < 0 ) ? ( (a > -90) ? a + 360 : a) : a;
    var b =(event.beta*1/1);
    var g = (-(event.gamma*1/1) - 90 );
    g = g * low_pass_filter + screen_elevation * (1.0 - low_pass_filter);
    g = g >= 90 ? 90 : ( g < -90 ? -90 : g );
    screen_azimuth = a;
    screen_elevation = g;
    //screen_azimuth = 203;
    //screen_elevation = 34;
}


