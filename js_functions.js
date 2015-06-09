/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var correct_item = "blahblah";
var img_slots = ["img1","img2", "img3", "img4"];
var current_index = 0;
var current_lesson;
var lesson_length;
var tries = 0;
var score = 0;

function play(file){
    file.play();
};

function scale_image(img_height, img_width, container_height, container_width){
    var container_ratio = container_height / container_width;
    var img_ratio = img_height / img_width;
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

function fill_imgs(){
    var H = window.innerHeight;
    var W = window.innerWidth;
    var boxH = (H - 100)/ 2;
    var boxW = W / 2;

    for (img in img_slots){
      img = img_slots[img];
      var originaHeight = document.getElementById(img).height;
      var originalWidth = document.getElementById(img).width;
      var new_height = scale_image(originaHeight, originalWidth, boxH, boxW).new_height
      var new_width = scale_image(originaHeight, originalWidth, boxH, boxW).new_width
      document.getElementById(img).height = new_height;
      document.getElementById(img).width = new_width;
    }
}

function test_func(){
    console.log("Testing!");
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function reset_boxes(){

    document.getElementById("img3").height = img3Originalheight;
    document.getElementById("img3").width = img3Originalwidth;
}

function grab_lesson(unit, lesson){
  var raw_lesson = units_json["Units"][unit][lesson]["pics"];
  var pics = [];
  for (var key in raw_lesson) {
    if (raw_lesson.hasOwnProperty(key)) {
      pics.push(key);
    }
  }
  return pics;
}
function convert_to_display(item){
  item = item.slice(item.lastIndexOf("\\") + 1,item.lastIndexOf("."));
  var replacementsdict = {'.exclamationmark': '!', '.apostrophe': "'", '.questionmark': '?', '.comma': ',', '.colon': ':'};
  for (key in replacementsdict){
    if (item.indexOf(key) != -1){
      item = item.replace(key, replacementsdict[key]);
    }
  }
  return item;
}

function set_sound(item){
  var sound_src = item.replace("pics","sounds");
  sound_src = sound_src.slice(0,sound_src.lastIndexOf(".")) + "speech_google.wav";
  document.getElementById("phraseboxaudio").src = sound_src;
}

function setup_item(item, lesson){
  lesson_length = lesson.length;
  tries = 0;
  //assign text
  document.getElementById("phraseboxwords").innerHTML = convert_to_display(item);
  //assign sound
  set_sound(item);
  play(document.getElementById("phraseboxaudio"));
  //assign pictures
  convert_to_display(item);
  img_slots = shuffle(img_slots);
  //set correct_item
  correct_item = img_slots[0]
  document.getElementById(img_slots[0]).src = item;
  var already_taken = [item];
  //var lesson = shuffle(lesson);
  for (var i = 1; i < img_slots.length; i++){
    var index = 0;
    var another_pic = "";
    while (another_pic == "" || already_taken.indexOf(another_pic) != -1){
      another_pic = lesson[index];
      index += 1;
    }
    already_taken.push(another_pic);
    document.getElementById(img_slots[i]).src = another_pic;
  }
  fill_imgs();
}

function lesson_loop(unit, lesson){
  //grab lesson from units.json
  lesson = grab_lesson(unit,lesson)
  //shuffle lesson once
  lesson = shuffle(lesson);
  current_lesson = lesson;
  setup_item(current_lesson[current_index], current_lesson);
}
function box_clicked(box){
  if (correct_item == box){
    alert("Correct choice!");
    if (tries == 0){
      score += 1;
    }
    document.getElementById("scorebox").innerHTML = "Score: " + score + "/" + String(current_index + 1);
    console.log(score + "/" + String(current_index + 1));
    current_index += 1;
    correct_item = "blahblah";
    if (current_index < lesson_length){
      setup_item(current_lesson[current_index], current_lesson);
    }
  }
  else {
    alert("Wrong choice :( !");
    tries += 1;
  }
}
