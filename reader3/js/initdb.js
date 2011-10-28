var db = new WebSql({
	name:'reader3', version:'0.1', descr:'book database', size: 1 * 1024 * 1024
});
var fields = {
	'name' : 'text',
	'data': 'text',
	'datetime': 'text'
}

var bookDb = {};

bookDb.add = function(fileds,callback){
	this.table_name = 'books';
	this.insert(fileds,function(ex,res){
		callback(res);
	},function(ex){
		callback(ex);
	});
};

$.extend(true,bookDb,db.model('books',fields));
