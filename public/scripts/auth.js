const div1 = document.querySelector(".app");
const div2 = document.querySelector(".auth");
const registerForm = document.querySelector(".form-signup");
const loginForm = document.querySelector(".form-signin");
const signOut = document.querySelector(".signout");

//the first div to show
var load = function () {
    div1.style.display = "none";
    div2.style.display = "block";
}
//register form
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const name = registerForm.fullname.value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(async (user) => {     
        if (user) {
            console.log("registered " + name, user);
            var userf = firebase.auth().currentUser;
            await userf.updateProfile({
                displayName: name
            });
            registerForm.reset();
            location.reload();

        }
    })
        .catch((error) => {
            registerForm.querySelector(".error-auth").textContent = error.message;
        })
});
//login form
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
        console.log("logged in", user.uid);
        loginForm.reset();
        location.reload();
    })
        .catch((error) => {
            loginForm.querySelector(".error-auth").textContent = error.message;
        })
});
//sign out 
signOut.addEventListener('click', () => {
    firebase.auth().signOut()

});
//add listener to change states and switch screens
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        div2.style.display = "none";
        app.userid = user.uid;
        app.updateApp();
        app.mounted();
    }
    else {
        load();
    }
})







