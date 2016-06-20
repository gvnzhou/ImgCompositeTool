// 获取canvas画布，创建2d上下文
var canvas = $("#drawing"),
    context = canvas.getContext("2d");  

// 旋转按钮大小
var Selected_Round_R = 10;

/**
 *  图片类
 */
function Img(ele) {
  // 控制图片移动开关
  this.flag = false;
  // 图片节点
  this.ele = ele;
  // 声明并创建图片副本
  this.cImg = this.ele.cloneNode();
  this.cImg.className +=" sImg"; 
  this.ele.parentNode.appendChild(this.cImg);
}

/**
 *  初始化真正操作的图片
 */
Img.prototype.initImg = function(e) {
  var me = this;
  //获取图片的位置 
  var imgX = getCss(this.ele,"left");
  var imgY = getCss(this.ele,"top");
  //记录鼠标按下相对于窗口的坐标
  var dMouseX = e.clientX;
  var dMouseY = e.clientY;

  this.flag = true;
  
  ++zIndex;
  this.cImg.style.zIndex = zIndex;

  eventUtil.addHandler(this.cImg, 'mousemove', function(e) {
    if(me.flag){
      this.style.left = parseInt(imgX) + e.clientX - dMouseX + "px";
      this.style.top = parseInt(imgY) + e.clientY - dMouseY + "px"; 
    }
    e.preventDefault();
    e.stopPropagation();
  }, false);
  
  eventUtil.addHandler(this.cImg, 'mouseup', this.newOsc, false);

};

/**
 * 创建离屏canvas，初始化各种操作事件
 * @return {[type]}
 */
Img.prototype.newOsc = function() {
  var me = this;
  // 角度
  var angle = 0;
  // 缩放比例
  var scale = 1;
  // 移动判断
  var moveAble = false;
  // 旋转判断
  var rotateAble = false;

  this.flag = false;

  //鼠标放开后图片中心点在主画布里的坐标
  var cImgPosX = getLeft(this) - getLeft(canvas) + this.width/2,
      cImgPosY = getTop(this) - getTop(canvas) + this.height/2;

  // 判断拖拽图片是否在编辑区
  if(isEditArea(cImgPosX ,cImgPosY)){
    
    // 将图片画在离屏canvas上
    var res = imgInOfc(this);
    var offscreenCanvas = res.canvas;
    var offscreenContext = res.context;
    
    // 取消双击会选中canvas，产生蓝色区域问题
    canvas.onselectstart = offscreenCanvas.onselectstart = function(e) {
      return false;
    }

    eventUtil.addHandler(offscreenCanvas, 'mouseover', function(e) {
      //画旋转按钮
      drawRbtn(me,offscreenContext);
    }, false)

    eventUtil.addHandler(offscreenCanvas, 'mouseleave', function(e) {
      //删除旋转按钮
      delRbtn(this,me,offscreenContext);
    }, false)
    
    // 移动和旋转方法
    eventUtil.addHandler(offscreenCanvas, 'mousedown', function(e) {
      // 记录鼠标按下时的坐标
      var dMouseX = e.clientX;
      var dMouseY = e.clientY;
      // 记录初始离屏canvas位置
      var startOfcPosX = getCss(this,"left");
      var startOfcPosY = getCss(this,"top");
      
      flag = true;
      ++zIndex;
      this.style.zIndex = zIndex;

      // 鼠标在canvas坐标系中的坐标
      var x = e.offsetX - this.width/2;
      var y = e.offsetY - this.height/2;  
      // 转换坐标系
      var P = convertCoor(x,y,angle);
      
      rotateAble = RTIsDown(me,P.x,P.y);
      moveAble = imgIsDown(me,P.x,P.y);
      
      if (rotateAble){
        this.style.cursor = "crosshair";
      }
      if (moveAble){
        this.style.cursor = "move";
      }

      this.onmousemove = function(e){ 

        if(moveAble){
          if(flag){
            this.style.cursor = "move";
            this.style.left = parseInt(startOfcPosX) + e.clientX - dMouseX + "px";
            this.style.top = parseInt(startOfcPosY) + e.clientY - dMouseY + "px";
          } 
        } else if(rotateAble){

          //移动中的坐标
          var x = e.offsetX - this.width/2;
          var y = e.offsetY - this.height/2;

          this.style.cursor = "crosshair";
          
          var P = convertCoor(x, y, angle);

            newR = Math.atan2(P.x,-P.y);//在旋转前的canvas坐标系中 move的角度（因为旋钮在上方，所以跟，应该计算 在旋转前canvas坐标系中，鼠标位置和原点连线 与 y轴反方向的夹角）
            angle+=newR;
            
            offscreenContext.clearRect(-this.width/2,-this.height/2,this.width,this.height);
            offscreenContext.rotate(newR);
            offscreenContext.drawImage(me,-parseInt(getCss(me,"width"))/2,-parseInt(getCss(me,"height"))/2,parseInt(getCss(me,"width")),parseInt(getCss(me,"height")));
          
          drawRbtn(me,offscreenContext);  
        } 
      }
      
      this.onmouseup = function(e){ 
        flag = false;
        rotateAble = false;
        moveAble = false;
        this.style.cursor = "auto";
      }
    
    }, false)
    
  
    // 滚轮缩放
    offscreenCanvas.onmousewheel = offscreenCanvas.onwheel = function(e){
      
      var temp = this;
      
      //记录初始宽、高
      var sw = parseInt(getCss(this,"width"));
      var sh = parseInt(getCss(this,"height"));
      
      var sx = parseInt(getCss(this,"left"));
      var sy = parseInt(getCss(this,"top"));
      
      e.wheelDelta=e.wheelDelta?e.wheelDelta:(e.deltaY*(-40));
      
      if(e.wheelDelta > 0){
        
        scale = 1.2;
        
        me.style.width =  parseInt(getCss(me,"width")) * scale + "px";
        me.style.height = parseInt(getCss(me,"height")) * scale + "px";
        
        this.width = parseInt(me.style.width) * 1.45;
        this.height = parseInt(me.style.height) * 1.45;
        
        //根据图片中心缩放，位置 = 当前位置 - (画布增加的宽度)/2
        this.style.left = sx + sw/2 - parseInt(getCss(this,"width")) / 2 + "px";
        this.style.top = sy + sh/2 - parseInt(getCss(this,"height")) / 2 + "px";
        
        drawImg(temp,offscreenContext,me,angle);
        drawRbtn(me,offscreenContext);  
      }else{
        
        scale = 0.8;
        
        me.style.width = parseInt(getCss(me,"width")) * scale + "px";
        me.style.height = parseInt(getCss(me,"height")) * scale + "px";
        
        this.width = parseInt(me.style.width) * 1.45;
        this.height = parseInt(me.style.height) * 1.45;
        
        //根据图片中心缩放，位置 = 当前位置 - (画布增加的宽度)/2
        this.style.left = sx + sw/2 - parseInt(getCss(this,"width")) / 2 + "px";
        this.style.top = sy + sh/2 - parseInt(getCss(this,"height")) / 2 + "px";
  
        drawImg(temp,offscreenContext,me,angle);
        drawRbtn(me,offscreenContext);  
      }   
    }
  
  }else{
    this.parentNode.removeChild(this);
  }   
};

/**
 *  判断图片是否在可编辑区内
 */
function isEditArea(x, y) {
  return( 0 < x && x < canvas.width ) && ( y > 0 && y < canvas.height );
}

// 获取两点距离
function getPointDistance(a,b){
  var x1=a.x,y1=a.y,x2=b.x,y2=b.y;
  var dd= Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
  return dd;
}

// 判断是否在旋转按钮内
function RTIsDown(me,x,y){
  var round_center={x:0,y:-me.height/2-Selected_Round_R};
  var bool=getPointDistance({x:x,y:y},round_center)<=Selected_Round_R;
  return bool;
}
function imgIsDown(me,x,y){
  return (-me.width/2<=x && x<=me.width/2 && -me.height/2<y && y<=me.height/2);
}
// 创建离屏canvas，将图片副本绘入
function imgInOfc(img){
  //创建一个离屏canvas用来存储图片
  var offscreenCanvas = document.createElement("canvas");
  var offscreenContext = offscreenCanvas.getContext("2d");
  
  offscreenCanvas.className +=" ofscanvas";
  offscreenCanvas.width = img.width*1.5;
  offscreenCanvas.height = img.height*1.5;

  offscreenContext.translate(offscreenCanvas.width/2,offscreenCanvas.height/2);
  
  //将图片画入离屏canvas
  offscreenContext.drawImage(img,-img.width/2,-img.height/2,img.width,img.height);
  
  //旋转点击区域
  drawRbtn(img, offscreenContext);
  
  //将离屏canvas添加到文档流
  img.parentNode.appendChild(offscreenCanvas);
  
  //纠正离屏canvas位置
  offscreenCanvas.style.position = "absolute";
  offscreenCanvas.style.left= getCss(img,"left");
  offscreenCanvas.style.top= getCss(img,"top");

  //隐藏cImg
  img.style.visibility = "hidden";
  
  return {canvas:offscreenCanvas,context:offscreenContext};
}
// 将坐标转换为以图片为中心的坐标
function convertCoor(x,y,angle){
  if(angle!=0){
    var len = Math.sqrt(x*x + y*y);
    var oldR=Math.atan2(y,x);//屏幕坐标系中 PO与P点连线 与屏幕坐标系X轴的夹角弧度            
    var newR =oldR-angle;//canvas坐标系中PO与P点连线 与canvas坐标系x轴的夹角弧度
    x = len*Math.cos(newR);
    y = len*Math.sin(newR);     
  } 
  return {x:x,y:y};
}
// 绘制旋转按钮
function drawRbtn(me,offscreenContext){
  offscreenContext.beginPath();
  offscreenContext.arc(0, -me.height/2-Selected_Round_R, Selected_Round_R, 0, 2*Math.PI);
  offscreenContext.closePath();
  offscreenContext.strokeStyle="#FF0000";
  offscreenContext.stroke();
}
// 删除旋转按钮
function delRbtn(temp,me,offscreenContext){
  offscreenContext.clearRect(-temp.width/2,-temp.height/2,temp.width,(temp.height - me.height)/2);
}
// 绘制图形
function drawImg(temp,offscreenContext,me,angle){
  offscreenContext.translate(temp.width/2,temp.height/2);
  offscreenContext.clearRect(-temp.width/2,-temp.height/2,temp.width,temp.height);
  offscreenContext.rotate(angle); 
  offscreenContext.drawImage(me,-parseInt(getCss(me,"width"))/2,-parseInt(getCss(me,"height"))/2,parseInt(getCss(me,"width")),parseInt(getCss(me,"height")));
}

