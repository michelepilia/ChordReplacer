var SENS = 5; /*an user can change only SENS parameter*/
/*-----------------------------------------------------------------------------*/
var classToRotate = "knob-background";
var classToRotate2 = "." + classToRotate;
var knobNumbers = document.getElementsByClassName(classToRotate).length;
var amounts = Array(knobNumbers).fill(0);
var knobToRotateIndex = 0;
var oldY = 0;
var yDirection = "";
var maxAmount = 270 / SENS;
var minAmount = 0;

function updateView() {
    console.log(amounts[knobToRotateIndex])
    document.getElementsByClassName(classToRotate)[knobToRotateIndex].style.transform = "translate(10%,10%) rotate(" + amounts[knobToRotateIndex] * SENS + "deg)";
}

function f1(knob) {

    knob.onmousedown = preRotate;
}

function preRotate(data) {

    knobToRotateIndex = parseInt(data.target.getAttribute("id")[1]) - 1;
    document.addEventListener("mousemove", rotate, false);  
}

function rotate(data) {

    getMouseDirection(data);
    if (yDirection == "up") {
        if (amounts[knobToRotateIndex] < maxAmount) {
            amounts[knobToRotateIndex]++;
            updateView();
        }
    }
    else if (yDirection == "down") {
        if (amounts[knobToRotateIndex] > minAmount) {
            amounts[knobToRotateIndex]--;
            updateView();
        }
    }
}

function stop() {

    document.removeEventListener("mousemove", rotate);
}

function getMouseDirection(e) {

    if (e.pageY < oldY) {
        yDirection = "up";
    } else if (e.pageY > oldY) {
        yDirection = "down";
    }
    oldY = e.pageY;
}

document.querySelectorAll(classToRotate2).forEach(f1);
document.onmouseup = stop;
