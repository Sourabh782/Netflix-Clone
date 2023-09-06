let hide = [true, true, true, true, true, true];
const expand = (id)=>{
    const unhide = document.getElementById(id);
    if(hide[id-1]){
        unhide.classList.remove("hide");
        hide[id-1] = false;
    }
    else{
        unhide.classList.add("hide");
        hide[id-1] = true;
    }
}

window.addEventListener("load", ()=>{
    const pointer = document.querySelector(".pointer");
    clear = setTimeout(()=>{
        pointer.style.display = ("none");
    }, 3000);

    clear();
})