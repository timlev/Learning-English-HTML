import os, glob, urllib
import download_dict_sound


def dictionary_rough_search(word, directory="./newdownloads/"):
    #if check_downloaded_word(word, directory):
        #return
    base = "http://dictionary.cambridge.org/us/dictionary/american-english/"
    base2 = "http://dictionary.cambridge.org/us/dictionary/english/"
    qmid = "?q="
    #end = "#"
    end = ""
    query = base + word + qmid + word + end
    query2 = base2 + word
    #print query
    #print query2

    # print query2
    handler = urllib.urlopen(query2)
    response = handler.readlines()
    # print "Found alternate source at", query2
    mp3source = ""
    for line in response:
        if "sound audio_play_button pron-icon us" in line and ".mp3" in line:
            # print line
            start = line.find("data-src-mp3=") + len("data-src-mp3=") + 1
            end = line.find(".mp3") + len(".mp3")
            mp3source = line[start:end]
            print mp3source
            #Stop looking through lines
            break
    print "Downloading", word, "to:", os.path.join(directory, word + ".mp3")
    try:
        getmp3 = urllib.urlopen(mp3source)
        ofp = open(os.path.join(directory, word + ".mp3"),'wb')
        ofp.write(getmp3.read())
        ofp.close()
    except:
        print "Could not download:", word

def download(word, directory="./"):
    if check_downloaded_word(word, directory):
        return
    base = "http://dictionary.cambridge.org/us/dictionary/american-english/"
    qmid = "?q="
    #end = "#"
    end = ""
    query = base + word + qmid + word + end
    print query

    try:
        response = urllib2.urlopen(query)
    except:
        print "Couldn't find entry for", word
        return 1
    mp3source = ""
    for line in response:
        if "sound audio_play_button pron-icon us" in line and word + ".mp3" in line:
            #print line
            start = line.find("data-src-mp3=") + len("data-src-mp3=") + 1
            end = line.find(".mp3") + len(".mp3")
            mp3source = line[start:end]
            break
    print query
    print mp3source
    print "Downloading to:", os.path.join(directory, word + ".mp3")
    try:
        getmp3 = urllib2.urlopen(mp3source)
        ofp = open(os.path.join(directory, word + ".mp3"),'wb')
        ofp.write(getmp3.read())
        ofp.close()
    except:
        print "Could not download:", word

picfiles = [os.path.abspath(file) for file in glob.glob('../Units/*/*/pics/*.*')]
dictsoundfiles = [x.replace(".mp3","") for x in os.listdir("../sounds/") if x.endswith(".mp3")]
# print sorted(dictsoundfiles)

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
# print all_words
not_downloaded_words = []

for word in all_words:
	if download_dict_sound.check_downloaded_word(word, "../sounds") == False:
		not_downloaded_words.append(word)
        #dictionary_rough_search(word)

print sorted(not_downloaded_words)


# not_downloaded_words = ['neighbors', 'olive', 'tv', 'fog', '11:30', "driver's", 'washing', 'button', 'tea', 'boots', 'hairspray', 'blue', 'sun', 'fingers', 'children', 'lights', 'somalia', 'toes', 'iran', 'carseat', '2:30', 'earthquake', 'watermelons', 'cucumbers', 'cooked', 'scales', 'county', 'thailand', 'actress', 'singing', 'use', 'eye', '0', '6', 'scratched', 'pencil', 'entrance', 'lungs', 'drowning', 'sleeping', 'sprained', 'animals', 'mechanic', 'high', 'cows', 'airplane', 'extinguisher', 'onions', 'watching', 'nuts', 'microwave', 'fare', 'fever', 'ladder', 'jumping', 'bear', 'man', 'a', 'bugs', 'q', 'waitress', 'playing', 'headlight', 'shoes', 'oven', '5:30', 'avocado', 'writing', 'orange', 'seatbelt', 'birth', 'oranges', 'bandages', 'break', 'hands', 'mushrooms', 'takin', 'allergies', 'week', 'weight', 'grapefruits', 'braided', 'by', 'lemons', 'busboy', 'unclog', '7', 'peeling', 'medicine', 'mittens', 'red', 'friday', 'grapes', 'steering', 'dishwasher', 'flamingos', 'waiter', 'locksmith', 'firefighter', 'yells', 'one', 'feet', 'monkey', 'twenty', 'tow', 'elevator', '2', 'pains', 'tomato', 'eyes', 'dentist', '11', '10', 'grocery', 'bee', 'r', '8:30', 'janitor', 'carrots', 'hairstylist', 'talking', 'cleaned', 'organs', 'dishes', 'dancing', 'studying', 'thermometer', 'dentists', 'leaking', 'eggs', 'pencils', 'strawberries', 'wind', '7:30', 'lightbulb', 'stained', '8', 'plums', 'boating', '12', 'fairview', 'dye', 'burned', 'runt', "don't", 'eyebrow', 'penguins', 'gloves', 'ears', 'stylist', 'pictures', '3', 'kicking', 'wear', 'veterinarian', 'taking', '1:30', 'officer', 'clogged', 'stoplight', '6:30', 'wastebasket', 'goats', 'mailman', 'chalkboard', 'laos', 'peppers', 'opthamologist', 'engine', 'shoulders', 'deer', "what's", 'foggy', 'loon', 'otter', 'turtles', 'careers', 'cracked', 'larpenteur', 'kenya', 'choking', '10:30', '9', 'hallway', 'cleaning', 'paycheck', 'classroom', 'i', 'chickens', 'walls', 'asked', 'the', 'bhutan', 'cherries', '9:30', '4', 'limes', 'homework', 'forklift', 'dryer', 'listening', 'using', 'cd', '12:30', 'painted', 'onion', 'nose', 'old', 'fixing', 'lips', 'warmer', 'contacts', '3:30', 'eating', 'pear', 'nails', 'beavers', 'carpenter', 'boxes', 'on', 'of', 'whiteboard', 'o', 'cockroaches', 'camels', 'beans', 'hospital', 'socks', 'operator', 'vegetables', 'there', 'eyelash', '4:30', 'delivery', 'bookshelf', 'birthdate', 'called', 'x-ray', 'gong', 'rabbits', 'paint', 'am', 'crutches', 'cabinets', '5', 'ponytail', "o'clock", 'u-turn', 'time', 'stealing', 'peas', 'weekend', 'motorcycle', 'dvd', 'mp3']
# for word in not_downloaded_words:
#     dictionary_rough_search(word)
# dictionary_rough_search("neighbor")
