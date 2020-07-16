var form = document.querySelector("form");
form.addEventListener(
  "submit",
  function () {
    console.log("clicked");
    this.querySelector('input[type="submit"]').setAttribute(
      "disabled",
      "disabled"
    );
    document.querySelector('#load-container').style.display = "block";
  },
  false
);

document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
    document.querySelector("body").style.visibility = "hidden";
    document.querySelector("#load-container").style.visibility = "visible";
  } else {
    document.querySelector("#load-container").style.display = "none";
    document.querySelector("body").style.visibility = "visible";
  }
};
