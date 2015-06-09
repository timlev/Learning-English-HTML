#Create JSON file lessons_JSON.js
import os, json

def get_directory_structure(rootdir):
    """
    Creates a nested dictionary that represents the folder structure of rootdir
    """
    dir = {}
    rootdir = rootdir.rstrip(os.sep)
    start = rootdir.rfind(os.sep) + 1
    for path, dirs, files in os.walk(rootdir):
        folders = path[start:].split(os.sep)
        subdir = dict.fromkeys([os.path.join(path, x) for x in files])
        parent = reduce(dict.get, folders[:-1], dir)
        parent[folders[-1]] = subdir
    return dir

results = get_directory_structure("Units")
with open("units.json", "w") as fp:
    fp.write("var units_json = ")
    json.dump(results, fp, indent=4)
print results["Units"]["Unit1"]["Wh questions"].keys()
