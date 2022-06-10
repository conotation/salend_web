"use strict"

function login() {
    const formData = new FormData();

    const fid = document.getElementById("fid");
    const fpw = document.getElementById("fpw");

    formData.append('_id', fid.value)
    formData.append('_pw', fpw.value)

    const options = {
        method: "POST",
        body: formData,
    }

    //fetch("https://api.salend.tk/user/login", options)
    fetch('login', options)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            if(data.success) {
                window.location.href = "store"
                return false;
            } else {
                alert("일치하는 정보가 없습니다.");
            }
            console.log(data.msg)
        }).catch(err => {
            console.error(new Error(err));
        });
}

function join() {
    console.log('눌리곤잇니')
    window.location.href = "signup"
    return false;
}

$(document).ready(() => {
    const button = document.getElementById("logbtn")
    button.addEventListener('click', login);

    const signup = document.getElementById("join")
    signup.addEventListener('click', join)
});