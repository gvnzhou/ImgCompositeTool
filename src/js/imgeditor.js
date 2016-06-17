// 编辑器能记录的最大操作数
var EDIT_MAX_NUM = 10;
;
// 层关系
var zIndex = 0;

/*
 * 图片编辑器
 */
var imgEditor = (function() {

  // 记录图片操作
  var editQueue = {};
  // 存储编辑器中的图片
  var imgObj = [];
  // 编辑器中图片数量
  var imgNum = 0;
  // 保存图片按钮
  var saveImg = $('#saveimg');

  return {
    initImgEditor: function (){
      // 图片所有图片
      var allImg = $$("#img_list .drag-img");
      var allDelIcon = $$("#img_list .del-icon");
      var imgBlock = $$(".upload-img");

      var imgList = $('#img_list');


      // 监听图片按下事件
      // eventUtil.addHandler(imgList, 'mousedown', function(e) {

      //   if (e.target.nodeName.toLowCase() === 'img') {

      //     imgObj.push(e.target);

      //   }

      // }, false);

      for(var i = 0; i < allImg.length; i++){

        (function(j) {
          // 为每个img对象绑定鼠标点击事件
          allImg[j].onmousedown = function(e) {
            imgObj[j] = new Img(this);
            imgObj[j].initImg(e);
          }
          // 为每个img对象绑定删除事件
          imgBlock[j].onmouseover = function(e) {
            allDelIcon[j].style.display = "block";
          }
          // 为每个img对象绑定删除事件
          allImg[j].onmouseleave = function(e) {
            allDelIcon[j].style.display = "none";
          }

        }(i));
        
      }
      this.initToolBar();

    },
    // 初始化工具条
    initToolBar: function() {
      var me = this;
      eventUtil.addHandler(saveImg, 'click', function(e) {
        me.saveImg('drawing');
      }, false);
    },

    // 保存拼接图片
    saveImg: function(canvas) {
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

  }
}());
