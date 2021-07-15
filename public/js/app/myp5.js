"use strict";

var screen_width,screen_height; //屏幕的宽和高

var start_x,start_y; //绘制起始位置坐标
var canvas_x,canvas_y,canvas_width,canvas_height;//绘制区域左上角坐标
var image_x,image_y,image_width,image_height;//图片区域
var operate_x,operate_y,operate_width,operate_height;

var has_started=false; //set to true after user starts writing
var has_started_image=false;

var has_box_corner_started=false;

var x=0, y=0; // absolute coordinates on the screen of where the pen is
var epsilon = 2; // to ignore data from user's pen staying in one spot.

//dom
var canvas;

var img;

//画板控件
var ismouse_select=false;//鼠标移入选中的笔画

var ismouse_select_cur=false;//鼠标移入选中当前正在绘制的笔画

var is_boundingbox_select=false;//鼠标移入boundingbox

function preload(){
    var rootFolder = Apollo.publicUrl + 'images/background/';
    //加载图片文件
    img=loadImage(rootFolder + Apollo.reference);
};

function setup(){
    init();
};

function draw(){
    process_user_input();
};

function mouseClicked() {
    if(ismouse_select)
    {
        if(Paras.isInArray(Paras.strokes,Paras.cur_stroke_id))
        {
            Paras.movestroke(Paras.cur_stroke_id,Paras.cur_object_id);
        }
        else{
            Paras.movestrokeback(Paras.cur_stroke_id,Paras.cur_object_id);
        }
        redraw_screen();
        layout.update_select_strokes();
        layout.update_all_strokes();
        ismouse_select=false;
        Paras.cur_stroke_id=-1;
    }

    if(is_boundingbox_select){
        Paras.setBoundingboxId(Paras.cur_boundingbox_id);
        redraw_screen();
        is_boundingbox_select=false;
        Paras.cur_boundingbox_id=-1;
    }
};

function keyPressed() {
    if (keyCode === 32) {
        for(var i=0;i<Paras.cur_stroke_ids.length;i++){
            var stroke_id=Paras.cur_stroke_ids[i];
            if(Paras.isInArray(Paras.strokes,stroke_id))
            {
                Paras.movestroke(stroke_id,Paras.cur_object_id);
            }
        }
        Paras.cur_stroke_ids=[];
        redraw_screen();
        layout.update_select_strokes();
        layout.update_all_strokes();
    } 
}

var init=function(){

    screen_width=Math.max(window.innerWidth,480);
    screen_height=Math.max(window.innerHeight,320);

    operate_x=300;
    operate_y=0;
    operate_width=0;
    operate_height=0;

    canvas_x=0;
    canvas_y=Math.abs((screen_height-img.height)/2);
    canvas_width=img.width;
    canvas_height=img.height;

    image_x=canvas_x+canvas_width+40;
    image_y=Math.abs((screen_height-img.height)/2);
    image_width=img.width;
    image_height=img.height;

    // var im=createImg(Apollo.publicUrl + 'images/background/'+Apollo.reference);
    // im.position(operate_x+canvas_width+40+20,operate_y+canvas_y);
    // im.size(image_width,image_height);

    canvas=createCanvas(canvas_width+image_width+80,Math.max(screen_height,img.height));
    canvas.position(operate_x,operate_y);

    frameRate(50);
    background(255,255,255,255);

    

    redraw_screen();
}

var pointToSegDist=function(x, y, x1, y1, x2, y2)
{
    let cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);
    if (cross <= 0) return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
    
    let d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (cross >= d2) return Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
    
    let r = cross / d2;
    let px = x1 + (x2 - x1) * r;
    let py = y1 + (y2 - y1) * r;
    return Math.sqrt((x - px) * (x - px) + (py - y) * (py - y));
};

var pointToBoundingbox=function(x,y,boundingbox,distance){
    var x1=boundingbox.x1+image_x+20;
    var x2=boundingbox.x2+image_x+20;
    var y1=boundingbox.y1+image_y;
    var y2=boundingbox.y2+image_y;
    if(pointToSegDist(x,y,x1,y1,x1,y2)<=3||pointToSegDist(x,y,x1,y1,x2,y1)<=3||pointToSegDist(x,y,x1,y2,x2,y2)<=3||pointToSegDist(x,y,x2,y1,x2,y2)<=3){
        return true;
    }
    return false;
}

var pointToCorner=function(x,y,boundingbox){
    var x1=boundingbox.x1;
    var y1=boundingbox.y1;
    var x2=boundingbox.x2;
    var y2=boundingbox.y2;

    // console.log(Math.sqrt((x-x1-image_x-20)*(x-x1-image_x-20)+(y-y1-image_y)*(y-y1-image_y)));
    if(Math.sqrt(Math.sqrt((x-x1-image_x-20)*(x-x1-image_x-20)+(y-y1-image_y)*(y-y1-image_y)))<3){
        stroke('red'); // Change the color
        strokeWeight(10); // Make the points 10 pixels in size
        point(x1+image_x+20, y1+image_y);
        return 1;
    }
    if(Math.sqrt(Math.sqrt((x-x2-image_x-20)*(x-x2-image_x-20)+(y-y1-image_y)*(y-y1-image_y)))<3){
        stroke('red'); // Change the color
        strokeWeight(10); // Make the points 10 pixels in size
        point(x2+image_x+20, y1+image_y);
        return 2;
    }
    if(Math.sqrt(Math.sqrt((x-x1-image_x-20)*(x-x1-image_x-20)+(y-y2-image_y)*(y-y2-image_y)))<3){
        stroke('red'); // Change the color
        strokeWeight(10); // Make the points 10 pixels in size
        point(x1+image_x+20, y2+image_y);
        return 3;
    }
    if(Math.sqrt(Math.sqrt((x-x2-image_x-20)*(x-x2-image_x-20)+(y-y2-image_y)*(y-y2-image_y)))<3){
        stroke('red'); // Change the color
        strokeWeight(10); // Make the points 10 pixels in size
        point(x2+image_x+20, y2+image_y);
        return 4;
    } 
}

var is_stroke_in_box=function(temp_stroke1,x1,y1,x2,y2){
    var temp_stroke=$.extend({}, temp_stroke1);
    var points=temp_stroke.points;
    for(var i=0;i<points.length;i++){
        var  point=points[i];
        
        if(point[0]+20>=x1&&point[0]+20<=x2&&point[1]+canvas_y>=y1&&point[1]+canvas_y<=y2)
        {
            continue;
        }
        else{
            return false;
        }
    }
    temp_stroke.color=color(255, 0, 0);
    draw_stroke(temp_stroke);
    return true;
}

var process_user_input = function () {
    
    if(mouseX>=0&&mouseX<=canvas_width+40&& mouseY>=0&&mouseY<=Math.max(screen_height,img.height)+20+canvas_y)
    {  
        process_canvas();
    }

    else if(mouseX>=image_x&&mouseX<=image_x+image_width+40 && mouseY>=0&&mouseY<=Math.max(screen_height,img.height)+20+canvas_y)
    {
        process_image();
    }
    else{
        is_boundingbox_select=false;
        Paras.cur_boundingbox_id=-1;
        ismouse_select=false;
        Paras.cur_stroke_id=-1;
        Paras.cur_stroke_ids=[];
        redraw_screen();
    }     
};

var process_canvas = function(){
    is_boundingbox_select=false;
    Paras.cur_boundingbox_id=-1;
    if(!Paras.is_stroke_delete){
        if(mouseIsPressed)
        {
            if(!has_started)
            {
                start_x=mouseX;
                start_y=mouseY;
                has_started=true;
            }
            else{
                var dx0 = mouseX-x; // candidate for dx
                var dy0 = mouseY-y; // candidate for dy
                if (dx0*dx0+dy0*dy0 < 16) { // only if pen is not in same area
                    return;
                }
                x=mouseX;
                y=mouseY;
                Paras.cur_stroke_ids=[];
                if(Math.abs(x-start_x)>5&&Math.abs(y-start_y)>5){
                    redraw_screen();
                    stroke(color(255,0,0));
                    line(start_x,start_y,x,start_y);
                    line(start_x,start_y,start_x,y);  
                    line(x,start_y,x,y);
                    line(start_x,y,x,y);
                    for(var i=0;i<Paras.strokes.length;i++){
                        var res=is_stroke_in_box(Paras.strokes[i],Math.min(start_x,x),Math.min(start_y,y),Math.max(start_x,x),Math.max(start_y,y));
                        if(res)
                        {
                            Paras.cur_stroke_ids.push(Paras.strokes[i].id);
                        }
                    }
                    return;
                }
            }     
        }
        else{
            has_started=false;
            Paras.cur_stroke_ids=[];
            var dx0 = mouseX-x; // candidate for dx
            var dy0 = mouseY-y; // candidate for dy
            if (dx0*dx0+dy0*dy0 < epsilon*epsilon) { // only if pen is not in same area
                return;
            }
            x=mouseX;
            y=mouseY;
            redraw_screen();
            ismouse_select=false;
            Paras.cur_stroke_id=-1;
            //console.log(mouseX,mouseY);
            for(var i=0;i<Paras.strokes.length;i++)
            {

                var temp_stroke=$.extend({}, Paras.strokes[i]);
                for(var j=0;j<temp_stroke.points.length;j++)
                {
                    var point=temp_stroke.points[j];
                    if(Math.abs(mouseX-point[0]-20)<3&&Math.abs(mouseY-point[1]-canvas_y)<3)
                    {
                        temp_stroke.color=color(255, 0, 0);
                        ismouse_select=true;
                        Paras.cur_stroke_id=temp_stroke.id;
                        draw_stroke(temp_stroke);
                        return;
                    }
                }
                if(ismouse_select)
                    return;
            }
        }
        
    }
    else{
        if(Paras.cur_object_id!=-1&&Paras.is_show_select){
            var dx0 = mouseX-x; // candidate for dx
            var dy0 = mouseY-y; // candidate for dy
            if (dx0*dx0+dy0*dy0 < epsilon*epsilon) { // only if pen is not in same area
                return;
            }
            x=mouseX;
            y=mouseY;
            redraw_screen();
            ismouse_select=false;
            Paras.cur_stroke_id=-1;
            var new_object=Paras.getObjectFid(Paras.cur_object_id);
            console.log(new_object.id);
            for(var i=0;i<new_object.strokes.length;i++)
            {
                var temp_stroke=$.extend({}, new_object.strokes[i]);
                for(var j=0;j<temp_stroke.points.length;j++)
                {
                    var point=temp_stroke.points[j];
                    if(Math.abs(mouseX-point[0]-20)<3&&Math.abs(mouseY-point[1]-canvas_y)<3)
                    {
                        temp_stroke.color=color(0, 0, 255);
                        ismouse_select=true;
                        Paras.cur_stroke_id=temp_stroke.id;
                        draw_stroke(temp_stroke);
                        return;
                    }
                }
                if(ismouse_select)
                    return;
            }
        }
    }      
    return;
}

var process_image = function(){
    ismouse_select=false;
    Paras.cur_stroke_id=-1;
    Paras.cur_stroke_ids=[];
    //判断是否已经选择了boundingbox，没有选择才可以选
    if(Paras.getObjectFid(Paras.cur_object_id)!=null){
        if(Paras.getObjectFid(Paras.cur_object_id).boundingbox==null){
            if(mouseIsPressed){
                if(!has_started_image)
                {
                    start_x=mouseX;
                    start_y=mouseY;
                    has_started_image=true;
                }
                else{
                    var dx0 = mouseX-x; // candidate for dx
                    var dy0 = mouseY-y; // candidate for dy
                    if (dx0*dx0+dy0*dy0 < 25) { // only if pen is not in same area
                        return;
                    }
                    x=mouseX;
                    y=mouseY;
                    if(Math.abs(x-start_x)>5&&Math.abs(y-start_y)>5){
                        redraw_screen();
                        stroke(color(255,0,0));
                        line(start_x,start_y,x,start_y);
                        line(start_x,start_y,start_x,y);  
                        line(x,start_y,x,y);
                        line(start_x,y,x,y);
                        return;
                    }
                }     
            }
            else{
                if(has_started_image)
                {
                    if(x>=image_x+20&&start_x>=image_x+20)
                    {
                        Paras.getObjectFid(Paras.cur_object_id).boundingbox=Paras.addboundingbox(x-image_x-20,y-image_y,start_x-image_x-20,start_y-image_y);    
                    }
                    has_started_image=false;
                }
            }
            for(var i=0;i<Paras.boundingboxs.length;i++){
                if(pointToBoundingbox(mouseX,mouseY,Paras.boundingboxs[i],3)){
                    var temp_boundingbox=$.extend({}, Paras.boundingboxs[i]);
                    temp_boundingbox.color=[255,0,0];
                    draw_boundingbox(temp_boundingbox);
                    is_boundingbox_select=true;
                    Paras.cur_boundingbox_id=i;
                    return;
                }
            }
            
        }
        else{
            redraw_screen();
            var point=pointToCorner(mouseX,mouseY,Paras.getObjectFid(Paras.cur_object_id).boundingbox);  
            if(mouseIsPressed){
                Paras.changebox(mouseX-image_x-20,mouseY-image_y,point,Paras.getObjectFid(Paras.cur_object_id).boundingbox);
            }
            return;
        }        
    } 
    // has_started=false;
    is_boundingbox_select=false;
    redraw_screen();      
}

var redraw_screen = function () {
    draw_area_line();

    if (Paras.strokes && Paras.strokes.length > 0) {
        draw_example(Paras.strokes);
    }

    if(Paras.is_show_select&&Paras.objects&& Paras.objects.length>0)
    {
        for(var i=0;i<Paras.objects.length;i++)
        {
            draw_object(Paras.objects[i]);
        }
    }

    if(Paras.boundingboxs&&Paras.boundingboxs.length>0){
        for(var i=0;i<Paras.boundingboxs.length;i++){
            draw_boundingbox(Paras.boundingboxs[i]);
        }
    }

};

var draw_area_line=function(){
    background(255,255,255,255);
    fill(255,255,255,255);
    image(img,image_x+20,image_y,image_width,image_height);

    stroke(0.25);
    strokeWeight(0.25);
    line(canvas_x,0,canvas_x,screen_height);
    line(image_x,0,image_x,screen_height);
    // line(image_x+image_width+40,0,image_x+image_width+40,screen_height);
};

var draw_boundingbox=function (boundingbox,object_color) {
    // console.log(boundingbox);
    var x1=boundingbox.x1+image_x+20;
    var y1=boundingbox.y1+image_y;
    var x2=boundingbox.x2+image_x+20;
    var y2=boundingbox.y2+image_y;
    strokeWeight(boundingbox.thickness);
    var r=boundingbox.color[0];
    var g=boundingbox.color[1];
    var b=boundingbox.color[2];
    var a=boundingbox.color[3];
    if(object_color!=null)
    {
        r=object_color[0];
        g=object_color[1];
        b=object_color[2];
        a=255;
    } 
    stroke(color(r, g, b,a));
    line(x1,y1,x2,y1);
    line(x1,y1,x1,y2);
    line(x1,y2,x2,y2);
    line(x2,y1,x2,y2);
};

var draw_stroke=function(new_stroke)
{
    var temp_stroke = new_stroke;
    strokeWeight(temp_stroke.thickness);
    //p.noStroke()
    stroke(new_stroke.color);
    for(var j=0;j+1<temp_stroke.points.length;j++)
    {
        var point=temp_stroke.points[j];
        var point_next=temp_stroke.points[j+1];
        line(point[0]+20, point[1]+canvas_y, point_next[0]+20, point_next[1]+canvas_y);
    }
}

//从保存的笔画数组中绘制所有的笔画在画板上
var draw_example = function(example) {
    //console.log(example);
    for(var i=0;i<example.length;i++) {
        // sample the next pen's states from our probability distribution
        var temp_stroke = example[i];
        strokeWeight(temp_stroke.thickness);
        //p.noStroke()
        stroke(temp_stroke.color);
        for(var j=0;j+1<temp_stroke.points.length;j++)
        {
            var point=temp_stroke.points[j];
            var point_next=temp_stroke.points[j+1];
            line(point[0]+20, point[1]+canvas_y, point_next[0]+20, point_next[1]+canvas_y);
        }
    }
};

var draw_object = function(object) {
    var temp_color=[];
    if(object.id==Paras.cur_object_id){
        temp_color=[0, 255, 0,255];
    }
    else{
        stroke(color(object.color[0],object.color[1],object.color[2],object.color[3]));
        temp_color=object.color;
    }
    if(object.boundingbox!=null)
    {
        draw_boundingbox(object.boundingbox,temp_color);
    } 
    if(!object.strokes||object.strokes.length<=0)
        return;
    var example=object.strokes; 
    stroke(color(temp_color[0],temp_color[1],temp_color[2],temp_color[3]));  
    for(var i=0;i<example.length;i++) {
        // sample the next pen's states from our probability distribution
        var temp_stroke = example[i];
        strokeWeight(temp_stroke.thickness);       
        for(var j=0;j+1<temp_stroke.points.length;j++)
        {
            var point=temp_stroke.points[j];
            var point_next=temp_stroke.points[j+1];
            line(point[0]+20, point[1]+canvas_y, point_next[0]+20, point_next[1]+canvas_y);
        }
    }
};





