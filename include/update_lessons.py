import os, sys
import download_dict_sound
import download_wiktionary_word
import glob

units_root = os.path.relpath("../Units/")

######## REMOVE HIDDEN (.) FILES FROM UNITS##########
for root, dirs, files in os.walk("../Units/"):
	for f in files:
		if f.startswith(".") and f != ".gitignore":
			print(os.path.join(os.path.abspath(root),f))
			os.remove(os.path.join(os.path.abspath(root),f))

if len(os.path.split(sys.argv[0])[0]) > 0:
    os.chdir(os.path.split(sys.argv[0])[0])


########## DOWNLOAD Pico2wave #########
picfiles = [os.path.abspath(file) for file in glob.glob('../Units/*/*/pics/*.*')]
soundfiles = [os.path.abspath(file) for file in glob.glob('../Units/*/*/sounds/*.*')]
comparepicfiles = [file[:file.rindex(".")] for file in picfiles]
comparesoundfiles =[file.replace("speech_google.ogg","").replace("speech_google.wav","").replace("/sounds/","/pics/") for file in soundfiles]
compared = [os.path.split(file) for file in comparepicfiles if file not in comparesoundfiles]
print(compared)
for item in compared:
	path, raw_word = item[0], item[1]
	download_dict_sound.download_pico(raw_word, path)
    #download_dict_sound.convert_mp3_to_wav(download_dict_sound.download_google(raw_word, path), True)


import create_JSON #This automatically runs

############DOWNLOAD DICT SOUNDS#################
dictsoundfiles = [x for x in os.listdir("sounds") if x.startswith(".") == False and os.path.isfile(x)]
print(dictsoundfiles)

all_words = []
for pic in picfiles:
	f = os.path.basename(pic)
	f = f[:f.rindex(".")]
	f = download_dict_sound.replace_symbols(f)
	f = f.lower()
	f = f.replace("?","").replace("!","").replace(".", "").replace(",","")
	f = f.split(" ")
	all_words += f

all_words = list(set(all_words))

for word in all_words:
	#if download_dict_sound.check_downloaded_word(word, "sounds") == False:
	if download_wiktionary_word.check_downloaded_word(word,"sounds") == False:
		print(os.path.join("sounds",word) + ".ogg")
		download_wiktionary_word.get_wiki(word, "sounds")
	try:
		download_wiktionary_word.convert_ogg_to_mp3(os.path.join("sounds",word) + ".ogg", True)
	except:
		continue
		#print("************\n Problem with " + word + "\n******************\n")
		#download_dict_sound.download(word, "sounds")
