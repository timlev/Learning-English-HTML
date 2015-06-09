import os, sys
import download_dict_sound	
import glob

units_root = os.path.relpath("../Units/")

######## REMOVE HIDDEN (.) FILES FROM UNITS##########
for root, dirs, files in os.walk("../Units/"):
	for f in files:
		if f.startswith(".") and f != ".gitignore":
			print os.path.join(os.path.abspath(root),f)
			os.remove(os.path.join(os.path.abspath(root),f))

if len(os.path.split(sys.argv[0])[0]) > 0:
    os.chdir(os.path.split(sys.argv[0])[0])


########## DOWNLOAD GOOGLE SPEECH AND CONVERT TO WAVE#########
picfiles = [os.path.abspath(file) for file in glob.glob('../Units/*/*/pics/*.*')]
soundfiles = [os.path.abspath(file) for file in glob.glob('../Units/*/*/sounds/*.*')]
comparepicfiles = [file[:file.rindex(".")] for file in picfiles]
comparesoundfiles =[file.replace("speech_google.ogg","").replace("speech_google.wav","").replace("/sounds/","/pics/") for file in soundfiles]
compared = [os.path.split(file) for file in comparepicfiles if file not in comparesoundfiles]
print compared
for item in compared:
    path, raw_word = item[0], item[1]
    download_dict_sound.convert_mp3_to_wav(download_dict_sound.download_google(raw_word, path), True)


import create_JSON #This automatically runs
