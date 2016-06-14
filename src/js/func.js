//获取对象
function $(el){
  return document.querySelector(el);
}

function $$(el){
  return document.querySelectorAll(el);
}

// 跨浏览器事件处理程序
var eventUtil = {
  // 添加句柄
  addHandler : function (element, type, handler, boolean) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, boolean);
    }
    else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    }
    else {
      element['on' + type] = handler;
    }
  },
  // 删除句柄
  removeHandler : function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, boolean);
    }
    else if (element.detachEvent) {
      element.detachEvent('on' + type, handler);
    }
    else {
      element['on' + type] = null;
    }
  }
};

//获取元素的横坐标 
function getLeft(e){ 
  var offset=e.offsetLeft; 
  if(e.offsetParent!=null) offset+=this.getLeft(e.offsetParent); 
  return offset; 
}
//获取元素的纵坐标 
function getTop(e){ 
  var offset=e.offsetTop; 
  if(e.offsetParent!=null) offset+=this.getTop(e.offsetParent); 
  return offset; 
}