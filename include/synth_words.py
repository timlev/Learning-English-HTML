import subprocess

words = []

with open("/home/levtim/GitProjects/Learning-English-HTML/include/missing.txt", "r") as fp:
	for word in fp.readlines():
		words.append(word.strip())

print(words)


for word in words:
	ps = subprocess.Popen(("echo", word), stdout=subprocess.PIPE)
	output = subprocess.check_output(("/home/levtim/Downloads/piper/piper/piper", "--model", "/home/levtim/Downloads/piper/piper/en_US-lessac-medium.onnx", "--output_file", word + ".mp3"), stdin=ps.stdout)
	ps.wait()
	print(word)
