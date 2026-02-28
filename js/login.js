(function($) {

	"use strict";

	fetch('https://score.nsk-score.workers.dev/check', {
		method: 'GET',
		credentials: 'include'
	}).then((res) => {
		if(res.status == 200) {
			window.location.replace("/");
		}
	}).catch((e) => {});

	document.getElementById('login-form-id').addEventListener('submit', function(event) {
		event.preventDefault();

		const username = document.getElementById('field-user').value;
		const password = document.getElementById('field-pass').value;

		const btn = document.getElementById('submit-btn');
		btn.disabled = true;
		btn.innerText = "Loading...";
		btn.style.cursor = "default";

		fetch('https://score.nsk-score.workers.dev/auth', {
			method: 'POST',
			credentials: 'include',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				"username": username,
				"password": password
			})
		}).then(async (res) => {
			if(res.status == 200) {
				alert('Success');
			}else {
				alert(`Error ${res.status}: ${(await res.json()).error}`);
			}
			btn.disabled = false;
			btn.innerText = "Login";
			btn.style.cursor = "pointer";
		}).catch((err) => {
			btn.disabled = false;
			btn.innerText = "Login";
			btn.style.cursor = "pointer";
			alert(`Client-side Javascript error: ${err}`);
			console.error(err);
		});
	});
})(jQuery);