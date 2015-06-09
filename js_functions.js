/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function play(file){
    file.play();
};

function scale_image(img_height, img_width, container_height, container_width){
    var container_ratio = container_height / container_width;
    var img_ratio = img_height / img_width;
    console.log(img_ratio, container_ratio);
    if (img_ratio == container_ratio){
        new_height = container_height;
        new_width = container_width;
    }
    else if (img_ratio > container_ratio){
        new_height = container_height;
        new_width = img_width * (container_height / img_height);
    }
    else {
        new_width = container_width;
        new_height = img_height * (container_width / img_width);
    }
    return {
        new_height: new_height,
        new_width: new_width
    };
}

function fill_imgs(img1,img2,img3,img4){

    var H = window.innerHeight;
    var W = window.innerWidth;
    var boxH = (H - 100)/ 2;
    var boxW = W / 2;

    img1Originalheight = document.getElementById("img1").height;
    img1Originalwidth = document.getElementById("img1").width;
    document.getElementById("img1").height = scale_image(img1Originalheight, img1Originalwidth, boxH, boxW).new_height;
    document.getElementById("img1").width = scale_image(img1Originalheight, img1Originalwidth, boxH, boxW).new_width;

    img2Originalheight = document.getElementById("img2").height;
    img2Originalwidth = document.getElementById("img2").width;
    document.getElementById("img2").height = scale_image(img2Originalheight, img2Originalwidth, boxH, boxW).new_height;
    document.getElementById("img2").width = scale_image(img2Originalheight, img2Originalwidth, boxH, boxW).new_width;

    img3Originalheight = document.getElementById("img3").height;
    img3Originalwidth = document.getElementById("img3").width;
    document.getElementById("img3").height = scale_image(img3Originalheight, img3Originalwidth, boxH, boxW).new_height;
    document.getElementById("img3").width = scale_image(img3Originalheight, img3Originalwidth, boxH, boxW).new_width;

    img4Originalheight = document.getElementById("img4").height;
    img4Originalwidth = document.getElementById("img4").width;
    document.getElementById("img4").height = scale_image(img4Originalheight, img4Originalwidth, boxH, boxW).new_height;
    document.getElementById("img4").width = scale_image(img4Originalheight, img4Originalwidth, boxH, boxW).new_width;
}

function test_func(){
    console.log("Testing!");
}

function box_clicked(box){
  console.log(box);
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function reset_boxes(){

    document.getElementById("img3").height = img3Originalheight;
    document.getElementById("img3").width = img3Originalwidth;
}
