'use strict';
/**
 * Initialization of all components
 */


window.onload =function () {
	
	layout.init(); 

	layout.addButtonEvents();
    if(Apollo.review>0){
        //审核模式下，直接加载物体
        layout.load();
    }
    else{
        //开始先添加一个物体
        Paras.addobject();
        layout.updateobjects();
        layout.refresh();
    }
	
    if(Apollo.review>0)
    {
        document.getElementById("scene_review").innerHTML = "Scene  "+Apollo.task+"   Review";
        document.getElementById("scene_review").style="color:red";
    }
}
