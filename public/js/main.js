var form = document.querySelector("form");
form.addEventListener(
  "submit",
  function () {
    console.log("clicked");
    this.querySelector('input[type="submit"]').setAttribute(
      "disabled",
      "disabled"
    );
    // document.querySelector("body").style.visibility = "hidden"
    document.querySelector("#loader").style.display = "block";
  },
  false
);

document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
    document.querySelector("body").style.visibility = "hidden";
    document.querySelector("#loader").style.visibility = "visible";
  } else {
    document.querySelector("#loader").style.display = "none";
    document.querySelector("body").style.visibility = "visible";
  }
};
