/**
 * 图片上传
 * @param {[type]}
 */
var uploadImg = (function() {

  var imgList = $('#img_list');

  return {
    /**
     * 初始化上传按钮
     * @param  提交按钮
     */
    initUploadBtn : function() {
      var me = this;
      // 监听上传按钮
      eventUtil.addHandler(imgList, 'change', function(e) {
        if (e.target.nodeName.toLowerCase() === 'input') {
          me.readAsDataURL(e.target);
        }
      }, false);

      // 关联上传按钮的图片与实际上传按钮
      eventUtil.addHandler(imgList, 'click', function(e) {
        // 判断点击的是否是上传图片
        if (e.target.getAttribute('data-icon')){
          var nodeList = e.target.parentNode.childNodes;
          // 遍历节点
          for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].nodeName.toLowerCase() === 'input') {
              nodeList[i].click();
            }
          }
        }
      }, false);

    },

    /**
     * 读取上传文件
     * @param  提交按钮
     */
    readAsDataURL : function(item) {
      //检验是否为图像文件  
      var file = item.files[0];  
      if(!/image\/\w+/.test(file.type)){  
        alert("上传一个图片，见证它的威力吧！");  
        return false;
      }  
      var reader = new FileReader();  
      //将文件以Data URL形式读入页面  
      reader.readAsDataURL(file);  
      reader.onload=function(e){ 
        item.parentNode.style.overflow = 'visible';
        item.parentNode.innerHTML = '<i class="icon-minus-sign del-icon"></i><img src="' + this.result +'" class="drag-img" />';
        // 创建图片类
        
      }  
    },

    /**
     * 判断浏览器是否支持FileReader接口  
     * @param  提交按钮
     */
    init : function() {
      if(typeof FileReader == 'undefined'){  
        alert("你的浏览器out啦，请使用最新的浏览器体验！");
        Array.prototype.slice.call(subBtn).forEach(function(item, index) {
          item.setAttribute("disabled","disabled"); 
        });
        return;
      }  
      this.initUploadBtn();
    }
  }

})();



