window.addEvent('domready', function() {
	var application = new Application();
	$('who').addEvent('click',function(e) {
		e.stop();
		application.modal(application.who('Кто ходил?','Петя, Вася'));
	});
	$('you').addEvent('click',function(e) {
		e.stop();
		application.modal(application.yesno('Пойдешь?'));
	});
    
});
var Application = new Class({
	//implements
  	Implements: [Options],
  	//options
  	options: {
    	wrapper: $('wrapper'),
    	modal: {
    		styles : {
				'position':'absolute',
				'width':'100px',
				'height':'100px',
				'background':'white'    			
    		}
    	},
    	buttons : {
    		events : {
    			onYes   : false,
		    	onNo    : false,
		    	onClose : false
    		},
    		text : {
    			yes   : 'Да',
    			no    : 'Нет',
    			close : 'Закрыть'
    		}
    	}
    },
    initialize: function(options) {
    //set options
    	this.setOptions(options);
    	this.wrapper = this.options.wrapper

  	},
	who : function (title, data) {
		var parent = this;
		var win = new Element('div');
			win.setStyles(this.options.modal.styles);
			var content = new Element('div',{'class':'content'}).inject(win);
				var title = new Element('div',{'class':'title','html':title}).inject(content);
				var data = new Element('div',{'class':'data','html':data}).inject(content);
			var actions = new Element('div',{'class':'actions'}).inject(win);
				var link_close = new Element('a',{'class':'close'});
					link_close.set('href','#');
					link_close.set('html',parent.options.buttons.text.close);
					link_close.addEvent('click',function(e) {
						e.stop();
						if(typeof parent.options.buttons.events.onClose == 'function') {
							parent.options.buttons.events.onClose();
						}
						win.dispose();
					});
					link_close.inject(actions);
			this.center(win);
			return win;
	},
	yesno : function(message) {
		var parent = this;
		var win = new Element('div');
			win.setStyles(this.options.modal.styles);
			win.set('html',message);
			var actions = new Element('div',{'class':'actions'}).inject(win);
				var link_yes = new Element('a');
					link_yes.set('href','#');
					link_yes.set('html',parent.options.buttons.text.yes);
					link_yes.addEvent('click',function(e) {
						e.stop();
						if(typeof parent.options.buttons.events.onYes == 'function') {
							parent.options.buttons.events.onYes();
						}
						win.dispose();
					});
					link_yes.inject(actions);
				var link_no = new Element('a');
					link_no.set('href','#');
					link_no.set('html',parent.options.buttons.text.no);
					link_no.addEvent('click',function(e) {
						e.stop();
						if(typeof parent.options.buttons.events.onNo == 'function') {
							parent.options.buttons.events.onNo();
						}
						win.dispose();
					});
					link_no.inject(actions);

			this.center(win);
			return win;
	},
	modal : function(child) {
			var _this = this;
			child.inject(this.wrapper);
	},
	center : function(el) {
		var el_coor = el.getCoordinates();
    	var win_coor = window.getCoordinates();
    	var top = (win_coor.height-el_coor.height)/2;
    	var left = (win_coor.width-el_coor.width)/2;
    	el.setStyles({
			'top':top,
			'left':left
	    });
	}
});