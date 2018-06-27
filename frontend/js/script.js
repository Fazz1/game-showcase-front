var latest_showcasesContainer = document.querySelector('.latest-showcases');
var baseUrl = 'http://localhost:3000/api';


var loginLi = document.querySelector('.login-li');
var signupLi = document.querySelector('.signup-li');
var logoutLi = document.querySelector('.logout-li');
var createShowcaseLi = document.querySelector('.createShowcase-li');

var currentUser = null;
var showcasesTable;
var HTTP;


document.addEventListener('DOMContentLoaded', function() {
  HTTP = axios.create({
    baseUrl: baseUrl
  });
  checkAuth();
  fetchShowCases();
}, false);



function loginAction(evt) {
  const email = document.querySelector('#loginEmail').value;
  const password = document.querySelector('#loginPassword').value;
  HTTP.post(`${baseUrl}/users/signin`, { email, password })
  .then(res => {
    console.log(res);
    $('#loginModal').modal('hide');
    saveCredential(res.data.user);
    loggedIn();
  })
  .catch(err => {
    console.log(err);
    alert('Please input the correct information');
  })

  return false;
};

function signupAction() {
  const username = document.querySelector('#signupUsername').value;
  const email = document.querySelector('#signupEmail').value;
  const password = document.querySelector('#signupPassword').value;
  const password1 = document.querySelector('#signupConfirmPassword').value;

  if (password !== password1) {
    alert('The password and confirm password are mismatch!');
    return false;
  }

  const address = document.querySelector('#signupAddress').value;
  HTTP.post(`${baseUrl}/users/signup`, { 
    username,
    email, 
    password,
    address,
  })
  .then(res => {
    $('#signupModal').modal('hide');
    alert("Successfully created your account\n Plese try to login");
  })
  .catch(err => {
    // console.log(err.response);
    alert(err.response.data.error);
  })
  return false;
}

function createShowcaseAction() {
  const title = document.querySelector('#gameTitle').value;
  const genre = document.querySelector('#gameGenre').value;
  const age = document.querySelector('#gameAge').value;
  const region = document.querySelector('#gameRegion').value;
  var platforms = document.querySelector('#gamePlatforms').value;
  platforms = platforms.split(",");
  platforms = platforms.filter(item => { if (item.trim() != "") return true; else return false; })
                        .map(item => { return item.trim() })

  HTTP.post(`${baseUrl}/showcases/create`, {
    title, genre, age, region, platforms
  }).then(res => {
    $('#createShowcaseModal').modal('hide');
    appendRowTotable(res.data.showcase);
  })
  .catch(err => {
    alert('can not create the showcase!');
  })
  return false;
}
function logoutAction() {
  HTTP.get(`${baseUrl}/users/logout`)
  .then(res => {
    loggedOut();
    window.location = '/';
  });
}
function appendRowTotable(data) {
  showcasesTable.row.add(data).draw(false);  
}
function removeRowFromTable(uiElement, data) {
  if (!confirm('Do you want to remove this showcase')) {
    return;
  }

  
  console.log(`removing the data ${data._id}`);
  HTTP.post(`${baseUrl}/showcases/delete`, {
    _id: data._id
  }).then(() => {
    showcasesTable
    .row(uiElement)
    .remove()
    .draw();
    console.log('Successfully removed')
  })
  .catch(err => {
    alert(err.response.data.error);
  })
}


function loggedIn() {
  logoutLi.style.display = 'block'
  createShowcaseLi.style.display = 'block';
  loginLi.style.display = 'none';
  signupLi.style.display = 'none';
  currentUser = getUser();
}
function loggedOut() {
  logoutLi.style.display = 'none';
  createShowcaseLi.style.display = 'none';
  loginLi.style.display = 'block';
  signupLi.style.display = 'block';
  currentUser = null;

  clearStorage();
  document.cookie = '';
}

function checkAuth() {
  HTTP.get(`${baseUrl}/users/checkAuth`)
  .then(res => {
    loggedIn();    
  })
  .catch(err => {
    loggedOut();
  })
}

function fetchShowCases() {
  HTTP.get(`${baseUrl}/showcases/all`)
  .then(res => {
    console.log(res.data);
    updateShowCases(res.data.showcases);
    displayLatestShowcases(res.data.showcases);
  })
  .catch(err => {
    console.log('error during calling api');
  })
}

function updateShowCases(showcases) {
  var content = '';
  showcasesTable = $('#showcase-table').DataTable({
    data: showcases,
    columns: [
      { data: "title" },
      { data: "genre" },
      { data: "age" },
      { data: "platforms" },
      { data: "region" },
      { data: "null", defaultContent: '<i class="material-icons">delete_forever</i>'}
    ],
  });
}

function displayLatestShowcases(showcases) {
  var content = '';
  for (var i=0; i<showcases.length; i++) {
    if (i > 5) break;

    let game = showcases[i];
    content += `
    <div class="card text-white bg-success mb-2">
      <div class="card-header"><h5>${game.title}</h5></div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-12"><div><b>Platforms:</b> ${game.platforms}</div></div>
          <div class="col-md-12"><div><b>Genre:</b> ${game.genre}</div></div>
          <div class="col-md-6"><div><b>Region:</b> ${game.region}</div></div>
          <div class="col-md-6"><div><b>Age:</b> >= ${game.age}</div></div>
        </div>
      </div>
    </div>
    `;
  }
  latest_showcasesContainer.innerHTML = content;
}





