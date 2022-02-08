function changeImg() {
    var image = document.getElementById('myImg');
    if (image.src.match("img/heart.png")) {
        image.src = "img/broken_heart.png";
    }
    else {
        image.src = "img/heart.png";
    }
    var t = document.getElementById('touch_text');
    if (image.src.match("img/heart.png")) {
        t.textContent = "🔽🔽🔽 Touch my heart 🔽🔽🔽";
    }
    else {
        t.textContent = "OUCH! That's hurt! Don't touch it too hard!";
    }
}
