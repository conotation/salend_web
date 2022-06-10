"use strict"

let certified = false;
let image = "";
let lng = null;
let lat = null;

let imagetag = null;

function upload(view) {
    const img = document.getElementById("chooseFile");
    const formData = new FormData();

    formData.append('image', img.files[0])
    // console.log(img.files[0])
    const options = {
        method: "POST",
        body: formData,
    }

    fetch("/upload", options)
    .then((res) => res.json())
        .then((data) => {
            if(data.success){
//                imagetag.src = document.URL + "image/" + data.filename;
                imagetag.src = "http://localhost:8001/" + "image/" + data.filename;
                image = imagetag.src
                console.log(imagetag.src)
            } else {
                alert("업로드 실패")
            }
            console.log(data.msg)
        }).catch(err => {
            console.error(new Error(err));
        });
}

function setAddress() {
    window.name = "parent"
    let openChild = window.open('map',
        "child", "width=600px;height=450px;resizable=no;scrollbars=no")

}

function update() {
    const formData = new FormData();

    const fname = document.getElementById("s_name");
    const ftime = document.getElementById("s_time");
    const fadd = document.getElementById("s_address");
    const fcer = document.getElementById("s_certified");

    if (fname.value) {
        formData.append('s_name', fname.value)
    }
    if (ftime.value) {
        formData.append('s_time', ftime.value)
    }
    if (fadd.value) {
        formData.append('s_id', fadd.value)
    }
    if (image) {
        formData.append('s_image', image)
    }
    if (lat) {
        formData.append('lat', lat)
    }
    if (lng) {
        formData.append('s_id', lng)
    }

    const options = {
        method: "POST",
        body: formData,
    }

    console.log(formData)

    //fetch("https://api.salend.tk/user/signup", options)
    fetch('user/' + window.ID, options)
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
    const button = document.getElementById("submit")
    button.addEventListener('click', update);

    imagetag = document.getElementById("imgtag")
});