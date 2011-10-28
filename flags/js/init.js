window.onload = function() {
	var links = _('a.word');
	for (var i = 0; i < links.length; i++) {
		links[i].onclick = clickOnWord;
	}
	_('#get').onclick = function() {
		if (_('#word_1').value.length > 0) {
			var pos_1 = word_array.indexOf(_('#word_1').value) * 15;
			pos_1 = pos_1 * 1.0645;
		} else {
			var pos_1 = 0;
		}
		if (_('#word_2').value.length > 0) {
			var pos_2 = word_array.indexOf(_('#word_2').value) * 15;
		} else {
			var pos_2 = 0;
		}
		_('#flag').style.backgroundPosition = '-' + (pos_1) + 'px ' + '-'
				+ (pos_2) + 'px';
	}
	_('#reset').onclick = function() {
		_('#word_1').value = '';
		_('#word_2').value = '';
		_('#flag').style.backgroundPosition = '0px 0px';
	}
}
function clickOnWord() {
	var word_1 = _('#word_1');
	var word_2 = _('#word_2');
	if (word_1.value.length > 0 && word_2.value.length > 0) {
		word_1.value = '';
		word_2.value = '';
	}
	if (word_1.value.length > 0) {
		word_2.value = this.innerHTML;
	} else {
		word_1.value = this.innerHTML;
	}
	return false;
}