"use strict"

function signup() {
    const formData = new FormData();

    const fid = document.getElementById("fid");
    const fpw = document.getElementById("fpw");
    const rpw = document.getElementById("rpw");

    formData.append('_id', fid.value)
    formData.append('_pw', fpw.value)
    formData.append('_rpw', rpw.value)

    const options = {
        method: "POST",
        body: formData,
    }

    console.log(formData)

    //fetch("https://api.salend.tk/user/signup", options)
    fetch('signup', options)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            if (data.code == 11000) {
                alert("회원가입 실패(이메일 중복)")
                return;
            }
            
            if (data.success) {
                console.log(data)

                alert("회원가입 성공")
                window.location.href = "login"
                return false;
            }
            console.log(data.msg)
        }).catch(err => {
            console.error(new Error(err));
        });
}

function back() {
    window.location.href = "login"
    return false;
}

$(document).ready(() => {
    const button = document.getElementById("btnJoin")
    button.addEventListener('click', signup);

    const backBtn = document.getElementById("back")
    backBtn.addEventListener('click', back)
});