var heart_state = 0;
var fading = false;
var quot = [
    "OUCH! That's hurt! I already told you don't play with it!",
    "You want to fix it?",
    "undo it like pressing Ctrl+Z on a keyboard?",
    "For sure I can do that for you.",
    "But before that I will tell you something.",
    "Not everything in the world can be fix.",
    "Sometime your act might hurt someone",
    "Think before doing anything. So that you don't have to regret later."
];

function changeImg() {
    if(fading){
        return
    }
    var heart_image = document.getElementById('heart-img');
    var t = document.getElementById('touch_text');
    if(heart_state === 0){
        heart_image.src = "img/broken_heart.png";
    }
    if(heart_state < 8){
        fadeText(t, quot[heart_state]);
        heart_state += 1;
    } else {
        fadeText(t, "🔽❌❌ Don't play with my heart ❌❌🔽", 0.03);
        fixHeart(heart_image);
        heart_state = 0;
    }
}

function fixHeart(heart_img){
    heart_img.style.opacity = 1;
    var fadeOut = setInterval(function(){
        fading = true;
        heart_img.style.opacity -= 0.1;
        if(heart_img.style.opacity <= 0){
            heart_img.style.opacity = 0;
            clearInterval(fadeOut);
        }
    }, 80);
    setTimeout(function(){
        heart_img.src = "img/heart.png";
        var fadeIn = setInterval(function(){
            heart_img.style.opacity = heart_img.style.opacity*1 + 0.1; // opacity value isn't seen as a float
            if(heart_img.style.opacity >= 1){
                clearInterval(fadeIn);
                fading = false;
            }
        })
    },2000);
}

function fadeText(touch_text, text_to_change, fade_step = 0.1){
    touch_text.style.opacity = 1;
    console.log(touch_text.style.opacity);
    var fadeout = false;
    var fade = setInterval(function(){
        fading = true;
        if(!fadeout){
            touch_text.style.opacity -= fade_step;
            if(touch_text.style.opacity <= 0){
                touch_text.textContent = text_to_change;
                fadeout = true;
                touch_text.style.opacity = 0
            }
        } else {
            touch_text.style.opacity = touch_text.style.opacity*1 + fade_step; // opacity value isn't seen as a float
            if(touch_text.style.opacity >= 1){
                fading = false;
                clearInterval(fade);
            }
        }
    }, 30);
}

function openGithubPage(){
    window.open('https://www.github.com/thitithorn-k/');
}

function gotoProfilePage(){
    document.location = 'profile/';
}

function gotoMyStorePage(){
    document.location = 'my-store/';
}