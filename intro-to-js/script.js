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