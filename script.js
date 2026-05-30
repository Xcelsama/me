const btn = document.getElementById("theme-toggle")
  btn.onclick = function(){
    document.body.classList.toggle("light");
    btn.textContent =document.body.classList.contains("dark") ? "☀️" : "🌙" ;
  }
