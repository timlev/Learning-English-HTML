import subprocess, os


piper_url = "https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_amd64.tar.gz"

os.chdir("/home/levtim/Downloads")
if os.path.exists("piper"):
	os.chdir("piper")
else:
	os.mkdir("piper")
if os.path.exists("piper"):
	os.chdir("piper")
else:
	subprocess.run(["wget", piper_url, "&&", "tar", "-xzvf", "piper_amd64.tar.gz"], shell=True)
	os.chdir("piper")

example = "https://huggingface.co/rhasspy/piper-voices/blob/v1.0.0/en/en_US/amy/low/en_US-amy-low.onnx"


base_url = "https://huggingface.co/rhasspy/piper-voices/blob/v1.0.0/en/en_US/"
base_url = "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/"
types = ["low", "medium", "high"]

voices = ["amy","arctic","danny","hfc_male","joe","kathleen","kusal","l2arctic","lessac","libritts","libritts_r","ryan"]

def download_voice(voice,type):
	link = os.path.join(base_url, voice, type, "en_US-" + voice + "-" + type + ".onnx")
	print(link)
	subprocess.run(["wget", link])
	print(link + ".json")
	subprocess.run(["wget", link + ".json"])

for voice in voices:
	for type in types:
		download_voice(voice, type)
