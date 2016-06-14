/**
 * 图片上传
 * @param {[type]}
 */
var uploadImg = (function() {
  // 上传按钮图片
  var subBtnImg = $$('.icon-plus-sign-alt');
  // 上传按钮
  var subBtn = $$('.file_input');

  return {
    /**
     * 初始化上传按钮
     * @param  提交按钮
     */
    initUploadBtn : function() {
      var me = this;

      // 监听上传按钮
      Array.prototype.slice.call(subBtn).forEach(function(item, index){
        eventUtil.addHandler(item, 'change', function(e) {
          me.readAsDataURL(item);
        }, false);
      });

      // 关联上传按钮的图片与实际上传按钮
      Array.prototype.slice.call(subBtnImg).forEach(function(item, index){
        eventUtil.addHandler(item, 'click', function(e) {
          e.target.nextSibling.click();
        }, false);
      });
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
        item.parentNode.innerHTML = '<img src="' + this.result +'" class="drag-img" />';
        
        editor.initImgEditor();
      }  
    },

    /**
     * 重置上传按钮  
     * @param  提交按钮
     */
    resetUploadBtn:function() {

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



