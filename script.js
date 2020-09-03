let menu;
let modal = document.querySelector("#modal");
let filter = "alle";
const url = "https://spreadsheets.google.com/feeds/list/17Dd7DvkPaFamNUdUKlrFgnH6POvBJXac7qyiS6zNRw0/od6/public/values?alt=json";

document.addEventListener("DOMContentLoaded", loadJSON);

async function loadJSON() {
	const JSONData = await fetch(url);
	menu = await JSONData.json();
	addEventListenersToButtons();
	visMenu();
}

function visMenu() {
	const list = document.querySelector("#liste");
	const template = document.querySelector("template");
	// Tømmer sektion for indhold
	list.innerHTML = "";
	// Loop igennem indhold og filtrerer
	menu.feed.entry.forEach(ret => {
		if (filter == "alle" || filter == ret.gsx$kategori.$t) {
			console.log(ret);
			const clone = template.cloneNode(true).content;
			clone.querySelector("h2").textContent = ret.gsx$navn.$t;
			clone.querySelector(".kort").textContent += ret.gsx$kort.$t;
			clone.querySelector("img").src = "large/" + ret.gsx$billede.$t + ".jpg";
			clone.querySelector(".oprindelse").textContent = "Oprindelse: " + ret.gsx$oprindelse.$t;
			clone.querySelector(".pris").textContent = "Pris: " + ret.gsx$pris.$t + ",-";
			clone.querySelector("article").addEventListener("click", () => visDetaljer(ret));
			list.appendChild(clone);
		}
	})
}

function visDetaljer(ret) {
	modal.style.display = "block";
	modal.querySelector("h2").textContent = ret.gsx$navn.$t;
	modal.querySelector(".lang").textContent = ret.gsx$lang.$t;
	modal.querySelector(".oprindelse").textContent = ret.gsx$oprindelse.$t;
	modal.querySelector(".pris").textContent = ret.gsx$pris.$t + ",-";
	modal.querySelector("img").src = "large/" + ret.gsx$billede.$t + ".jpg";
}

document.querySelector("#close").addEventListener("click", () => modal.style.display = "none");

// Ved klik udenfor modal lukkes den
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

function addEventListenersToButtons() {
	document.querySelectorAll(".filter").forEach((btn) => {
		btn.addEventListener("click", filterBtns);
	})
}

function filterBtns() {
	filter = this.dataset.kategori;
	document.querySelector(".heading").textContent = this.textContent;
	document.querySelectorAll(".filter").forEach((btn) => {
		btn.classList.remove("active");
	})
	this.classList.add("active");
	visMenu();
}
