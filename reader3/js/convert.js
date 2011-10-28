//
//  convert
//
//  Created by Aleksandr Beshkenadze on 2010-10-09.
//  Copyright (c) 2010. All rights reserved.
//

var Convert = function (string){
	this.string = string;
}
Convert.prototype.toUtf8 = function(){
	var _this = this;
	var c209 = _this.chr(209), c208 = _this.chr(208), c129 = _this.chr(129);
	for (var i=0; i < _this.string.length; i++) {
		var c = _this.ord(_this.string[i]);
		var t = '';
		
		if (c >= 192 && c <= 239) t += c208 + _this.chr(c-48);
		else if (c > 239)  t += c209 + _this.chr(c-112);
		else if (c == 184) t += c209 + c209;
		else if (c == 168) t += c208 + c129;
		else t += _this.string[i];
	};
	return t;
}
Convert.prototype.chr = function(ascii){
	return String.fromCharCode(ascii);
}
Convert.prototype.ord = function(string){
	return string.charCodeAt(0);
}