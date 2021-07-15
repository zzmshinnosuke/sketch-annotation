"use strict";

function myobject() {
    this.id;
    this.name='object';
    this.category="";
    this.strokes=[];
    this.integrity=-1;
    this.quality=-1;
    this.similarity=-1;
    this.direction="";
    this.boundingbox=null;
    this.color=[];
};

function mystroke() {
    this.object_id=0;
    this.id=0;
    this.color=null;
    this.thickness=1;
    this.points=[];
};


function boundingbox() {
    this.id=0;
    this.color=[];
    this.thickness=1;
    this.x1=0;
    this.y1=0;
    this.x2=0;
    this.y2=0;
}