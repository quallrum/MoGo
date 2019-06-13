$('.services-wrap').accordion({
	classes: {
		'ui-accordion-header-collapsed': 'closed',
		'ui-accordion-content-collapsed': 'closed',
		'ui-accordion-content-active': 'opened'
	}
});

function sleep(ms) {
	ms += new Date().getTime();
	while (new Date() < ms){}
} 

function InfiniteSlider(selector){
	this.self = $(selector);

	this.wrapper = this.self.find('.is-wrapper');
	this.container = this.self.find('.is-container');
	this.elements = this.container.find('.is-element');

	this.nav = {
		left: this.self.find('.is-nav-left'), 
		right: this.self.find('.is-nav-right')
	}	

	this.current = 0;
	this.delete = null;
	this.moveInProcess = false;

	var e = $(this.elements[0]), w, h;

	this.step = parseFloat(this.container.css('width'));
	this.elements.css('width', this.step - parseFloat(e.css('margin-left')) - parseFloat(e.css('margin-right')));
	this.container.css('width', this.elements.length * this.step + 'px');

	h = parseFloat(e.css('height')) + parseFloat(e.css('margin-top')) + parseFloat(e.css('margin-bottom'));

	this.container.css('height', h + 'px');
	this.nav.left.css('height', h + 'px');
	this.nav.right.css('height', h + 'px');

	this.move = (function(dir){
		if(this.moveInProcess) return;
		this.moveInProcess = true;

		var a, shift = parseFloat(this.container.css('left'));
		if(dir == 'left'){
			shift -= this.step;
			this.current++;
		}
		else{
			shift += this.step;
			this.current--;
		}
		a = {'left': shift + 'px'};

		if(this.current == this.elements.length){
			this.current--;

			this.delete = $(this.elements[0]);
			this.container.append(this.delete.clone());

			this.container.css('margin-left', this.step + 'px');

			this.delete.remove();
			this.refreshElements();

			a = {'margin': '0px'};
		}
		if(this.current == -1){
			this.current++;

			this.delete = $(this.elements[this.elements.length - 1]);

			this.container.prepend(this.delete.clone())
			this.container.css('margin-left', -this.step + 'px');

			this.delete.remove();
			this.refreshElements();

			a = {'margin': '0px'};
		}

		console.log(this.current);

		this.container.animate(a, 1000, (function(){
			this.moveInProcess = false;
		}).bind(this));
		
	}).bind(this);

	this.refreshElements = (function(){
		this.elements = this.container.find('.is-element');
	}).bind(this);

	this.nav.left.on('click', function(){ this.move('right'); }.bind(this));
	this.nav.right.on('click', function(){ this.move('left'); }.bind(this));
}

slider = new InfiniteSlider('.main');
q = new InfiniteSlider('#quotes');
f = new InfiniteSlider('#feedback-quotes');

dialog = {};
dialog.success = $('#subscribe-success').dialog({
	draggable: false,
	autoOpen: false,
	closeOnEscape: false,
	modal: true,
	show: {effect: 'fade', duration: 500},
	hide: {effect: 'fade', duration: 500},
	buttons: [
		{
			text: 'Kill yourself!',
			click: function(){
				dialog.success.dialog('close');
				setTimeout(function(){
					dialog.killing.dialog('open');
				}, 510);
				
			}
		},
		{
			text: 'OK',
			click: function(){
				$(this).dialog('close');
			}
		}
	]
});
dialog.error = $('#subscribe-error').dialog({
	draggable: false,
	autoOpen: false,
	closeOnEscape: false,
	modal: true,
	show: {effect: 'fade'},
	hide: {effect: 'fade'},
	buttons: [
		{
			text: 'Let me try',
			click: function(){
				$(this).dialog('close');
			}
		}
	]
});
dialog.killing = $('#killing-myself').dialog({
	draggable: false,
	autoOpen: false,
	closeOnEscape: false,
	modal: true,
	show: {effect: 'fade', duration: 500},
	hide: {effect: 'fade', duration: 500},
	buttons: [
		{
			text: 'Oh, no!',
			click: function(){
				$(this).dialog('close');
			}
		},
		{
			text: 'Yes, bastard!',
			click: function(){
				$(this).dialog('close');
				$('.page-wrap').effect({
					effect: 'pulsate',
					complete: function(){
						$(this).hide();
					}
				})
			}
		}
	]
});
dialog.dead = $('#dead').dialog({
	draggable: false,
	autoOpen: false,
	closeOnEscape: false,
	modal: true,
	show: {effect: 'fade', duration: 500},
	hide: {effect: 'fade', duration: 500},
});

$('.subscribe-form').on('submit', function(event){
	event.preventDefault();
	email = event.target[0].value;
	if(!email || !/([a-z0-9\-\_\.])+\@([a-z0-9\-\_\.])+\.([a-z0-9\-\_\.])+/i.test(email))	dialog.error.dialog('open');
	else{
		dialog.success.find('#subscriber-email').text(email);
		dialog.success.dialog('open');
	}
})

function fuckOff(){
	console.log(dialog);
	dialog.dead.dialog('open');
	setTimeout(function(){
		dialog.dead.dialog('close');
		$('body').off('click');
	}, 3000);
}

$('body').on('click', function(event){
	if(event.target == event.currentTarget){
		fuckOff();
	} 
});
