var gallery = {};


function listPictures(unit, lesson){
	var picArray = [];
	for (pic in units_json["Units"][unit][lesson].pics){
		picArray.push(pic);
	}
	return picArray;
}
function getBoxDimensions(){
	console.log(document.getElementById("gallery").width);
}

function getbestratio(boxheight,boxwidth,picheight,picwidth){
    var height_ratio = boxheight / picheight;
    var width_ratio = boxwidth / picwidth;
    picwidth *= Math.min(width_ratio, height_ratio)
    picheight *= Math.min(width_ratio, height_ratio)
    return {new_width: picwidth,new_height: picheight};
}

function resizePic(img){
	getBoxDimensions();
	var boxH = document.getElementById("gallery").style.maxHeight;
	var boxW = document.getElementById("gallery").width / 5;
	var picheight = img.height;
	var picwidth = img.width;
	var results = getbestratio(boxH,boxW,picheight,picwidth);
	img.width = results.new_width;
	img.height = results.new_height;
	//document.getElementById("gallery").appendChild(img);
}


function displayPics(){
	console.log(document.getElementById("gallery").offsetHeight);
	
	var picArray = listPictures("Unit1","Wh questions");
	for (pic in picArray){
		var img = document.createElement("IMG");
		img.src = picArray[pic];
		//img.onload = resizePic(img);
		document.getElementById("gallery").appendChild(img);
		console.log(pic);
	}

}
