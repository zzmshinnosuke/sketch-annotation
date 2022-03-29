'use strict';
var Layout = function () {
};

Layout.prototype.init = function () {
	this.nextbtn = $("#next");
    this.previousbtn = $("#previous");
    this.loadbtn = $("#load");
    this.savebtn = $("#save");
    
    this.addbtn=$('#add_object');

    this.objectsSelect=$('#objects');

    this.deleteObjectbtn=$('#delete_object');

    this.delboxbtn=$('#del_box');
    this.cancleboxbtn=$('#cancle_box');
    
    this.lbl_cur = $('#lbl_cur');
    this.lbl_all = $('#lbl_all');

    if(Apollo.sketch.strokes)
    {
        Paras.strokes=Apollo.sketch.strokes;  
    }

    var boxs=Apollo.boxs.split('#');
    for(var i=0;i<boxs.length;i++){
        if(boxs[i]!=""){
            var bb=new MyBoundingBox();
            var lis=boxs[i].split(',');
            for(var j=0;j<lis.length;j++)
            {
                bb.x1=parseFloat(lis[0]);
                bb.y1=parseFloat(lis[1]);
                bb.x2=parseFloat(lis[0])+parseFloat(lis[2]);
                bb.y2=parseFloat(lis[1])+parseFloat(lis[3]);
                bb.id=lis[4];
            }
            bb.color=[0,0,0,255];
            Paras.boundingboxs.push(bb);
        } 
    }  
    this.update_all_strokes();
    this.updateforeground();
    this.updatebackground();
};

Layout.prototype.load = function (_task = -1) {
    var _backup = 0;  
    if (_task == -1) {
        _task = Apollo.task;
        Apollo.backup = null;
    } else {
        _backup = 1;
        Apollo.backup = _task;
    }
    var postData = {
        load: 1,
        task: _task,
        review:Apollo.review,
        backup: _backup,
    };
    $.ajax({
        type: "POST",
        url: Apollo.baseUrl,
        data: postData,
        success: function (data, status, jqXHR) {
            
            if (data === "0")
                return;
            var list = JSON.parse(data);
            if (list.length == 0)
                return;
            Paras.objects=list["objects"];
            if(Paras.objects.length>0)
            {
                Paras.strokes=[];
                Paras.setCurObjectId(Paras.objects[0].id);
            }
            for(var i=0;i<Paras.objects.length;i++){
                for(var j=0;j<Paras.boundingboxs.length;j++)
                {
                    if(Paras.objects[i].boundingbox!=null&&Paras.objects[i].boundingbox.id==Paras.boundingboxs[j].id)
                    {
                        Paras.boundingboxs.splice(j,1);
                    }
                }
            }
            layout.refresh();
        },
        error: function (data, status, jqXHR) {
            alert('fail');
        },
    }); 
}

Layout.prototype.submit = function () {
    var d = new Date();
    Apollo.suffix = d.toLocaleDateString().toString().replace('/', "_").replace('/', "_")  + "_" + d.toLocaleTimeString().replace(":", "_").replace(":", "_").replace(" ", "");
    var result=JSON.stringify({"reference":Apollo.sketch.reference, "resolution":Apollo.sketch.resolution, "scene":Apollo.sketch.scene, "drawer":Apollo.sketch.drawer, "objects":Paras.objects});
    var md5_verify=md5(result);
    var postData = {
        task: Apollo.task,
        save: 1,
        suffix: Apollo.suffix,
        md5: md5_verify,
        review: Apollo.review,
        json: result,
    };
    $.ajax({
        type: "POST",
        url: Apollo.baseUrl,
        data: postData,
        success: function (data, status, jqXHR) {
            if(data==md5_verify)
                alert("success");
            else
                alert("please save again!");
        },
        error: function (data, status, jqXHR) {
            console.log(data);
            alert("false");
        },
    });   
}

Layout.prototype.addButtonEvents = function () {
	this.nextbtn.click(function () {
		var task=Apollo.task+1;
        if (task <= 0 || task >= 1e5)
		    return;
        if(Apollo.review>0)
            window.location.href = Apollo.baseUrl + "?review=" + Apollo.review+ "&&task=" + task;
        else
            window.location.href = Apollo.baseUrl + "?task=" + task;
	});

	this.previousbtn.click(function () {
        var task=Apollo.task-1;
        if (task <= 0 || task >= 1e5)
            return;
        if(Apollo.review>0)
            window.location.href = Apollo.baseUrl + "?review=" + Apollo.review+ "&&task=" + task;
        else
            window.location.href = Apollo.baseUrl + "?task=" + task;
    });
    
    this.addbtn.click(function () {
        if(Paras.addobject()){
            layout.updateobjects();
            layout.refresh();
        }
    });  

    this.deleteObjectbtn.click(function () {
        Paras.deleteobject(Paras.getCurObjectId());
        layout.refresh();
    });  

	this.savebtn.click(function () {
		if(Paras.allowSave()) {
			layout.submit();
		} 
	});

	this.loadbtn.click(function () {
        if(Paras.objects.length>0)
        {
            alert("Please delete all objects");
            return;
        }
		layout.load();
    });

    this.delboxbtn.click(function () {
        Paras.delete_box();
    });

    this.cancleboxbtn.click(function () {
        Paras.cancle_box();
    });

    $("#stroke_delete").change(function () {
        if($("#stroke_delete").get(0).checked ==true)
        {          
            Paras.is_stroke_delete=true;
            document.getElementById("defaultCanvas0").style.cursor = "url("+Apollo.publicUrl + 'css/images/eraser.png'+") 0 0,pointer";
        }
        else{
            Paras.is_stroke_delete=false;
            document.getElementById("defaultCanvas0").style.cursor = "";
        }
    });
    
    $("#cb_cur").change(function () {
        if($("#cb_cur").get(0).checked == true)
        {          
            Paras.is_show_cur_obj = true;
        }
        else{
            Paras.is_show_cur_obj = false;
        }
    });
    
    $("#cb_useless").change(function () {
        if($("#cb_useless").get(0).checked == true)
        {          
            Paras.is_show_useless = true;
        }
        else{
            Paras.is_show_useless = false;
        }
    });
    
    $("#cb_reference").change(function () {
        if($("#cb_reference").get(0).checked == true)
        {          
            Paras.is_show_reference = true;
        }
        else{
            Paras.is_show_reference = false;
        }
    });

    $("#integrity").change(function() {
        var integrity=parseInt($("#integrity").val());
        Paras.setIntegrity(integrity);
    });

    $("#similarity").change(function() {
        var similarity=parseInt($("#similarity").val());
        Paras.setSimilarity(similarity);
    });

    $("#objects").change(function() {
        Paras.setCurObjectId(parseInt($("#objects").val()));
        console.log("curent object is:" + Paras.getCurObject().name, "  curent objectid is:" + Paras.getCurObjectId());
        layout.refresh();
    });

    $("#foreground").change(function() {
        var foreground=$("#foreground").val();
        if(foreground!=""){
            Paras.setCategory(foreground);
        }
        // alert("background");
        layout.updateobjects();
        layout.updatebackground();
        layout.updateLevel();
        layout.updateStrokes();
    }); 

    $("#background").change(function() {
        var background=$("#background").val();
        layout.updateLevel();
        if(background!=""){
            Paras.setCategory(background);
            if(background=="useless"){
                $("#integrity").val(0);
                $("#integrity").change();
                $("#similarity").val(0);
                $("#similarity").change();
                $("#quality").val(0);
                $("#quality").change();
            }
            $("#direction").val("n");//背景无方向
            $("#direction").change();
        }
        layout.updateobjects();
        layout.updateforeground();
        layout.updateStrokes();
    }); 

    $("#direction").change(function() {
        var direction=$("#direction").val();
        if(direction!=""){
            Paras.setDirection(direction);
        }
    }); 
    
    $("#quality").change(function() {
        var quality=$("#quality").val();
        if(quality!=""){
            Paras.setQuality(quality);
        }
    }); 
};

Layout.prototype.update_all_strokes = function () {
	$("#all_strokes").html("");
	for (var i = 0; i < Paras.strokes.length; ++i) {
		$("#all_strokes").append("<option id=" + '"' + "stroke" + '"' + ">" + 'stroke ' + Paras.strokes[i].id + "</option>");
	}
};

Layout.prototype.update_select_strokes = function () {
    $("#select_strokes").html("");
    var obj = Paras.getCurObject();
    if(null != obj){
        for (var i = 0; i < obj.strokes.length; ++i) {
            $("#select_strokes").append("<option id=" + '"' + "stroke" + '"' + ">" + 'stroke' + obj.strokes[i].id + "</option>");
        }
    }
};

Layout.prototype.updateobjects = function () {
	$("#objects").html("");
	for (var i = 0; i < Paras.objects.length; ++i) {
		$("#objects").append("<option value="+'"'+Paras.objects[i].id+'"'+">" + Paras.objects[i].name + "</option>");
    }
    if(Paras.getCurObjectId() != -1)
    {
        $("#objects").val(Paras.getCurObjectId());
    }
};

Layout.prototype.updateforeground= function() {
    $("#foreground").html("");
    $("#foreground").append("<option value="+'"'+""+'"'+">"+'foreground' + "</option>");
	for (var i = 0; i < Paras.foreground.length; ++i) {
		$("#foreground").append("<option value="+'"'+Paras.foreground[i]+'"'+">" + Paras.foreground[i] + "</option>");
    }
    if(Paras.getCurObjectId() != -1)
    {
        $("#foreground").val(Paras.getCurObject().category);
    }
};

Layout.prototype.updatebackground= function() {
    $("#background").html("");
    $("#background").append("<option value="+'"'+""+'"'+">"+'background' + "</option>");
	for (var i = 0; i < Paras.background.length; ++i) {
		$("#background").append("<option value="+'"'+Paras.background[i]+'"'+">" + Paras.background[i] + "</option>");
    }
    if(Paras.getCurObjectId() != -1)
    {
        $("#background").val(Paras.getCurObject().category);
    }
};

Layout.prototype.updateLevel=function(){
    $("#integrity").val(-1);
    $("#integrity").change();
    $("#similarity").val(-1);
    $("#similarity").change();
    $("#quality").val(-1);
    $("#quality").change();
    $("#direction").val(-1);//背景无方向
    $("#direction").change();
};

Layout.prototype.updateStrokes=function(){
    if(Paras.getCurObject() != null){
        this.lbl_cur.html("cur_num:" + Paras.getCurObject().strokes.length);
    }
    else{
        this.lbl_cur.html("cur_num:" + 0);
    }
    this.lbl_all.html("all_num:" + Paras.get_all_strokes_num(false));
};

Layout.prototype.refresh = function () {
    this.updateobjects();
    this.update_all_strokes();
    this.update_select_strokes();
    this.updateforeground();
    this.updatebackground();
    this.updateStrokes();

    if(Paras.getCurObjectId() != -1)
    {
        $("#integrity").val(Paras.getCurObject().integrity + "");
        $("#similarity").val(Paras.getCurObject().similarity + "");
        $("#direction").val(Paras.getCurObject().direction + "");
        $("#quality").val(Paras.getCurObject().quality + "");
    }
};

var layout=new Layout();