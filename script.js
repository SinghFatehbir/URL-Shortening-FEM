// function for hamburger button
function toggleMenu() {
  var nav = document.getElementById("nav");
  var icon = document.getElementById("hamburger-icon");
  nav.classList.toggle("open");
  icon.classList.toggle("active");
}

// Get element from html
const submitBtn = document.querySelector(".url-shortener-btn");
const urlOutput = document.querySelector(".url-output");
const inputError = document.querySelector(".input-error");

// function when you click shortenIt! button
submitBtn.addEventListener("click", function () {
  // Get value of url input
  document.querySelector("#url-input").style.border = "";
  inputError.style.display = "none";
  var urlInput = document.querySelector("#url-input").value;
  // Check if input is not empty
  if (urlInput != "") {
    let apiRequest = new XMLHttpRequest();
    apiRequest.open("GET", "https://api.shrtco.de/v2/shorten?url=" + urlInput);
    apiRequest.responseType = "json";
    apiRequest.send();

    // handle the response from the api request
    apiRequest.onload = function () {
      // if status is ok
      if (apiRequest.status == 201) {
        var shortUrl = apiRequest.response.result.full_short_link;

        let outputDiv = document.querySelector(".url-output");

        // Create div inside url output section with p, a and button element
        let div = document.createElement("div");
        div.classList.add("output");

        let p = document.createElement("p");
        p.textContent = apiRequest.response.result.original_link;

        let a = document.createElement("a");
        a.textContent = shortUrl;
        a.setAttribute("href", shortUrl);
        a.setAttribute("target", "_blank");

        let button = document.createElement("button");
        button.classList.add("copy-btn");
        button.textContent = "Copy";

        div.appendChild(p);
        div.appendChild(a);
        div.appendChild(button);
        outputDiv.appendChild(div);

        // Add all the info to session storage; the output elements won't disappear until the tab is closed.
        sessionStorage.setItem("urlOutput", outputDiv.innerHTML);

        // Add function to button to copy the shortUrl to clipboard
        button.addEventListener("click", () => {
          button.textContent = "Copied!";
          navigator.clipboard.writeText(shortUrl);
          button.style.backgroundColor = "var(--color-primary-dark-violet)";
        });
      } else {
        // show error if API request fails
        inputError.style.display = "block";
        inputError.textContent = `UH-OH, something went wrong. Please try again`;
        console.log(apiRequest.response.error);
      }
    };
  } else {
    // show error if url input field is empty
    document.querySelector("#url-input").style.border =
      "2px solid var(--color-secondary-red)";
    inputError.style.display = "block";
    inputError.textContent = `please add a link`;
  }
});

// reload the data from session storage when page is refreshed
window.onload = function () {
  let outputDiv = document.querySelector(".url-output");
  // Get the data from localStorage with a key of 'output'
  let output = sessionStorage.getItem("urlOutput");
  if (output) {
    outputDiv.innerHTML = output;
  }
};
