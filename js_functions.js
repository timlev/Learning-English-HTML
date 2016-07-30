/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";
var H;
var W;
var boxH;
var boxW;
var correct_item = "blahblah";
var img_slots = ["img1", "img2", "img3", "img4"];
var current_index = 0;
var current_unit;
var current_lesson;
var current_lesson_contents;
var current_lesson_pics = [];
var current_lesson_sounds = [];
var current_unit;
var lesson_length;
var tries = 0;
var score = 0;
var all_screens = ["main_lesson","lesson_choice", "score_screen", "teach_lesson"]
var loaded_pics = [];
var loaded_audio = [];
var loader = new Image();
var loaded = [];
loader.src = "Loading_icon.gif";
loader.id = "loadinggif";

function displayloadingGif(){
	document.body.appendChild(loader);
}

function focus_on_screen(screen) {
	for (var s in all_screens){
		
		//Turn on screen
		if (all_screens[s] === screen) {
			console.log(all_screens[s]);
			document.getElementById(all_screens[s]).style.display = "block";
			document.getElementById(all_screens[s]).style.visibility = "visible";
		}
		else {
			if (document.getElementById(all_screens[s]) != null){
				document.getElementById(all_screens[s]).style.display = "none";
				document.getElementById(all_screens[s]).style.visibility = "hidden";
			}
		}
	}
}
function json_dir_sep() {
  //Try first units.json entry
  var first_unit = Object.keys(units_json["Units"])[0];
  var first_lesson = Object.keys(units_json["Units"][first_unit])[0];
  var first_file = Object.keys(units_json["Units"][first_unit][first_lesson]["pics"])[0];
  if (first_file.indexOf("/pics/") != -1){
    return "/";
  }
  else if (first_file.indexOf("\\pics\\") != -1){
    return "\\";
  }
}
var sep = json_dir_sep();


function play(file){
  //console.log(file.name);
  file.play();
};

function getbestratio(boxheight,boxwidth,picheight,picwidth){
    var height_ratio = boxheight / picheight;
    var width_ratio = boxwidth / picwidth;
    picwidth *= Math.min(width_ratio, height_ratio)
    picheight *= Math.min(width_ratio, height_ratio)
    return {new_width: picwidth,new_height: picheight};
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function grab_lesson(unit, lesson, lessontype){
  //~ displayloadingGif();
  var raw_lesson = units_json["Units"][unit][lesson]["pics"];
  var pics = [];
  for (var key in raw_lesson) {
    if (raw_lesson.hasOwnProperty(key)) {
      //console.log(key);
      pics.push(key);
    }
  }
  current_lesson_contents = shuffle(pics);
  current_unit = unit;
  //preload_images(pics);
  //preload_audio_files(pics);
  preload_audio_and_images(pics, lessontype);
  return pics;
}
function convert_to_display(item){
  item = item.slice(item.lastIndexOf(sep) + 1,item.lastIndexOf("."));
  var replacementsdict = {'.exclamationmark': '!', '.apostrophe': "'", '.questionmark': '?', '.comma': ',', '.colon': ':'};
  for (var key in replacementsdict){
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
function set_teach_sound(item){
  var sound_src = item.replace("pics","sounds");
  sound_src = sound_src.slice(0,sound_src.lastIndexOf(".")) + "speech_google.wav";
  document.getElementById("teach_phraseboxaudio").src = sound_src;
}

function setup_item(item, lesson, callback){
  // onWinResize();

  //~ document.getElementById("main_lesson").style.visibility = "visible";
  //~ document.getElementById("lesson_choice").style.display = "none";
  //~ document.getElementById("score_screen").style.display = "none";
  focus_on_screen("main_lesson");
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
}

function resizePic(img){
  var picheight = img.height;
  var picwidth = img.width;
  var results = getbestratio(boxH,boxW,picheight,picwidth);
  img.width = results.new_width;
  img.height = results.new_height;
}

function lesson_loop(unit, lesson){
  // onWinResize();
  img_slots = ["img1","img2", "img3", "img4"];
  correct_item = "blahblah";
  current_index = 0;
  tries = 0;
  score = 0;
  document.getElementById("scorebox").innerHTML = "Score: ";
  focus_on_screen("main_lesson");

  //grab lesson from units.json
  current_lesson = lesson;
  current_lesson_contents = grab_lesson(unit,lesson, "main");
  //shuffle lesson once
  //current_lesson_contents = shuffle(current_lesson_contents);
  //current_unit = unit;
  //setup_item(current_lesson_contents[current_index], current_lesson_contents);//, fill_imgs()
}
function box_clicked(box){
  var timeout = 2000;
  if (correct_item == box){
    play_feedback_sound(true);
    document.getElementById('answer_feedback').innerHTML = "<img src='correct.png' height=50px width=50px />Yes!";
    highlight_div('answer_feedback', timeout);
    //alert("Correct choice!");
    if (tries == 0){
      score += 1;
    }
    document.getElementById("scorebox").innerHTML = "Score: " + score + "/" + String(current_index + 1);
    current_index += 1;
    correct_item = "blahblah";
    if (current_index < lesson_length){
      setTimeout(function(){setup_item(current_lesson_contents[current_index], current_lesson_contents);},timeout);
    }
    else {
      current_index = 0;
      //display_lesson_choices();
      setTimeout(function() {display_score_summary(current_lesson, score);});
    }
  }
  else {
    play_feedback_sound(false);
    document.getElementById('answer_feedback').innerHTML = "<img src='wrong.png' height=50px width=50px />No";
    highlight_div('answer_feedback', timeout);
    setTimeout(function(){play(document.getElementById("phraseboxaudio"));},timeout);
    //alert("Wrong choice :( !");
    tries += 1;
  }
}
function check(d){
  d.firstChild.checked = true;
  click_unit(d.firstChild);
}
function check_lesson(d){
  d.firstChild.checked = true;
  choose_lesson(current_unit, d.firstChild.id);
}

function display_lesson_choices(){
  // onWinResize();
  //document.getElementById("main_lesson").style.visibility = "hidden";


  //~ document.getElementById("lesson_choice").style.visibility = "visible";
  //~ document.getElementById("lesson_choice").style.display = "block";

  //~ document.getElementById("score_screen").style.display = "none";
  //~ document.getElementById("main_lesson").style.display = "none";
  //~ document.getElementById("teach_lesson").style.display = "none";

  focus_on_screen("lesson_choice");
  var units= [];
  for (var unit in units_json["Units"]){
    units.push("<div onclick='check(this)'><input type='radio' name='unit' id='" + unit + "' onchange='click_unit(this)' >" + unit + "</input></div>");
  }
  document.getElementById("units").innerHTML = units.join("");
}

function constructDate(){
  var d = new Date();
  var date = ""
  date += (d.getMonth() + 1) + "/";//month
  date += d.getDate() + "/"; // day
  date += d.getFullYear(); //year
  return date;
}
function display_score_summary(lesson, score){
  //~ document.getElementById("main_lesson").style.visibility = "hidden";
  //~ document.getElementById("teach_lesson").style.visibility = "hidden";
  //~ document.getElementById("score_screen").style.display = "block";

  focus_on_screen("score_screen");

  highlight_div("score_screen", 0);
  document.getElementById("score_date").innerHTML = constructDate();
  document.getElementById("score_unit").innerHTML = current_unit;
  document.getElementById("score_lesson").innerHTML = lesson;
  var percent = Math.round(score / lesson_length * 100.0) + " %";
  document.getElementById("score_score").innerHTML = percent;

}
function populate_lesson_choices(unit){
  //set up units
  //document.getElementById("main_lesson").style.visibility = "hidden";
  //~ document.getElementById("lesson_choice").style.visibility = "visible";
  //~ document.getElementById("lesson_choice").style.display = "block";

  //~ document.getElementById("score_screen").style.display = "none";
  //~ document.getElementById("main_lesson").style.display = "none";
  //~ document.getElementById("teach_lesson").style.display = "none";
  focus_on_screen("lesson_choice");
  current_unit = unit;
  var lessons= [];
  for (var lesson in units_json["Units"][unit]){
    lessons.push("<div onclick='check_lesson(this)'><input type='radio' name='lesson' id='" + lesson + "' onchange='choose_lesson(current_unit, this.id)' >" + lesson + "</input></div>");
  }
  document.getElementById("lessons").innerHTML = lessons.join("");
}
function click_unit(choice){
  var unit = choice.id;
  populate_lesson_choices(unit);
}

function choose_lesson(u, l){
  current_unit = u;
  current_lesson = l;
  lesson_length = l.length;
  lesson_loop(current_unit, current_lesson);
}


function teach_lesson(){
  //~ document.getElementById("lesson_choice").style.display = "none";
  //~ document.getElementById("score_screen").style.display = "none";
  //~ document.getElementById("main_lesson").style.display = "none";
  //~ document.getElementById("teach_lesson").style.visibility = "visible";
  focus_on_screen("teach_lesson");
  current_index = 0
  current_lesson_contents = grab_lesson(current_unit, current_lesson, "teach");

  //shuffle lesson once
  //current_lesson_contents = shuffle(current_lesson_contents);
  //console.log(current_lesson_contents);
  display_teach_item()
}

function display_teach_item(){
  if (current_index + 1 == lesson_length){
    //change img src
    document.getElementById("learn_img").src = current_lesson_contents[current_index];
    var item = current_lesson_contents[current_index];
    document.getElementById("teach_phraseboxwords").innerHTML = split_item_to_word_spans(convert_to_display(item));
    //assign sound
    set_teach_sound(item);
    play(document.getElementById("teach_phraseboxaudio"));
    //hide next button because it is last
    document.getElementById("next_button_img").style.visibility = "hidden";
    }
  else{
    //change img src
    document.getElementById("learn_img").src = current_lesson_contents[current_index];
    var item = current_lesson_contents[current_index];
    document.getElementById("teach_phraseboxwords").innerHTML = split_item_to_word_spans(convert_to_display(item));
    //assign sound
    set_teach_sound(item);
    play(document.getElementById("teach_phraseboxaudio"));
    current_index += 1;
  }
}

function addSpan(word, word_sound_file_name, word_sound_file_path){
  return "<span id=" + word_sound_file_name + " onclick=play_word_file(this)>" + word + "</span>";
}

function split_item_to_word_spans(disp_item){
  var wordArray = disp_item.split(" ");
  var output_array = [];
  for (var i in wordArray){
    var word = wordArray[i];
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
}

function play_word_file(obj){
  document.getElementById(obj.id).style.backgroundColor = 'yellow';
  var word_sound_file_path = "sounds/" + obj.id + ".mp3";
  var word_sound_google_path = "http://translate.google.com/translate_tts?q=" + obj.id + "&tl=en";
  var ind_audio = document.getElementById("ind_words_audio");
  ind_audio.src = word_sound_file_path;
//  ind_audio.onerror =
  play(ind_audio);
  //ind_audio.onerror = function(){ind_audio.src = word_sound_google_path; play(ind_audio);};
  //Above creates endless loop if Google doesn't have it
  document.getElementById("ind_words_audio").addEventListener( "ended", revert_color(obj));

  //problems do, break, time -- don't download
}

function play_feedback_sound(correct){
  if (correct == true){
    document.getElementById("audio_feedback").src = "GuitarStrum.wav";
    play(document.getElementById("audio_feedback"));
  }
  else {
    document.getElementById("audio_feedback").src = "CymbalCrash.wav";
    play(document.getElementById("audio_feedback"));
  }
}

function highlight_div(div, timeout){
  if (timeout === undefined){
    timout = 1000;
  }
  document.getElementById(div).style.display='block';
  document.getElementById('fade').style.display='block';
  if (timeout != 0){
    setTimeout(function(){ reverse_highlight(div);}, timeout);
  }
}

function reverse_highlight(div){
  document.getElementById(div).style.display='none';
  document.getElementById('fade').style.display='none';
}
/*
function preload_images(pics){
  var loadedpics = [];
  if (document.images){
    for (var pic in pics){
      var imgObject = new Image();
      //console.log(pics[pic]);
      imgObject.src = pics[pic];
      imgObject.onload = loadedpics.push(imgObject);
    };
  };
  //~ if (loadedpics.length < pics.length){
    //~ focus_on_screen(null);
  //~ }
  //~ else {
    //~ document.getElementById("loadinggif").style.display = "none";
  //~ }
}



function preload_audio_files(pics){
  loaded = [];
  for (var pic in pics){
    var audioObject = new Audio();
    var sound_src = pics[pic].replace("pics","sounds");
    sound_src = sound_src.slice(0,sound_src.lastIndexOf(".")) + "speech_google.wav";
    audioObject.src = sound_src;
    //console.log(audioObject);
    check_if_all_loaded(audioObject, loaded, pics);
  };
}
*/
function listloadImage(image, files, lessontype){
  loaded_pics.push(image);
  check_if_all_loaded(files, lessontype);
}
function listloadAudio(audio, files, lessontype){
  loaded_audio.push(audio);
  check_if_all_loaded(files, lessontype);
}

function preload_audio_and_images(pics, lessontype){
	loaded = [];
	if (document.images){
		toggleLoading();
		for (var pic in pics){
			//IMAGES
			var imgObject = new Image();
			//console.log(pics[pic]);
			imgObject.src = pics[pic];
			if (imgObject.complete){
				listloadImage(imgObject, pics, lessontype);
				//loaded.push(imgObject);
			}
			else {
				imgObject.onload = listloadImage(imgObject, pics, lessontype);
				//imgObject.onload = loaded.push(imgObject);
			}
			//AUDIO
			var audioObject = new Audio();
			var sound_src = pics[pic].replace("pics","sounds");
			sound_src = sound_src.slice(0,sound_src.lastIndexOf(".")) + "speech_google.wav";
			audioObject.src = sound_src;
			audioObject.addEventListener('canplaythrough', listloadAudio(audioObject, pics, lessontype));
			//check_if_all_loaded(loaded, pics, lessontype);
		};
	};
}

//function check_if_all_loaded(loaded, files, lessontype){
function check_if_all_loaded(files, lessontype){
    var total_objects = files.length * 2;
    if (loaded_pics.length + loaded_audio.length == total_objects){
        //Everything is loaded
        console.log("all loaded");
        toggleLoading();//return to normal sound pic
        if (lessontype == "main"){
            setup_item(current_lesson_contents[current_index], current_lesson_contents);
        }
        else if (lessontype == "teach"){
			display_teach_item();
		};
        
    }
    else {
        console.log(files.length - loaded_pics.length - loaded_audio.length);
    }
}

function toggleLoading(){
    var soundbtn = document.getElementById("soundbuttonimg");
    console.log(soundbtn.src);
    if (soundbtn.src.endsWith("Loading_icon.gif")){
        soundbtn.src = "Loading_icon.gif";
        console.log("toggling");
    }
    else {
        console.log("toggling");
        soundbtn.src = "sound.png";
    }
}
