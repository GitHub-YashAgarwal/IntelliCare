const API_URL = "http://localhost:5000/";

// Google SignIn Btn

function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

  if (response.credential) {
    var expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    // Use encodeURIComponent to properly handle special characters in the token
    var encodedToken = encodeURIComponent(response.credential);

    // Format the expires attribute correctly
    document.cookie = `jwt_token=${encodedToken}; max-age=${
      30 * 24 * 60 * 60
    }; path=/`;

    location.reload();
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
  var email = getCookie("email");
  var name = getCookie("name");

  if (jwt_token || email || name) {
    if (jwt_token) {
      var payload = JSON.parse(atob(jwt_token.split(".")[1]));
      var { email, name, picture } = payload;
    }

    var rightNav = document.querySelector(".right-nav");
    rightNav.innerHTML += `<div class="logged-in">
    <div class="profile-picture">
        <img src="${
          picture ||
          "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
        }">
    </div>
    <div class="profile-details">
        <h3 class="signed-in-name">
            ${name}
        </h3>
        <h4 class="signed-in-email">
            ${email}
        </h4>
    </div>
    <div class="logout" onclick="logout()">
        <button class="dropbtn"><img src="caretdown.svg"></button>
        <div id="logout2" class="logout-dropdown" onclick="signOut()">
            <h3 class="logged-out-btn">Sign Out</h3>
        </div>
    </div>
    </div>`;
  } else {
    const createaccbtn = document.querySelector(".signinWrapper");

    createaccbtn.innerHTML += `
    <div class ="account" id="signin-btns">
      <button class="loginaccount-btn" onclick="loginAccountPopup()">
      <img style="padding-right: 0.5vw;" width="20" height="20"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFV0lEQVR4nO2d64sXVRjHj9mVLCoKag208rKUvRG3i7CovSuICulOUf4HZplpVmB0oRDdEDJ6I5SY3Wx751YQvfGyhkV02W52eeGqKdWGN/p94mmfjZQ5Z34/9vebOTPn+cAP3HFmzvc5Z+ZcnvOcM84ZhmEYhmEYhmFECHAKcB2wHHgb+AI4CBzT30E99hbwGHCtXFO27soDTAaeAX6hdX7Wa7vKtqNyABcA64AjjB+5x0vA+WXbVQmAO4B9tJ9hYGHZ9kULcKo+9Z2mD5hYtr1RAZwF9FMc7wJnlm13TE9+fxOZ1gB2ACuAecBM4Gz9zdRjK/ScRpOFYG8C+dXO38DrwBUtFOo0YGMTBbHWpQyjDW6Ib4DZ47j/HGAoJ42FKXc19wUyZms7uo5yD2Agp3eUXhc1p+rZKm1Dm9uZUCH0uZQALgEOB6qdtj+R+iYMBQZr6YyYgWcDDe7sDqbbE2iYn3YJOdbET5PFawWkvykzZfgpCQeeejWzaLTS1RxH+tMDb0GPqzvqUs5ie4EaBj0aHnV1B3jHY/zyAjWs9Gh409UdnTjJYl6BGhZ4NHzu6g7wm8f4aQVqmOHRsN/VHeCox/hJBWqY5NFwxNWdSArg3JQLwFcFTS9QQ3fKVZA1wmWiYSVZPF6ghic9Gja7hAdiOwvU8KlHw1JXdzRoKotGEV3RHFfEHJe4M25jAelv9qS9JwlnnKARa1k0OvkUAtcEnv5VLhVyJmR+AC7s0BTot540Dyc1ISNouKCPgTZPSZ4GfOBNDda41NApwuFApnwMXNSmJz80H7wXOM+lCLCQMEPjmSTROt9X7aDtwa0uZRiN1SQnkza14qrQruYbTQRmrXapA0wEtuRk1FhBDOpkygL154yFJnbrsZV6TjOhiTIit9BEQQJlNVazKCTzz/g3ceOEN2FthzNe3ozV9uTnN8zDHch86e3cFkrbOLGL2hcYrLWC3GNNsl3N8QB0ScSaBk21ivh2Vsmou2w76uLA65G4HQkdkegFnVk7qj/592f6f0s1LD0Nx5phGIZhGIZhGIagruFXgK+AEarLiNqwHpgffenKEiPgQ+rLAHCZixFgLnCA+rMfuN7FBDC1Q3v8xMqBIhYUNk1OyEdd+cjFAHAD6TI/hgKQ3o5vImQxcLGrdgTfQ4GJoZdjEPm1R9xiVxOAJR4bv4xB3J8ecZV98k9GbPHY+IcrG48wXM0gVjujFZaKncBxj7a2RTeXjW74lMXxGMQNJ9AGdHls3BuDOIlQyOJmVxOAWzw27o5B3KsecRtcTWB028ws1scg7j6POBm8THUVB7g8sIn4vTEIPCcwFpAdcSe4igJMAN732PZ7kftbBNEJCx9LXEVhNMrOxzoXC8ClwF+BnRDvdxUDeCCw0GMkulWVgW3AxgqhMtsAAMtUM2Xva9HqYOUT8lemtH0NcLuQEHbd9Juc1ZtxDjK1Kvq1iYUSi2KKXmY0+nqRagsh37KZ7GIGuFLnTfPYDdxZ5nIhXRZ1l4a25yFTrt2uCgBXBzbkOJkfgSeAKQXqm6J7BknazSALRGa5CvpPdtI8DWAX8BTQK581afMnUnr13ruaXMY6xo7KrrIBTgeez+lR+DimBbhBeyW3aybO0DVk/+2wPva3fsqkV89dptcO6r1aRTQ/Jza4qqMxQ77tgmNEtM51dUJ7Gg8C3xMv3+kALJoeWqfGC/fIZt3Ewzbg7uQWcANXAS+W9FZImi+IhrLzIQqAWcAjwHsd/JThFk3DMr1JP/xNwMMSAKWu7W26AFs+X3vof5l7SI/t0XP69RqJ57kx2ohmwzAMwzAMwzBcivwDg8MZXMAop/wAAAAASUVORK5CYII="
          alt="guest-male" />Login your Account
      </button>
      <button class="createaccount-btn" onclick="createAccountPopup()">
          <img style="padding-right: 0.5vw;" width="20" height="20"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACF0lEQVR4nO2Yz0pbQRTGB6FqF3XVpSDmTBQs1IVvYcEqmIWI58RSsuu23TW6qbrrM6j1KUQ3rl22mtS13RTR9M9G8sm5TYKhlJs6k5mr3A8OhNy5ud9v5sy5J2NMrly5vGmmgke2jBIJ9ohxQoIfSehnxie9pmNMFlVgLFhB3QqQEnUSzJvMqIoBYmz1YLwriLGh98a2b+5ivgsiA2lzJ/MdiBW8jLdhe8v5tFU4myphMDiAVhRX87YdjMXgAFoqfQEQYzc4gGXUPAKcBAcgQcMbgKBx3wEugwNYwanHFPoSHCDpbfxVoe3gAPe+jM7oi8xPJTqN1qFqV+lovkmMuSjmb0FsOgB8MBlppzf+d+YT89UMtNNtaVfZ055g1KKnTcrGXtTeRmu7vuxa8ZkEO3ots38pc+V6yBot4TEx1knw1QquvbUQ8ldc6zNIsKbP9GbeMo76aBr/KLdHY4JhZwCd+eDmpRPv3QH+pE0cAEbNGaDPOY+0PeEDoBkRoOkOwLiIBUCM7z5W4CDiHth3BiBBJeIKvHZfgTcYilKJGDVvZ6bEeKZnN8FmXtAormLa+FRR8MIKfgWY+Z+FMma9mu9ArGK6z+lUH2c8N/2UXcZI0tgxrjxu1itt4CZf4YkJpYklPLWMdyQ4dsj1Yyt4q79lYqpQRrGwAiHBR8s41ONyy/hmGb9bcd767lDH6Fi9x+TKlcu46gZtLaJCM4YbHQAAAABJRU5ErkJggg=="
              alt="guest-male" />Create your Account
      </button>
    </div>`;

    const createaccform = document.querySelector("#createAccountForm");

    createaccform.innerHTML += `
    <div class="createaccount-main">
      <div class="createaccount">
        <div class="icon-close" onclick="closeform()"><ion-icon size="large" name="close"></ion-icon></div>

        <div class="createaccount-heading">
            <h1>Create Account</h1>
        </div>

        <div>
          <div class="input-box">
            <span class="icon"><ion-icon name="person"></ion-icon></ion-icon></span>
            <input type="text" id="name" name="name" required>
            <label>Enter your Name</label><br>
          </div>
          <div class="input-box">
            <span class="icon"><ion-icon name="mail"></ion-icon></span>
            <input type="email" id="email" name="email" required>
            <label>Enter your Email</label><br>
          </div>
          <div class="input-box">
            <span class="icon"><ion-icon name="lock-closed"></ion-icon></ion-icon></span>
            <input type="password" id="password" name="password" required>
            <label>Create Password</label><br>
          </div>

          <button type="submit" class="submit-btn">Create Account</button>

        </div>
      </div>
    </div>`;

    const loginaccform = document.querySelector("#loginAccountForm");
    loginaccform.innerHTML += `
    <div class="loginaccount-main">
      <div class="createaccount">
        <div class="icon-close" onclick="closeform()"><ion-icon size="large"  name="close"></ion-icon></div>

        <div class="createaccount-heading">
            <h1>Login</h1>
        </div>

        <div>
          <div class="input-box">
            <span class="icon"><ion-icon name="mail"></ion-icon></span>
            <input type="email" id="email" name="email" required>
            <label>Enter your Email</label><br>
          </div>
          <div class="input-box">
            <span class="icon"><ion-icon name="lock-closed"></ion-icon></ion-icon></span>
            <input type="password" id="password" name="password" required>
            <label>Enter your Password</label><br>
          </div>
          <button type="submit" class="submit-btn">Login</button>
        </div>
        <div id="buttonDiv">
            <div id="g_id_onload"
            data-client_id="628266741208-kbm8u6kjl1geuacmd3igugl9vqdtfhdg.apps.googleusercontent.com"
            data-context="signin"
            data-ux_mode="popup"
            data-itp_support="true">
          </div>

          <div class="g_id_signin"
            data-type="standard"
            data-shape="rectangular"
            data-theme="outline"
            data-text="continue_with"
            data-size="large"
            data-logo_alignment="left"
            data-width="370px">
          </div>
        </div>
      </div>
    </div>`;

    var signInHolder = document.querySelector("#signInHolder");
    google.accounts.id.initialize({
      client_id:
        "628266741208-kbm8u6kjl1geuacmd3igugl9vqdtfhdg.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large", width: "370px", text: "continue_with" } // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  }
};

// Logout

function logout() {
  var logoutDropdown = document.getElementById("logout2");
  logoutDropdown.classList.toggle("show");
}

function signOut() {
  var jwt_token = getCookie("jwt_token");
  var email = getCookie("email");
  var name = getCookie("name");

  var expirationDate = new Date(0); // Set expiration to a past date
  var formattedExpirationDate = expirationDate.toUTCString();

  if (jwt_token) {
    cookieName = "jwt_token";
    document.cookie = `${cookieName}=; expires=${formattedExpirationDate}; path=/;`;
  } else {
    cookieEmail = "email";
    document.cookie = `${cookieEmail}=; expires=${formattedExpirationDate}; path=/;`;
    cookieName = "name";
    document.cookie = `${cookieName}=; expires=${formattedExpirationDate}; path=/;`;
  }

  location.reload();
}

function createAccountPopup() {
  document.getElementById("createAccountForm").style.display = "block";
  document.getElementById("loginAccountForm").style.display = "none";
  document.getElementById("signin-btns").style.display = "none";
}

function loginAccountPopup() {
  document.getElementById("loginAccountForm").style.display = "block";
  document.getElementById("createAccountForm").style.display = "none";
  document.getElementById("signin-btns").style.display = "none";
}

function closeform() {
  document.getElementById("createAccountForm").style.display = "none";
  document.getElementById("loginAccountForm").style.display = "none";
  document.querySelectorAll("input").forEach(function (input) {
    input.value = "";
  });
  document.getElementById("signin-btns").style.display = "flex";
}
