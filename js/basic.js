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

//保存拼接图片
function saveImg(canvas){

	document.getElementById("div_c").innerHTML="";
	var drawing = document.getElementById(canvas);

	if(drawing.getContext){
		var context = drawing.getContext("2d");
		var oImg = document.getElementById("div_b").getElementsByClassName("ofscanvas");
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
		document.getElementById("div_c").appendChild(image);
	}
	
}





