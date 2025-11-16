// ZIP CODE EVENT
document.getElementById("zip").addEventListener("change", displayCity);

// STATE EVENT
document.getElementById("state").addEventListener("change", displayCounties);

// COUNTY EVENT to sync hidden field
document.getElementById("county").addEventListener("change", () => {
  document.getElementById("countyHidden").value = document.getElementById("county").value;
});

// USERNAME EVENT
document.getElementById("username").addEventListener("input", checkUsername);

// PASSWORD SUGGESTION
document.getElementById("pwd").addEventListener("focus", suggestPassword);

// FORM VALIDATION
document.getElementById("signupForm").addEventListener("submit", validateForm);

// LOAD STATES ON PAGE LOAD
getStates();


// ZIP CODE HANDLER
async function displayCity() {
  let zip = document.getElementById("zip").value;
  let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zip}`;

  let response = await fetch(url);
  let data = await response.json();

  if (!data) {
    document.getElementById("zipError").textContent = " Zip not found";
    document.getElementById("city").textContent = "";
    document.getElementById("latitude").textContent = "";
    document.getElementById("longitude").textContent = "";
    document.getElementById("cityHidden").value = "";
    return;
  }

  document.getElementById("zipError").textContent = "";
  document.getElementById("city").textContent = data.city;
  document.getElementById("latitude").textContent = data.latitude;
  document.getElementById("longitude").textContent = data.longitude;

  // sync hidden field for welcome page
  document.getElementById("cityHidden").value = data.city;
}


// STATE HANDLER
async function displayCounties() {
  let state = document.getElementById("state").value;
  let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;

  let response = await fetch(url);
  let data = await response.json();

  let countyList = document.getElementById("county");
  countyList.innerHTML = "";

  for (let c of data) {
    countyList.innerHTML += `<option value="${c.county}">${c.county}</option>`;
  }

  // sync hidden field
  document.getElementById("countyHidden").value = countyList.value;
}


// USERNAME CHECK HANDLER
async function checkUsername() {
  let username = document.getElementById("username").value;
  let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;

  let response = await fetch(url);
  let data = await response.json();

  let msg = document.getElementById("usernameError");

  if (data.available) {
    msg.textContent = " Available";
    msg.style.color = "green";
  } else {
    msg.textContent = " Taken";
    msg.style.color = "red";
  }

  // sync hidden username for welcome.html
  document.getElementById("usernameHidden").value = username;
}


// PASSWORD SUGGESTION
async function suggestPassword() {
  let url = "https://csumb.space/api/suggestedPassword.php?length=8";
  let response = await fetch(url);
  let data = await response.json();

  document.getElementById("suggestedPwd").textContent = " " + data.password;
}


// LOAD STATES
async function getStates() {
  let url = "https://csumb.space/api/allStatesAPI.php";
  let response = await fetch(url);
  let data = await response.json();

  let stateList = document.getElementById("state");

  stateList.innerHTML = `<option>Select One</option>`;

  for (let s of data) {
    stateList.innerHTML += `<option value="${s.usps}">${s.state}</option>`;
  }
}


// FORM VALIDATION
async function validateForm(e) {
  let username = document.getElementById("username").value;

  // recheck username on submit to make sure result is fresh
  let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
  let response = await fetch(url);
  let data = await response.json();

  if (!data.available) {
    e.preventDefault();
    alert("Username is taken");
    return;
  }

  let pwd = document.getElementById("pwd").value;
  let again = document.getElementById("pwdAgain").value;

  document.getElementById("passwordError").textContent = "";

  if (pwd.length < 6) {
    e.preventDefault();
    document.getElementById("passwordError").textContent = " Password must be at least 6 characters";
    return;
  }

  if (pwd !== again) {
    e.preventDefault();
    document.getElementById("passwordError").textContent = " Passwords do not match";
    return;
  }
}
