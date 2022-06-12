"use strict"

let image = ""
let imagetag = null;

function upload(view) {
    const img = document.getElementById("chooseFile");
    const formData = new FormData();

    formData.append('image', img.files[0])
    formData.append('item', true)
    // console.log(img.files[0])
    const options = {
        method: "POST",
        body: formData,
    }

    fetch("/upload", options)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
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

function setValue(e) {
    console.log('call set val')
    const discount = document.getElementById("f_sale")

    const price1 = document.getElementById("f_price")
    const price2 = document.getElementById("f_price2")

    if(price1.value && price2.value){
        discount.value = Math.round((1 - (price2.value / price1.value)) * 100) + "%";
    }
}

function update() {
    const formData = new FormData();

    const f_name = document.getElementById("f_name")
    const f_price = document.getElementById("f_price")
    const f_price2 = document.getElementById("f_price2")
    const f_exp = document.getElementById("f_exp")
    const f_pick = document.getElementById("f_pick")

    if(f_name.value == "" && f_price.value == "" && f_price2.value == "" && f_pick.selectedIndex == 0) {
        alert('비어있는 항목이 있습니다.')
        return
    }

    if(!window.NAME){
        alert("매장 설정을 완료해주세요.")
        return;
    }
    formData.append('i_name', f_name.value)
    formData.append('i_store_name', window.NAME)
    formData.append('i_store_id', window.ID)
    if(image)
        formData.append('i_image', image)
    formData.append('i_price', f_price.value)
    formData.append('i_now_price', f_price2.value)
    formData.append('i_exp', "" + f_exp.value)
    formData.append('i_tag', f_pick.selectedIndex)

    const options = {
        method: "POST",
        body: formData
    }

    fetch('write', options)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            alert("상품 추가 성공")
            // location.href = "manage"
            // return false;
        }).catch(err => {
            console.log(err);
        })

}

$(document).ready(() => {
    const button = document.getElementById("submit")
    const price1 = document.getElementById("f_price")
    const price2 = document.getElementById("f_price2")

    button.addEventListener('click', update);

    price1.addEventListener('change', setValue);
    price2.addEventListener('change', setValue);

    imagetag = document.getElementById("imgtag")
});