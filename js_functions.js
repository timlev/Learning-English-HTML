/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var correct_item = "blahblah";
var img_slots = ["img1","img2", "img3", "img4"];
var current_index = 0;
var current_unit;
var current_lesson;
var current_lesson_contents;
var current_unit;
var lesson_length;
var tries = 0;
var score = 0;
//function fill_imgs();
var sep = json_dir_sep();
console.log(sep);

function play(file){
  //console.log(file.name);
  file.play();
    //if (file.name != null){
    //  file.addEventListener( "ended", revert_color(file.name), false);
    //}
};
function json_dir_sep(){
  //Try first units.json entry
  var first_unit = Object.keys(units_json["Units"])[0];
  var first_lesson = Object.keys(units_json["Units"][first_unit])[0];
  var first_file = Object.keys(units_json["Units"][first_unit][first_lesson]["pics"])[0];
  //Test case
  //first_file = "Units\\Units1\\Wh/ questions\\pics\\Where/ is/ your/ hat.questionmark.jpg"
  if (first_file.indexOf("/pics/") != -1){
    return "/";
  }
  else if (first_file.indexOf("\\pics\\") != -1){
    return "\\";
  }
}
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
    document.getElementById("main_lesson").style.visibility = "visible";
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function grab_lesson(unit, lesson){
  var raw_lesson = units_json["Units"][unit][lesson]["pics"];
  var pics = [];
  for (var key in raw_lesson) {
    if (raw_lesson.hasOwnProperty(key)) {
      //console.log(key);
      pics.push(key);
    }
  }
  return pics;
}
function convert_to_display(item){
  item = item.slice(item.lastIndexOf(sep) + 1,item.lastIndexOf("."));
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

function setup_item(item, lesson, callback){
  document.getElementById("main_lesson").style.visibility = "visible";
  document.getElementById("lesson_choice").style.display = "none";
  document.getElementById("score_screen").style.display = "none";
  lesson_length = lesson.length;
  tries = 0;
  //assign text
  //document.getElementById("phraseboxwords").innerHTML = convert_to_display(item);
  //split words into divs
  document.getElementById("phraseboxwords").innerHTML = split_item_to_word_spans(convert_to_display(item));
  //assign sound
  set_sound(item);
  play(document.getElementById("phraseboxaudio"));
  //assign pictures
  convert_to_display(item);
  img_slots = shuffle(img_slots);
  //set correct_item
  correct_item = img_slots[0];
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
  if (typeof callback === "function"){
    callback();
  }
}

function lesson_loop(unit, lesson){
  img_slots = ["img1","img2", "img3", "img4"];
  correct_item = "blahblah";
  current_index = 0;
  tries = 0;
  score = 0;
  document.getElementById("scorebox").innerHTML = "Score: ";
  document.getElementById("lesson_choice").style.display = "none";
  document.getElementById("score_screen").style.display = "none";
  //grab lesson from units.json
  current_lesson = lesson;
  current_lesson_contents = grab_lesson(unit,lesson);
  //shuffle lesson once
  current_lesson_contents = shuffle(current_lesson_contents);
  current_unit = unit;
  setup_item(current_lesson_contents[current_index], current_lesson_contents, fill_imgs());
}
function box_clicked(box){
  if (correct_item == box){
    alert("Correct choice!");
    if (tries == 0){
      score += 1;
    }
    document.getElementById("scorebox").innerHTML = "Score: " + score + "/" + String(current_index + 1);
    current_index += 1;
    correct_item = "blahblah";
    if (current_index < lesson_length){
      setup_item(current_lesson_contents[current_index], current_lesson_contents, fill_imgs());
    }
    else {
      current_index = 0;
      //display_lesson_choices();
      display_score_summary(lesson, score);
    }
  }
  else {
    alert("Wrong choice :( !");
    tries += 1;
  }
}

function display_lesson_choices(){
  //set up units
  document.getElementById("main_lesson").style.visibility = "hidden";
  document.getElementById("lesson_choice").style.visibility = "visible";
  document.getElementById("lesson_choice").style.display = "block";
  document.getElementById("score_screen").style.display = "none";
  units= [];
  for (unit in units_json["Units"]){
    units.push("<div><input type='radio' name='unit' id='" + unit + "' onchange='click_unit(this)' >" + unit + "</input></div>");
  }
  document.getElementById("units").innerHTML = units.join("");
}

function constructDate(){
  d = new Date();
  date = ""
  date += d.getMonth() + "/";//month
  date += d.getDate() + "/"; // day
  date += d.getYear(); //year
  return date;
}
function display_score_summary(lesson, score){
  //do something
  document.getElementById("main_lesson").style.visibility = "hidden";
  document.getElementById("score_screen").style.display = "block";
  document.getElementById("score_date").innerHTML = constructDate();
  document.getElementById("score_unit").innerHTML = current_unit;
  document.getElementById("score_lesson").innerHTML = lesson;
  document.getElementById("score_score").innerHTML = score + "/" + lesson_length;

}
function populate_lesson_choices(unit){
  //set up units
  document.getElementById("main_lesson").style.visibility = "hidden";
  document.getElementById("lesson_choice").style.visibility = "visible";
  document.getElementById("lesson_choice").style.display = "block";
  lessons= [];
  for (lesson in units_json["Units"][unit]){
    lessons.push("<div><input type='radio' name='lesson' id='" + lesson + "' onchange='choose_lesson(unit, this.id)' >" + lesson + "</input></div>");
  }
  document.getElementById("lessons").innerHTML = lessons.join("");
}
function click_unit(choice){
  unit = choice.id;
  populate_lesson_choices(unit);
}

function choose_lesson(u, l){
  current_unit = u;
  current_lesson = l;
  lesson_length = l.length;
  lesson_loop(current_unit, current_lesson);
}

function addSpan(word, word_sound_file_name, word_sound_file_path){
  return "<span id=" + word_sound_file_name + " onclick=play_word_file(this)>" + word + "</span>";
}

function split_item_to_word_spans(disp_item){
  var wordArray = disp_item.split(" ");
  var output_array = [];
  for (i in wordArray){
    word = wordArray[i];
    //remove ? ! . ,
    var word_sound_file_name = word.replace("?","").replace("!","").replace(".", "").replace(",","");
    word_sound_file_name = word_sound_file_name.toLowerCase();
    var word_sound_file_path = ["'","sounds/",String(word_sound_file_name),".mp3","'"].join("");
    output_array.push(addSpan(word, word_sound_file_name, word_sound_file_path));
  }
  var output = output_array.join(" ");
  return output;
}

function revert_color(obj){
  setTimeout(function (){document.getElementById(obj.id).style.backgroundColor = 'transparent';},1000);
  //document.getElementById(obj.id).class = 'unselected';
}

function play_word_file(obj){
  document.getElementById(obj.id).style.backgroundColor = 'yellow';
  var word_sound_file_path = "sounds/" + obj.id + ".mp3";
  document.getElementById("ind_words_audio").src = word_sound_file_path;
  play(document.getElementById("ind_words_audio"));
  document.getElementById("ind_words_audio").addEventListener( "ended", revert_color(obj));

  //problems do, break, time -- don't download
}
