var form = document.querySelector("form");
form.addEventListener(
  "submit",
  function () {
    console.log("clicked");
    this.querySelector('input[type="submit"]').setAttribute(
      "disabled",
      "disabled"
    );
  },
  false
);

let time = 60;
var x = setInterval(() => {
  time--;
  document.getElementById("timer").innerHTML = time;
  if (time <= 0) {
    clearInterval(x);
    document.getElementsByTagName("a")[0].removeAttribute("href");
    document.getElementById("download-button").style.opacity = 0.6;
    document.getElementById("download-button").style.cursor = "not-allowed";
  }
}, 1000);

if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}
