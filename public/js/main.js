var form = document.querySelector('form');
form.addEventListener('submit', function() {
    console.log('clicked');
	this.querySelector('input[type="submit"]')
		.setAttribute('disabled', 'disabled');
}, false);
