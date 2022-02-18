function askMyName(){
    const name = prompt("What is your name?");
    if (name != null){
        document.getElementById('name_h1').innerHTML = "My name is " + name;
    }
}

function helloWorld(){
    const h1message = document.getElementById('name_h1').innerHTML;
    if (h1message.length <= 11){
        alert("Tell me your name first man...")
    } else {
        alert(h1message + " คิดจะแซง ต้องแรงกว่านี้");
    }
}

function calAge(){
    const user_birth_year = prompt('นายเกิดปี ค.ศ. อะไรนะ?');
    const user_age = new Date().getFullYear() - Number(user_birth_year);
    alert(`โอ้โห้ว ยินดีด้วย นายอยู่ในประเทศนี่มา ${user_age} ปีแล้วหรอเนี่ยยยย`)
}

function loadProfile(){
    const name = 'Thitithorn';
    const province = 'Pathum thani';
    document.querySelector('#my-name').innerHTML = name;
    document.querySelector('#my-province').innerHTML = province;
}