"use strict";

function MyObject() {
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

// MyObject.prototype.setId = function(id) {
//     return this.id = id;
// };

// MyObject.prototype.getId = function() {
//     return this.id;  
// };

// MyObject.prototype.setName = function(name) {
//     return this.name = name;
// };

// MyObject.prototype.getName = function() {
//     return this.name;
// };

// MyObject.prototype.setCategory = function(category) {
//     return this.category = category;
// };

// MyObject.prototype.getCategory = function() {
//     return this.category;
// };

// MyObject.prototype.setStrokes = function(strokes) {
//     return this.strokes = strokes;
// };

// MyObject.prototype.getStrokes = function() {
//     return this.strokes;
// };

// MyObject.prototype.setIntegrity = function(integrity) {
//     return this.integrity = integrity;
// };

// MyObject.prototype.getIntegrity = function() {
//     return this.integrity;
// };

// MyObject.prototype.setQuality = function(quality) {
//     return this.quality = quality;
// };

// MyObject.prototype.getQuality = function() {
//     return this.quality;
// };

// MyObject.prototype.setSimilarity = function(similarity) {
//     return this.similarity = similarity;
// };

// MyObject.prototype.getSimilarity = function() {
//     return this.similarity;
// };

// MyObject.prototype.setDirection = function(direction) {
//     return this.direction = direction;
// };

// MyObject.prototype.getDirection = function() {
//     return this.direction;
// };

// MyObject.prototype.getBoundingbox = function(boundingbox) {
//     return this.boundingbox = boundingbox;
// };

// MyObject.prototype.getBoundingbox = function() {
//     return this.boundingbox;
// };

// MyObject.prototype.setColor = function(color) {
//     return this.color = color;
// };

// MyObject.prototype.getColor = function() {
//     return this.color;
// };

// function MyStroke() {
//     this.object_id=0;
//     this.id=0;
//     this.color=null;
//     this.thickness=1;
//     this.points=[];
// };


function MyBoundingBox() {
    this.id=0;
    this.color=[];
    this.thickness=1;
    this.x1=0;
    this.y1=0;
    this.x2=0;
    this.y2=0;
}