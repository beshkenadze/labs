var JS = {};
JS.load= function(file,callback){
	var req = JS.request();
	req.open("GET", file, true);
	req.onreadystatechange = function(){
		try {
		    if (req.readyState == 4) {
		        if (req.status == 200) {
					callback(req.responseText);
		        } else {
					callback(false,req.statusText);
		        }
		    }
		  }
		  catch( e ) {
		  }
	};
	req.send(null);
};	
JS.request = function (){
	if (XMLHttpRequest == undefined) {
		XMLHttpRequest = function() {
		try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
		  catch(e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
		  catch(e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP"); }
		  catch(e) {}
		try { return new ActiveXObject("Microsoft.XMLHTTP"); }
		  catch(e) {}
		throw new Error("This browser does not support XMLHttpRequest.");
		};
	} else {
		return new XMLHttpRequest();
	}
};