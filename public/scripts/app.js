
//handaling with creating new task . 
var modal = document.getElementById("getInput");
var btn = document.getElementById("createTask");
var span = document.getElementsByClassName("close")[0];
var addTaskBtn = document.getElementById("addTaskToListBTN");
btn.onclick = function () {
    //open modal
    modal.style.display = "block";
}
span.onclick = function () {
    //close modal
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        //close modal
        modal.style.display = "none";

    }
}
//add task and checking input
addTaskBtn.onclick = function () {
    var taskName = document.getElementById("taskNameInput").value;
    var taskLength = Number(document.getElementById("taskLenngthInput").value);
    var taskLocation = document.getElementById("taskLocationInput").value;
    var taskDay = Number(document.getElementById("taskDay").value);
    if (app.checkNameAndLocation(taskName, taskLocation)) {
        app.$data.isError = false;
        //add to DB
        if (app.checkLength(taskLength, taskDay)) {
            app.$data.isEnoughRoom = false;
            const addTask = firebase.functions().httpsCallable("addTask");
            addTask({
                name: taskName,
                length: taskLength,
                location: taskLocation,
                day: taskDay

            });
            //**clean modal
            document.getElementById("taskNameInput").value = "";
            document.getElementById("taskLenngthInput").value = "";
            document.getElementById("taskLocationInput").value = "";

            modal.style.display = "none";
        }
        //not enough room
        else {
            app.$data.isEnoughRoom = true;
        }
    }
    //error input
    else {
        app.$data.isError = true;
    }
}
//task name component
Vue.component('task-component', {
    template: `  
    <div class="task">
         <li class="taskli">{{task.name}} ({{task.length}}hs)
            <button class="doneBtn" v-on:click="$emit(\'remove\')"><span>Done</span></button>
        </li>
    </div>  
  `,
    props: {
        task: Object
    }
});
//toggle between the forms of the login screen
$(function () {
    $(".btn").click(function () {
        $(".form-signin").toggleClass("form-signin-left");
        $(".form-signup").toggleClass("form-signup-left");
        $(".frame").toggleClass("frame-long");
        $(".signup-inactive").toggleClass("signup-active");
        $(".signin-active").toggleClass("signin-inactive");
        $(this).removeClass("idle").addClass("active");
    });
});
Vue.component("random-background",{
    template:`
        <button v-on:click="changePicture" class="backgroundBTN">Random Them</button>
    `,
    data:function(){
           return{ pictureArr:["url(https://www.kasandbox.org/programming-images/landscapes/beach-sunset.png)",
                    "url(https://www.kasandbox.org/programming-images/animals/dogs_collies.png)",
                    "url(https://www.kasandbox.org/programming-images/landscapes/crop-circle.png)",
                    "url(http://pngimg.com/uploads/autumn_leaves/autumn_leaves_PNG3612.png)"]
    }
                         
    },
    methods:{
        changePicture:function(){
            var rnd=Math.floor(Math.random() * 4);
            console.log(rnd);
            document.body.style.backgroundImage=this.pictureArr[rnd];

        }
    }

})



