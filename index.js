function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

  // Check if response.credential is not empty
  if (response.credential) {
    var expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    // Use encodeURIComponent to properly handle special characters in the token
    var encodedToken = encodeURIComponent(response.credential);

    // Format the expires attribute correctly
    document.cookie = `jwt_token=${encodedToken}; expires=${expirationDate.toUTCString()}; path=/`;
  }
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

window.onload = function () {
  var jwt_token = getCookie("jwt_token");

  if (jwt_token) {
    var payload = JSON.parse(atob(jwt_token.split(".")[1]));
    var { email, name, picture } = payload;

    var rightNav = document.querySelector(".right-nav");
    rightNav.innerHTML += `<div class="logged-in">
      <div class="profile-picture">
          <img src="${picture}">
      </div>
      <div>
          <h3 class="signed-in-name">
              ${name}
          </h3>
          <h4 class="signed-in-email">
              ${email}
          </h4>
          </div>
      </div>`;
  } else {
    var signInHolder = document.querySelector("#signInHolder");

    google.accounts.id.initialize({
      client_id:
        "628266741208-kbm8u6kjl1geuacmd3igugl9vqdtfhdg.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );
  }
};
