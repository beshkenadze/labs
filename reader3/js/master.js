google.load("jquery", "1");
google.setOnLoadCallback(function() {
	 
     var fileInput = $("#file");  
		 fileInput.customInputFile({
		     replacement: $('#click')
		 });
	     fileInput.bind("change", function(){
	         appendFile(this.files);
	     });
	var dropzone;  
        dropzone = $("#drop");  
        dropzone.bind("dragenter", dragenter);  
        dropzone.bind("dragleave", dragleave);
 		dropzone.bind("dragover ", dragover); 
        dropzone.bind("drop", drop);
});
function appendFile(fileList){
	var file = fileList[0] || false;
	if(!file) {
		alert('No file');
		return;
	}
	
	var reader = new FileReader();
	var name = file.name;
	var filename = name.replace(/.*(\/|\\)/, "");
	var ext = name.substr(strrpos(name,'.')+1);
	$('#status').html('Выбран файл: ' + filename);
	reader.onload = function() {
	var data = this.result;
	if(ext === 'epub')
		new Book().epub(data);
	else if (ext === 'fb2' || ( ext === 'zip' && name.indexOf('.fb2.zip') >= 0))
		new Book().fb2(data);
	}; 
	if(ext === 'epub' ||  (ext === 'zip' && name.indexOf('.fb2.zip') >= 0))
		reader.readAsBinaryString(file);
	else if (ext === 'fb2')
		reader.readAsText(file);
}
function strrpos (haystack, needle, offset) {
    var i = -1;
    if (offset) {
        i = (haystack+'').slice(offset).lastIndexOf(needle); // strrpos' offset indicates starting point of range till end,
        // while lastIndexOf's optional 2nd argument indicates ending point of range from the beginning
        if (i !== -1) {
            i += offset;
        }
    }
    else {
        i = (haystack+'').lastIndexOf(needle);
    }
    return i >= 0 ? i : false;
}
function drop(e){
	$(this).removeClass('enter');
	e.stopPropagation();  
	e.preventDefault();  

	var dt = e.originalEvent.dataTransfer;
	var files = dt.files;  
	appendFile(files);
}
function dragenter(e) {
	$(this).addClass('enter');
    e.stopPropagation();  
    e.preventDefault();  
}  
function dragover(e) {
    e.stopPropagation();  
    e.preventDefault();  
}
function dragleave(e) {
	$(this).removeClass('enter');
    e.stopPropagation();  
    e.preventDefault();  
}