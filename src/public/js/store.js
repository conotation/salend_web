"use strict"

let certified = false;
let image = "";


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
                imagetag.src = window.location.origin + "/image/" + data.filename;
//                imagetag.src = "http://localhost:8001/" + "image/" + data.filename;
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

function setCertify(){
    const formData = new FormData();
    const id = "" + window.ID;

    formData.append('_id', id)
    console.log(formData.get('_id'))
    const options = {
        method: "POST",
        body: formData
    }

    fetch("certified", options)
    .then((res) => res.json())
    .then((data) => {
        if(data.success){
            alert("인증 성공");
        }
    })
}

function update() {
    console.log("눌리고잇어요")
    const formData = new FormData();

    const fname = document.getElementById("s_name");
    const ftime = document.getElementById("s_time");
    const fadd = document.getElementById("s_address");
    const fadd2 = document.getElementById("s_address1");
    const fcer = document.getElementById("s_certified");
    const flat = document.getElementById("s_lat");
    const flng = document.getElementById("s_lng");

    if (fname.value) {
        formData.append('s_name', fname.value)
    }
    if (ftime.value) {
        formData.append('s_time', ftime.value)
    }
    if (fadd2.value) {
        formData.append('s_address', fadd2.value + fadd.value)
    }
    if (image) {
        formData.append('s_image', image)
    } else {
        formData.append('s_image', imagetag.src)
    }
    if (flat.innerText) {
        formData.append('lat', flat.innerText)
    }
    if (flng.innerText) {
        formData.append('lng', flng.innerText)
    }

    formData.append('x_id', window.ID)

    const options = {
        method: "POST",
        body: formData,
    }

    console.log(formData)

    //fetch("https://api.salend.tk/user/signup", options)
    fetch('store', options)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            alert("갱신 성공")
            location.reload();
            return false;
        }).catch(err => {
            console.error(new Error(err));
        });
}

$(document).ready(() => {
    const button = document.getElementById("submit")
    button.addEventListener('click', update);

    imagetag = document.getElementById("imgtag")
});