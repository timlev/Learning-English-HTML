var gallery = {};
gallery.happy = "mytext";
gallery.sad = "mysadtext";

console.log(gallery);
console.log(units_json);

for (var root in units_json){
	for (var unit in units_json[root]){
		for (var lesson in units_json[root][unit]){
			for (var pic in units_json[root][unit][lesson].pics){
				console.log(pic);
			}
		}
	}
};
