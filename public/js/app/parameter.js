'use strict';

var Parameters = function () {
    this.cur_object_id = -1;
    this.objects = [];
    this.cur_object = null;

    this.categories = [];

    this.strokes = [];
    this.cur_stroke_id = -1; //点选笔画记录，只记录一个
    this.cur_stroke_ids = [];//框选笔画记录，记录框内所有的
    this.cur_boundingbox_id = -1;//图片boundingbox记录，记录数组序号

    this.boundingboxs = []; //coco的原来标注的boundingbox

    this.is_stroke_delete = false;//取消标注完的笔画模式
    
    this.is_show_cur_obj = false; //true只显示当前物体，false显示全部物体
    this.is_show_useless = true; //true显示useless类别，false不显示useless类别
    this.is_show_reference = false; //是否显示参考图像，默认不显示
};
 
//通过物体id获取该物体的引用
Parameters.prototype.getObjectFid = function(object_id) {
	for(var i = 0; i < this.objects.length; ++i) {
		var item = this.objects[i]; 
		if (item.id === object_id) {
			return item;
		}
	}
	return null;
};

// 得到当前物体的id
Parameters.prototype.getCurObjectId = function() {
	return this.cur_object_id;
};

// 得到当前物体引用
Parameters.prototype.getCurObject = function() {
    if(this.getCurObjectId() == -1){
        return null;
    }
    if(this.cur_object && this.cur_object.id === this.getCurObjectId()){
        return this.cur_object;
    }
    this.cur_object = this.getObjectFid(this.getCurObjectId())
	return this.cur_object;
};

//设置当前正在标注物体的id
Parameters.prototype.setCurObjectId = function (object_id) {
    if(this.getCurObjectId() == object_id){
        return false;
    }
    var obj = this.getCurObject();
    if(null != obj){
        if(obj.category == ""){
            alert("please choose foreground or background!");
            return  false;
        }
        if(obj.integrity == -1){
            alert("please choose integrity!");
            return  false;
        }
        if(obj.similarity == -1){
            alert("please choose similarity!");
            return  false;
        }
        if(obj.strokes.length == 0){
            alert("please add stroke!");
            return  false;
        }
        if(obj.quality == -1){
            alert("please add quality!");
            return  false;
        }
        if(obj.direction == -1){
            alert("please add direction!");
            return  false;
        }
        if(this.foreground.includes(obj.category) && obj.boundingbox == null){
            alert("please add boundingbox!");
            return  false;
        }    
    }
    this.cur_object_id = object_id;
    this.cur_object = this.getCurObject();
    return true;
};

//创建一个新的物体时的笔画id
Parameters.prototype.getNewObjectId = function () {
    var id = 0;
    while(true){
        var flag = true;
        for(var i=0; i < this.objects.length; i++){
            if(id == this.objects[i].id)
                flag = false;
        }
        if(flag){
            return id;
        }
        id++;
    }
};

//创建一个新的物体
Parameters.prototype.addobject = function () {
    var new_object=new MyObject();
    new_object.id=this.getNewObjectId();
    new_object.name="object" + new_object.id;
    if(!this.setCurObjectId(new_object.id))
    {
        return false;
    }
    var r = parseInt(random(64, 224));
    var g = parseInt(random(64, 224));
    var b = parseInt(random(64, 224));
    new_object.color = [r, g, b, 128];
    this.objects.push(new_object);
    return true;
};

//删除当前物体
Parameters.prototype.deleteobject = function(object_id)
{
    for (var j = 0; j < this.objects.length; j++)
    {
        if(this.objects[j].id == object_id)
        {
            this.delete_box();
            for(var i=0; i < this.objects[j].strokes.length; i++)
            {
                this.strokes.push(this.objects[j].strokes[i]);
            }
            this.objects.splice(j, 1);
            this.cur_object = null;
            console.log("delete object:" + object_id);
            if(this.objects.length >= 1)
            {
                if(j >= 1){
                    this.setCurObjectId(this.objects[j-1].id);
                }
                else{ 
                    this.setCurObjectId(this.objects[0].id);
                }
            }  
            else{
                this.setCurObjectId(-1);
            } 
            return true;
        }
    }
    alert("object don't exit!");
    return false;
};

Parameters.prototype.setCategory = function(category) {
    var obj = this.getCurObject();
    if(null != obj){
        obj.category = category;
        obj.name = category + obj.id;
        return true;
    }
    return false;
};

Parameters.prototype.setIntegrity = function(Integrity) {
    var obj = this.getCurObject();
    if(null != obj){
        obj.integrity = Integrity;
        return true;
    }
    return false;
};

Parameters.prototype.setSimilarity = function(Similarity) {
    var obj = this.getCurObject();
    if(null != obj){
        obj.similarity = Similarity;
        return true;
    }
    return false;
};

Parameters.prototype.setDirection = function(Direction) {
    var obj = this.getCurObject();
    if(null != obj){
        obj.direction = Direction;
        return true;
    }
    return false;
};

Parameters.prototype.setQuality = function(Quality){
    var obj = this.getCurObject();
    if(null != obj){
        obj.quality=Quality;
        return true;
    }
    return false;
}

Parameters.prototype.addboundingbox = function(x1,y1,x2,y2) {
    if(((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) < 200)
    {
        return null;
    }
    var box=new MyBoundingBox();
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

Parameters.prototype.setBoundingboxId = function(BoxId) {
    var obj = this.getCurObject();
    if(null != obj){
        obj.boundingbox = this.boundingboxs[BoxId];
        obj.boundingbox.color = obj.color;
        this.boundingboxs.splice(BoxId, 1);
        return true;
    }
    return false;
};

Parameters.prototype.cancle_box= function() {
    var obj = this.getCurObject();
    if(null != obj){
        if(obj.boundingbox != null){
            console.log("move back boundingbox:", obj.boundingbox.id);
            obj.boundingbox.color=[0, 0, 0, 255];
            this.boundingboxs.push(obj.boundingbox);
            obj.boundingbox = null;
            return true;
        }
    }
    return false;
};

Parameters.prototype.delete_box= function() {
    var obj = this.getCurObject();
    if(null != obj){
        if(obj.boundingbox != null)
        {
            if(obj.boundingbox.id != 0){
                obj.boundingbox.color=[0, 0, 0, 255];
                this.boundingboxs.push(obj.boundingbox);
            }
            console.log("del boundingbox:", obj.boundingbox.id);
            obj.boundingbox = null;
            return true;
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


//标注笔画，也就是将笔画移入某个物体中
Parameters.prototype.get_all_strokes_num=function(useless)
{
    var len=0;
    for (var i=0; i<this.objects.length; i++){
        if(!useless && this.objects[i].category == "useless"){
            continue;
        }
        else{
            len += this.objects[i].strokes.length;
        }
    }
    len+=this.strokes.length;
    return len;
};

//标注笔画，也就是将笔画移入某个物体中
Parameters.prototype.movestroke=function(stroke_id, object_id)
{
    var stroke = null;
    for(var i = 0; i < this.strokes.length; i++)
    {
        if(this.strokes[i].id == stroke_id)
        {
            stroke = this.strokes[i];
            break;
        }
    }
    for (var j=0; j<this.objects.length; j++)
    {
        if(this.objects[j].id == object_id && stroke != null)
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
Parameters.prototype.movestrokeback=function(stroke_id, object_id)
{
    for (var j = 0; j < this.objects.length; j++){
        if(this.objects[j].id == object_id){
            var object = this.objects[j];
            for(var i = 0; i < object.strokes.length; i++){
                var stroke = object.strokes[i];
                if(stroke_id == stroke["id"]){
                    object.strokes.splice(i, 1);
                    this.strokes.push(stroke);
                    console.log("move: stroke" + stroke_id + " to: strokes");
                    return true; 
                }
            }
        }
    }
    return false;
};

//判断是否可以保存
Parameters.prototype.allowSave=function(object_id)
{
    if(this.strokes.length > 0){
        alert("There are strokes No Label");
        return false;
    }
    for (var j = 0; j < this.objects.length; j++){
        if(this.objects[j].category == ""){
            alert(this.objects[j].name + " not label category");
            return false;
        }

        if(this.objects[j].strokes.length == 0){
            alert(this.objects[j].name + " not has stokes");
            return false;
        }

        if(this.objects[j].integrity == -1){
            alert(this.objects[j].name + " not label integrity");
            return false;
        }

        if(this.objects[j].similarity == -1){
            alert(this.objects[j].name + " not label similarity");
            return false;
        }

        if(this.objects[j].direction == -1){
            alert(this.objects[j].name + " not label direction");
            return false;
        }

        if(this.objects[j].quality == -1){
            alert(this.objects[j].name + " not label quality");
            return false;
        }
        
        if(this.foreground.includes(this.objects[j].category) && this.objects[j].boundingbox == null){
            alert(this.objects[j].name + " not label boundingbox");
            return  false;
        }
    }
    return true;
};

Parameters.prototype.isInArray=function(arr, value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i].id){
            return true;
        }
    }
    return false;
}


var Paras = new Parameters();