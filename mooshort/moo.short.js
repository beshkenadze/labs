Element.implement({
    short: function(visible_word) {
        var e = this;
        if ($(e).hasClass('shorted')) return;
        var count_word = $(e).get('html').length + 3;
        if (!visible_word) var visible_word = 10;
        if ($(e).get('rel') != null && $(e).get('rel').test(/maxlength-/)) {
            var need_count_word = $(e).get('rel').replace(/maxlength-/, '');
        } else {
            var need_count_word = 10;
        }

        var hide_count_word = count_word - need_count_word;

        var text = $(e).get('html');
        var short_text = text.substr(0, need_count_word);

        var hide_text = text.substr(need_count_word, count_word);
        var new_word = '';

        var opacity_percent = 1 / visible_word;

        for (var i = 0; i < visible_word; i++) {
            var opacity_value = 1 - (opacity_percent * i);
            opacity_value = opacity_value.toString().substr(0, 3).toFloat();
            if (hide_text[i]) {
				if (Browser.Engine.trident) {
					var style = 'filter:alpha(opacity=' + opacity_value + ')';
				}else{
					var style = 'opacity:' + opacity_value + '';
				}
                var span = '<span style="' + style + '">' + hide_text[i] + '</span>';
                new_word += span;
            }
        };
        $(e).set('html', short_text + new_word).addClass('shorted');
    }
});