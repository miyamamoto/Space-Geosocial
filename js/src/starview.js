var ready_db_flag = 0;
var ready_scroll_flag = 0;
var dialog;
var screen_azimuth = 0; //方位
var screen_elevation = 0; //高角度
//var SCREEN_HORIZONTAL_VIEW_ANGLE = 7.125;
//var SCREEN_VERTICAL_VIEW_ANGLE = 4.764;
var SCREEN_HORIZONTAL_VIEW_ANGLE = 30;
var SCREEN_VERTICAL_VIEW_ANGLE = 20;
var STAR_NUM = 50;
var SCREEN_WIDTH;
var SCREEN_HEIGHT;
var low_pass_filter = 0.5;
var low_pass_azumith = [0, 0, 0];
var NEWS = {
    "N_LABEL" : "N",
    "S_LABEL" : "S",
    "E_LABEL" : "E",
    "W_LABEL" : "W",
    "N_AZMITH" : 0,
    "S_AZMITH" : 180,
    "E_AZMITH" : 90,
    "W_AZMITH" : 270,
};

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
        SCREEN_WIDTH    = innerWidth;
        SCREEN_HEIGHT   = innerHeight;
        var canvas;
        var stage;
        var starfield;
        var star = [];
        var sky;
        var display = {};
        var date = new Date();

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
            var time = new Orb.Time(date);
            console.log("star.data");
            for(var i = 0; i < STAR_NUM; i++){
                var target = {
                  "ra": bsc[i].RAh,
                  "dec": bsc[i].DEd
                };
                var observe = new Orb.Observation(observer,target);
                var look = observe.horizontal(time);
                star.push({"data" : look});
                console.log(star[i].data);
            }

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
                var size = ((7-bsc[i].Vmag )*1.5)+1;

                //Shape
                //star[i]["shape"] = new Shape();
                //star[i].shape.graphics.beginFill("#FFF").drawCircle(pos_x, pos_y, size);
                //star[i].shape.x = pos_x;
                //star[i].shape.y = pos_y;
                star[i]["name"] = new Text(bsc[i].Name ? "★" + bsc[i].Name : "・" + bsc[i].bfID, "14px Arial", "#EEE");
                star[i].name.textBaseline = "top";
                star[i].name.x = pos_x;
                star[i].name.y = pos_y;
                //stage.addChild(star[i].shape);
                stage.addChild(star[i].name);
            }

            //display azimuth and elevation
            display = {
                "azimuth" : new Text("azimuth", "12px Arial", "#AAA"),
                "elevation" : new Text("elevation", "12px Arial", "#AAA"),
                "time" : new Text("time" + date.getHours() + " : " + date.getMinutes(), "12px Arial", "#AAA"),
                "north" : new Text("N", "20px Arial", "#F00"),
                "south" : new Text("S", "20px Arial", "#00F"),
                "east" : new Text("E", "20px Arial", "#FFF"),
                "west" : new Text("W", "20px Arial", "#FFF")
            };
            display.azimuth.x = 20;
            display.azimuth.y = SCREEN_HEIGHT - 20;

            display.elevation.x = 170;
            display.elevation.y = SCREEN_HEIGHT -20;

            display.time.x = 320;
            display.time.y = SCREEN_HEIGHT -20;

            display.north.x = calc_screen_x(NEWS.N_AZMITH - screen_azimuth);
            display.south.x = calc_screen_x(NEWS.S_AZMITH - screen_azimuth);
            display.east.x = calc_screen_x(NEWS.E_AZMITH - screen_azimuth);
            display.west.x = calc_screen_x(NEWS.W_AZMITH - screen_azimuth);

            display.north.y = SCREEN_HEIGHT - 40;
            display.south.y = SCREEN_HEIGHT - 40;
            display.east.y = SCREEN_HEIGHT - 40;
            display.west.y = SCREEN_HEIGHT - 40;

            stage.addChild(display.azimuth);
            stage.addChild(display.elevation);
            stage.addChild(display.time);
            stage.addChild(display.north);
            stage.addChild(display.south);
            stage.addChild(display.east);
            stage.addChild(display.west);

            Ticker.addListener(that);
            Ticker.setFPS(10);
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
                //if(1){continue;}
                var pos_x;
                if ( star[i].data.azimuth >= screen_azimuth - SCREEN_HORIZONTAL_VIEW_ANGLE + 360){
                    pos_x = star[i].data.azimuth - 360 - screen_azimuth;
                } else if (star[i].data.azimuth <= screen_azimuth + SCREEN_HORIZONTAL_VIEW_ANGLE -360){
                    pos_x = star[i].data.azimuth + 360 - screen_azimuth;
                } else {
                    pos_x = star[i].data.azimuth - screen_azimuth;
                }
                var pos_y = star[i].data.elevation - screen_elevation;
                //if ( pos_x > 1 || pos_x < -1 || pos_y > 1 || pos_y < -1) {continue;}
                pos_x = calc_screen_x(pos_x);
                pos_y = calc_screen_y(pos_y);
                //star[i].shape.x = pos_x;
                //star[i].shape.y = pos_y;
                star[i].name.x = pos_x;
                star[i].name.y = pos_y;
                //console.log("sirius_shape" + star[i].shape.x + " : " + star[i].shape.y);
                //console.log("sirius_name" + star[i].name.x + " : " + star[i].name.y);
            }
            //NEWS
            if ( NEWS.N_AZMITH >= screen_azimuth - SCREEN_HORIZONTAL_VIEW_ANGLE + 360){
                display.north.x = calc_screen_x(NEWS.N_AZMITH - 360 - screen_azimuth);
            } else if (NEWS.N_AZMITH <= screen_azimuth + SCREEN_HORIZONTAL_VIEW_ANGLE -360){
                display.north.x = calc_screen_x(NEWS.N_AZMITH + 360 - screen_azimuth);
            } else {
                display.north.x = calc_screen_x(NEWS.N_AZMITH - screen_azimuth);
            }
            display.south.x = calc_screen_x(NEWS.S_AZMITH - screen_azimuth);
            display.east.x = calc_screen_x(NEWS.E_AZMITH - screen_azimuth);
            display.west.x = calc_screen_x(NEWS.W_AZMITH - screen_azimuth);

            display.azimuth.text =  "azimuth : " + Math.round(screen_azimuth);
            display.elevation.text = "elevation : " + Math.round(screen_elevation);
            display.time.text = "time" + date.getHours() + " : " + date.getMinutes();

            //display_azimuth.x = pos_x;
            //display_elevation.x = pos_x + 200;

            // draw the updates to stage:
            stage.update();
            //console.log("sirius_shape" + star[0].shape.x + " : " + star[0].shape.y);
            //console.log("sirius_name"  + star[0].name.x  + " : " + star[0].name.y);
        }
        return that;
    }

    function calc_screen_x(target_azmith){
        return  ( (SCREEN_WIDTH / 2) * target_azmith / SCREEN_HORIZONTAL_VIEW_ANGLE + SCREEN_WIDTH / 2);
    }

    function calc_screen_y(target_elevation){
        return  SCREEN_HEIGHT - ( (SCREEN_HEIGHT / 2) * target_elevation / SCREEN_VERTICAL_VIEW_ANGLE + SCREEN_HEIGHT / 2);
    }

})(window);

window.ondeviceorientation = function(event) {
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
    //a = (a < 0 ) ? ( (a > -90) ? a + 360 : a) : a;
    var b =(event.beta*1/1);
    var g = (-(event.gamma*1/1) - 90 );
    g = g * low_pass_filter + screen_elevation * (1.0 - low_pass_filter);
    g = g >= 90 ? 90 : ( g < -90 ? -90 : g );
    screen_azimuth = a;
    screen_elevation = g;
    //screen_azimuth = 203;
    //screen_elevation = 34;
}


