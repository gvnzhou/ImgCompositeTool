// 编辑器能记录的最大操作数
var EDIT_MAX_NUM = 10;
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

  // 编辑器中图片数量imgNum+1
  var imgNum = 3;
  // 保存图片按钮
  var saveImg = $('#saveimg');

  return {
    initImgEditor: function (){
      var me = this;
      // 拖拽图片
      var allImg = $$("#img_list .drag-img"); 
      // 删除图标
      var allDelIcon = $$("#img_list .del-icon");
      // 所有上传区域
      var imgBlock = $$(".upload-img");
      // 图片区域
      var imgList = $('#img_list');

      // 监听鼠标按下事件
      eventUtil.addHandler(imgList, 'mousedown', function(e) {
        // 按下图片，初始化图片。
        if (e.target.className.toLowerCase() === 'drag-img') {
          var dataNum = e.target.parentNode.getAttribute('data-num');
          imgObj[dataNum] = new Img(e.target);
          imgObj[dataNum].initImg(e);
        }

        // 按下删除图标，删除图片。
        if (e.target.getAttribute('data-icon') && e.target.getAttribute('data-icon') === 'del') {
          e.target.parentNode.style.overflow = 'hidden';
          e.target.parentNode.innerHTML = '<i class="icon-plus-sign-alt icon-5x" data-icon="upload"></i><input type="file" class="file_input" />';
        }
      }, false);


      // 监听鼠标悬停事件
      eventUtil.addHandler(imgList, 'mouseover', function(e) {
        if (e.target.className.toLowerCase() === 'drag-img') {
          var nodeList = e.target.parentNode.childNodes;
          // 遍历节点，找到删除图标
          for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].nodeName.toLowerCase() === 'i') {
              nodeList[i].style.display = "block";
            }
          }
        }
      }, false);

      // 监听鼠标离开事件
      for(var i = 0; i < imgBlock.length; i++) {
        eventUtil.addHandler(imgBlock[i], 'mouseleave', function(e) {
          var nodeList = e.target.childNodes;
          var reg = /del-icon/;
          // 遍历节点，找到删除图标
          for (var i = 0; i < nodeList.length; i++) {
            if (reg.test(nodeList[i].className)) {
              nodeList[i].style.display = "none";
            }
          }
        }, true);
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
