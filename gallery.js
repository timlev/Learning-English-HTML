function listgalleryPictures(unit, lesson){
	var picArray = [];
	for (pic in units_json["Units"][unit][lesson].pics){
		picArray.push(pic);
	}
	return picArray;
}

function getbestratio(boxheight,boxwidth,picheight,picwidth){
    var height_ratio = boxheight / picheight;
    var width_ratio = boxwidth / picwidth;
    picwidth *= Math.min(width_ratio, height_ratio)
    picheight *= Math.min(width_ratio, height_ratio)
    return {new_width: picwidth,new_height: picheight};
}

function resizegalleryPic(img){
	var boxH = 200;
	var boxW = 200;
	var picheight = img.height;
	var picwidth = img.width;
	var results = getbestratio(boxH,boxW,picheight,picwidth);
	img.width = results.new_width;
	img.height = results.new_height;
	//document.getElementById("gallery").appendChild(img);
}


function displaygalleryPics(unit = "Unit1", lesson = "Wh questions"){
	var picArray = listgalleryPictures(unit, lesson);
	for (pic in picArray){
		var img = document.createElement("IMG");
		img.src = picArray[pic];
		document.getElementById("gallery").appendChild(img);
		img.onload = resizegalleryPic(img);
	}

}
