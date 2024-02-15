import subprocess, os

words = []
models = ["en_US-amy-low.onnx","en_US-amy-medium.onnx","en_US-arctic-medium.onnx","en_US-danny-low.onnx","en_US-hfc_male-medium.onnx","en_US-joe-medium.onnx","en_US-kathleen-low.onnx","en_US-kusal-medium.onnx","en_US-l2arctic-medium.onnx","en_US-lessac-high.onnx","en_US-lessac-low.onnx","en_US-lessac-medium.onnx","en_US-libritts-high.onnx","en_US-libritts_r-medium.onnx","en_US-ryan-high.onnx","en_US-ryan-low.onnx","en_US-ryan-medium.onnx"]

with open("/home/levtim/GitProjects/Learning-English-HTML/include/missing.txt", "r") as fp:
	for word in fp.readlines():
		words.append(word.strip())

print(words)

words = words[0:2]
for word in words:
	for model in models:
		try:
			ps = subprocess.Popen(("echo", word), stdout=subprocess.PIPE)
			output = subprocess.check_output(("/home/levtim/Downloads/piper/piper/piper", "--model", os.path.join("/home/levtim/Downloads/piper/piper/",model) , "--output_file", word + "_" +  model.replace(".onnx","") + ".mp3"), stdin=ps.stdout)
			ps.wait()
			print(word + "_" + model.replace(".onnx","") + ".mp3")
		except:
			print("Couldn't print:" + word + "_" + model.replace(".onnx","") + ".mp3")
