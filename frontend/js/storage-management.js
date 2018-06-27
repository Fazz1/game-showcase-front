function saveCredential(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function getUser() {
  var user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user);    
  }
  return null;
}

function clearStorage() {
  localStorage.removeItem('user');
}