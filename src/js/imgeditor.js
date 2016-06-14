// 编辑器能记录的最大操作数
var EDIT_MAX_NUM = 10;
// 图片所有图片
var allImg = $$("#img_list img");
// 层关系
var zIndex = 0;

/*
 * 图片编辑器类
 */
function ImgEditor(ele) {
  // 记录图片操作
  this.editQueue = {};
  // 存储编辑器中的图片
  this.imgObj = [];
}

/*
 * 初始化图片编辑器
 */
ImgEditor.prototype.initImgEditor = function() {
  var me = this;
  // 为每个img对象绑定鼠标点击事件
  for(var i = 0; i < allImg.length; i++){
    eventUtil.addHandler(allImg[i], "mousedown", function(e) {
      me.imgObj[i] = new Img(this);
      me.imgObj[i].initImg(e);
    }, false)
  }
};

/*
 * 保存画布
 */
ImgEditor.prototype.saveImg = function() {

};

/*
 * 重置画布（清空编辑器）
 */
ImgEditor.prototype.delEditor = function() {

};




//保存拼接图片
function saveImg(canvas){

  document.getElementById("preview_img").innerHTML="";
  var drawing = document.getElementById(canvas);

  if(drawing.getContext){
    var context = drawing.getContext("2d");
    var oImg = document.getElementById("img_list").getElementsByClassName("ofscanvas");
    context.clearRect(0,0,drawing.width,drawing.height);
    for(var i = 0;i < oImg.length;i++){
      var x, y, w, h;
      x = getLeft(oImg[i]) - getLeft(drawing);
      y = getTop(oImg[i]) - getTop(drawing);
      w = oImg[i].offsetWidth;
      h = oImg[i].offsetHeight;
      context.drawImage(oImg[i], x, y, w, h);
    }
    
    var imgURL = drawing.toDataURL("image/png", 0.9);
    var image = document.createElement("img");
    image.src = imgURL;
    document.getElementById("preview_img").appendChild(image);
  }
  
}