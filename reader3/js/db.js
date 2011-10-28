WebSql = function(options){
	var cmd = {
		insert : function(db,table_name,vars,increment_id,callback,error){
			if(!db) return false;
			var mask = '';
			var i;
			for ( i in vars){
				mask += '?'+(i < vars.length-1 ? ',' : '');
			}
			var sql = 'INSERT INTO '+table_name+' VALUES ('+increment_id+', '+mask+')';
			db.transaction(function(tx) {
				tx.executeSql(sql, vars, callback || function(){} ,error || function(){});
			});

		},
		create : function(db,table_name,fields,ifnot){
			if(!db) return false;
			db.transaction(function (tx) {
			  	var sql = ifnot 
			  		? ('CREATE TABLE IF NOT EXISTS '+table_name+' (id unique, '+fields+')')
			  		: ('CREATE TABLE '+table_name+' (id unique, '+fields+')');
				tx.executeSql(sql);
			});
		},
		fetch : function(db,table_name,fields,where,callback,error){
			if(!db) return false;
			var sql = 'SELECT '+(fields || '*')+' FROM '+table_name+(where || '');
			db.transaction(function(tx) {
				tx.executeSql(sql, [],function(tx,result){
					callback(result);
				},error || function(tx,r){});
			});
		},
		count : function(db, table_name, callback,error){
			var result = false;
			this.fetch(db,table_name,'count(*) as count','',callback,error);
		},
		remove : function(db,table_name,where,limit,callback,error) {
			if(!db) return false;
			if(!where) return;
			db.transaction(function (tx) {
			  	var sql = 'DELETE FROM '+table_name+' '+(where || '')+(limit ? ' LIMIT '+limit : '');
				//console.log(sql);
				tx.executeSql(sql, [],callback || function(){} ,error || function(){});
			});
		},
		drop : function(db,table_name) {
			if(!db) return false;
			db.transaction(function (tx) {
			  tx.executeSql('DROP TABLE '+table_name);
			});
		}
	}
	
	var connect = {
		options: options,
		init : function(){
			if(!this.options) var options = {name:'',version:'',descr:'',size:''};
			else options = this.options;
			this.db = openDatabase(options.name || 'defaultDb',options.version || '0.1',options.descr || 'Default DB',options.size || 2 * 1024 * 1024);
			if(!this.db){
				return false;
			}else{
				return this;
			}
		},
		model: function(table_name,fields) {
			var parent = this;
			var increment_id = 0;
			
			
			// Fetch
			this.fetch = function(fields,where,callback,error){
				var field = fields.join(',');
				cmd.fetch(parent.db, table_name,field,where,callback,error);
			}

			// Command
			this.count = function(callback,error){
				cmd.count(parent.db,table_name,function(result){
					var count = result.rows.item(0).count;
					callback(count);
				},function(tx,err){
					error(err);
				});
			}
			// Create
			this.create = function(ifnot){
				var f,i=0,field=[];
				for (f in fields){
					switch(fields[f])
					{
					    case 'null':
					    case 'integer':
						case 'real':
						case 'text':
						case 'none':
						    var type = fields[f];
					        break;
						case 'blob':
						    var type = 'none';
						    break;
					    default:
							var type = 'text';
					}
					field[i] = f +' '+ fields[f];
					i++;
				}
				
				cmd.create(parent.db,table_name,field.join(','),ifnot);
			}
			this.insert = function(vars,callback,error){
				this.increment(function(inc){
					cmd.insert(parent.db,table_name,vars,increment_id,callback,error);
					parent.increment();
				});
			}
			this.remove = function(where,limit){
				cmd.remove(parent.db,table_name,where,limit);
				this.increment();
			}
			this.drop = function(){
				cmd.drop(parent.db,table_name);
			}
			this.getInc = function(){
				return increment_id;
			}
			this.increment = function(callback){
				this.fetch(['id'],' ORDER BY id DESC LIMIT 1',function(result){
					if(result.rows.length) {
						var id = result.rows.item(0).id;
					}else{
						var id = 0;
					}
					increment_id = id+1;
					if(callback) callback(increment_id);
				},function(tx,error){
					//console.error(error);
					increment_id = 1;
					if(callback) callback(increment_id);
				});
			}
			this.create(1); // Create database if not exist;
			
			return this;
		}
	}
	
	return connect.init(options);
};