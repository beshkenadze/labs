/*
bookDb.add(['Test name','Test Data',new Date().getTime()],function(ex){
 		console.log(ex);
 	});
*/
var Book = function(){
	this.book_xsl = 'xsl/FB2_22_xhtml.xsl';
	this.ready = function(data){
		console.log(data);
	}
}
/* FB2 */

Book.prototype.fb2 = function(fb2Data){
	$('#status').empty('Processing');
	var _this = this;
	
	try {
	    var unzipper = new JSUnzip(fb2Data);
		if(unzipper.isZipFile()) {
			unzipper.readEntries();
			var entry = unzipper.entries[0];
			if (entry.compressionMethod === 0) {
				var uncompressed = entry.data; 
			} else if (entry.compressionMethod === 8) {
				var uncompressed = JSInflate.inflate(entry.data);
			} else{
				alert('Unknow zip file.');
				return;
			}
			this.transform(uncompressed);
		}else{
			this.transform(fb2Data);
		}
	} catch(err) {
	  	alert(err);
		return;
	}
	
	
	
}
Book.prototype.transform = function (XMLString) {
	var _this = this;
	this.load(this.book_xsl,function(xsl,errorMsg){
		if(xsl)
			_this.processing(XMLString,xsl);
		else
			alert(errorMsg)
	});
}
Book.prototype.processing = function (XMLString,XSLString) {
	var xml = this.createXMLStringParser(XMLString),
		xsl = this.createXMLStringParser(XSLString);
	var processor = new XSLTProcessor();
		processor.importStylesheet(xsl);
	var html = processor.transformToDocument(xml);
	$('#status').empty();
	$('#text').html(new XMLSerializer().serializeToString(html));
}
Book.prototype.createXMLStringParser = function (XMLString) {
	try{
		var xmlParser = new DOMParser();
		var xmlDoc = xmlParser.parseFromString(XMLString, "text/xml");
	}catch(Err){
		try {
			var xmlDoc= new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async="false";
				xmlDoc.loadXML(XMLString);
		} catch(Err) {
			window.alert("Browser does not support XML parsing.");
			return false;
		}
	}
	return xmlDoc;
}
/* EPUB */
Book.prototype.epub = function(epub_file){
	var _this = this;
    var epub = this.epub = new JSEpub(epub_file);
	epub.processInSteps(function (step, extras) {
          var msg='';
          if (step === 1) {
              msg = "Распаковка";
          } else if (step === 2) {
              msg = "Декомпрессия " + extras;
          } else if (step === 3) {
              msg = "Чтение OPF файла";
          } else if (step === 4) {
              msg = "Обработка";
          } else if (step === 5) {
              _this.showPage(0);
          }

          $('#status').html(msg);
      });
}
Book.prototype.showPage = function (page) {
	 $('#status').empty();
	  var _this = this;
      // The spine lists all pages in correct order
      var spine = this.epub.opf.spine[page];

      // The manifest contains the href of the file
      var href = this.epub.opf.manifest[spine]["href"];

      // All the files are stored in here, indexed by href
      var doc = this.epub.files[href];

      // The doc is a DOMparser created DOM. You may want to
      // work with a string version of the page contents.
      var html = new XMLSerializer().serializeToString(doc);

      $('#text').html(html);

	  if ( (page + 1) < this.epub.opf.spine.length)
      var next = $('<a>',{'href':'#','html':'Следующая глава'}).click(function(e){
          e.preventDefault();
          _this.showPage(page+1);
          
      }).appendTo('#text');
	  if ( page > 0)
	  var prev = $('<a>',{'href':'#','html':'Предыдущая глава'}).click(function(e){
          e.preventDefault();
          _this.showPage(page-1);

      }).appendTo('#text');
}

/* UTILS */
Book.prototype.load= function(file,callback){
	var req = this.request();
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
Book.prototype.request = function (){
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