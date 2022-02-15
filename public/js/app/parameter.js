'use strict';

var Parameters = function () {
    this.cur_object_id=-1;
    this.objects=[];

    this.categories=[];

    this.strokes=[];
    this.cur_stroke_id=-1; //点选笔画记录，只记录一个
    this.cur_stroke_ids=[];//框选笔画记录，记录框内所有的
    this.cur_boundingbox_id=-1;//图片boundingbox记录，记录数组序号

    this.boundingboxs=[]; //coco的原来标注的boundingbox

    this.is_show_select=true;//是否显示已经标注物体的笔画

    this.is_stroke_delete=false;//取消标注完的笔画模式
};
 
//通过物体id获取该物体的引用
Parameters.prototype.getObjectFid = function (object_id) {
	for (var i = 0; i < Paras.objects.length; ++i) {
		var item = Paras.objects[i]; 
		if (item.id === object_id) {
			return item;
		}
	}
	return null;
};

Parameters.prototype.setCategory = function (category) {
    for(var i=0;i<Paras.objects.length;i++){
        if(Paras.objects[i].id==this.cur_object_id){
            Paras.objects[i].category=category;
            Paras.objects[i].name=category+Paras.objects[i].id;
            return true;
        }
    }
    return false;
};


Parameters.prototype.setIntegrity = function (Integrity) {
    for(var i=0;i<Paras.objects.length;i++){
        if(Paras.objects[i].id==this.cur_object_id){
            Paras.objects[i].integrity=Integrity;
            return true;
        }
    }
    return false;
};

Parameters.prototype.setSimilarity = function (Similarity) {
    for(var i=0;i<Paras.objects.length;i++){
        if(Paras.objects[i].id==this.cur_object_id){
            Paras.objects[i].similarity=Similarity;
            return true;
        }
    }
    return false;
};

Parameters.prototype.setDirection = function (Direction) {
    for(var i=0;i<Paras.objects.length;i++){
        if(Paras.objects[i].id==this.cur_object_id){
            Paras.objects[i].direction=Direction;
            return true;
        }
    }
    return false;
};

Parameters.prototype.setQuality = function (Quality){
    for(var i=0;i<Paras.objects.length;i++){
        if(Paras.objects[i].id==this.cur_object_id){
            Paras.objects[i].quality=Quality;
            return true;
        }
    }
    return false; 
}

Parameters.prototype.addboundingbox = function (x1,y1,x2,y2) {
    if(((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))<200)
    {
        return null;
    }
    var box=new boundingbox();
    if(x1<x2){
        box.x1=x1;
        box.x2=x2;
    }
    else{
        box.x2=x1;
        box.x1=x2;
    }
    if(y1<y2){
        box.y1=y1;
        box.y2=y2;
    }
    else{
        box.y2=y1;
        box.y1=y2;
    }
    return box;
};

Parameters.prototype.setBoundingboxId = function (BoxId) {
    for(var i=0;i<Paras.objects.length;i++){
        if(Paras.objects[i].id==this.cur_object_id){
            Paras.objects[i].boundingbox=Paras.boundingboxs[BoxId];
            Paras.objects[i].boundingbox.color=Paras.objects[i].color;
            Paras.boundingboxs.splice(BoxId,1);
            return true;
        }
    }
    return false;
};

Parameters.prototype.cancle_box= function() {
    for(var i=0;i<Paras.objects.length;i++){
        if(Paras.objects[i].id==this.cur_object_id){
            if(Paras.objects[i].boundingbox!=null)
            {
                console.log("move back boundingbox:",Paras.objects[i].boundingbox.id);
                Paras.objects[i].boundingbox.color=[0,0,0,255];
                Paras.boundingboxs.push(Paras.objects[i].boundingbox);
                Paras.objects[i].boundingbox=null;
                return true;
            }
        }
    }
};

Parameters.prototype.delete_box= function() {
    for(var i=0;i<Paras.objects.length;i++){
        if(Paras.objects[i].id==this.cur_object_id){
            if(Paras.objects[i].boundingbox!=null&&Paras.objects[i].boundingbox.id==0)
            {
                console.log("del boundingbox:",Paras.objects[i].boundingbox.id);
                Paras.objects[i].boundingbox=null;
                return true;
            }
        }
    }
};

Parameters.prototype.changebox= function(x,y,point,boundingbox) {
    if(point==1){
        boundingbox.x1=x;
        boundingbox.y1=y;
    }
    else if(point==2){
        boundingbox.x2=x;
        boundingbox.y1=y;
    }
    else if(point==3){
        boundingbox.x1=x;
        boundingbox.y2=y;
    }
    else if(point==4){
        boundingbox.x2=x;
        boundingbox.y2=y;
    }
};


//创建一个新的物体时的笔画id
Parameters.prototype.getNewObjectId = function () {
    var id=0;
    while(true)
    {
        var flag=true;
        for(var i=0;i<Paras.objects.length;i++){
            if(id==Paras.objects[i].id)
                flag=false;
        }
        if(flag)
            return id;
        id++;
    }
};

//创建一个新的物体
Parameters.prototype.addobject = function () {
    var new_object=new myobject();
    new_object.id=this.getNewObjectId();
    new_object.name="object"+new_object.id;
    if(!this.set_cur_object_id(new_object.id))
    {
        return false;
    }
    var r = parseInt(random(64, 224));
    var g = parseInt(random(64, 224));
    var b = parseInt(random(64, 224));
    new_object.color = [r,g,b,128];
    this.objects.push(new_object);
    return true;
};

//设置当前正在标注物体的id
Parameters.prototype.set_cur_object_id = function (object_id) {
    if(this.cur_object_id==object_id)
    {
        return false;
    }      
    else{
        for(var i=0;i<Paras.objects.length;i++){
            if(Paras.objects[i].id==this.cur_object_id){
                
                if(Paras.objects[i].category==""){
                    alert("please choose foreground or background!");
                    return  false;
                }
                if(Paras.objects[i].integrity==-1){
                    alert("please choose integrity!");
                    return  false;
                }
                if(Paras.objects[i].similarity==-1){
                    alert("please choose similarity!");
                    return  false;
                }
                if(Paras.objects[i].strokes.length==0){
                    alert("please add stroke!");
                    return  false;
                }
                if(Paras.objects[i].quality==-1){
                    alert("please add quality!");
                    return  false;
                }
                if(Paras.objects[i].direction==-1){
                    alert("please add direction!");
                    return  false;
                }
                if(Paras.foreground.includes(Paras.objects[i].category)&&Paras.objects[i].boundingbox==null){
                    alert("please add boundingbox!");
                    return  false;
                }
                
            }
        }
    }
    this.cur_object_id=object_id;
    return true;
};

//标注笔画，也就是将笔画移入某个物体中
Parameters.prototype.movestroke=function(stroke_id,object_id)
{
    var stroke=null;
    for(var i=0;i<this.strokes.length;i++)
    {
        if(this.strokes[i].id==stroke_id)
        {
            stroke=this.strokes[i];
            break;
        }
    }
    for (var j=0;j<this.objects.length;j++)
    {
        if(this.objects[j].id==object_id&&stroke!=null)
        {
            this.strokes.splice(i,1);
            this.objects[j].strokes.push(stroke);
            console.log("move: stroke"+stroke_id+" to: object"+object_id);
            return true;
        }
    }
    alert("Please add a object!");
    return false;
};

//将笔画从某个物体中删除
Parameters.prototype.movestrokeback=function(stroke_id,object_id)
{
    for (var j=0;j<this.objects.length;j++)
    {
        if(this.objects[j].id==object_id)
        {
            var object=this.objects[j];
            for(var i=0;i<object.strokes.length;i++)
            {
                var stroke=object.strokes[i];
                if(stroke_id==stroke["id"]){
                    object.strokes.splice(i,1);
                    this.strokes.push(stroke);
                    console.log("move: stroke"+stroke_id+" to: strokes");
                    return true; 
                }
                
            }
        }
    }
    return false;
};

//删除当前物体
Parameters.prototype.deleteobject=function(object_id)
{
    for (var j=0;j<this.objects.length;j++)
    {
        if(this.objects[j].id==object_id)
        {
            this.delete_box();
            for(var i=0;i<this.objects[j].strokes.length;i++)
            {
                this.strokes.push(this.objects[j].strokes[i]);
            }
            this.objects.splice(j,1);
            console.log("delete object:"+object_id);
            if(this.objects.length>=1)
            {
                if(j>1){
                    this.cur_object_id=this.objects[j-1].id;
                }
                else{ }
            }  
            else{
                this.cur_object_id=-1;
                this.cur_object=null
            }
                    this.cur_object_id=this.objects[0].id;
               
                
            return true;
        }
    }
    alert("object don't exit!");
    return false;
};

//判断是否保存
Parameters.prototype.allowSave=function(object_id)
{
    if(this.strokes.length>0)
    {
        alert("There are strokes No Label");
        return false;
    }
    for (var j=0;j<this.objects.length;j++)
    {
        if(this.objects[j].category=="")
        {
            alert(this.objects[j].name+" not label category");
            return false;
        }

        if(this.objects[j].strokes.length==0)
        {
            alert(this.objects[j].name+" not has stokes");
            return false;
        }

        if(this.objects[j].integrity==-1)
        {
            alert(this.objects[j].name+" not label integrity");
            return false;
        }

        if(this.objects[j].similarity==-1)
        {
            alert(this.objects[j].name+" not label similarity");
            return false;
        }

        if(this.objects[j].direction==-1)
        {
            alert(this.objects[j].name+" not label direction");
            return false;
        }

        if(this.objects[j].quality==-1)
        {
            alert(this.objects[j].name+" not label quality");
            return false;
        }
        // console.log(Paras.foreground.includes(Paras.objects[j].category));
        if(Paras.foreground.includes(Paras.objects[j].category)&&this.objects[j].boundingbox==null){
            alert(this.objects[j].name+" not label boundingbox");
            return  false;
        }
    }
    return true;
};

Parameters.prototype.isInArray=function(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i].id){
            return true;
        }
    }
    return false;
}


var Paras = new Parameters();