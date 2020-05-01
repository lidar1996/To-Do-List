var app = new Vue({
    el: "#myApp",
    data: {
        daysNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        capacityHoursPerDay: 24,
        isError: false,
        isEnoughRoom: false,
        username: "",
        userid: "",
        days: [{
            name: "default",
            tasksHours: 0,
            tasks: []
        },
        {
            name: "default",
            tasksHours: 0,
            tasks: []
        },
        {
            name: "default",
            tasksHours: 0,
            tasks: []
        },
        {
            name: "default",
            tasksHours: 0,
            tasks: []
        },
        {
            name: "default",
            tasksHours: 0,
            tasks: []
        },
        {
            name: "default",
            tasksHours: 0,
            tasks: []
        },
        {
            name: "default",
            tasksHours: 0,
            tasks: []
        }]
    },
    methods: {
        //get tasks from DB and diplay them to screen
        mounted: function () {
            const ref = firebase.firestore().collection("tasks");
            ref.onSnapshot(snapshot => {
                let daysTasks = [[], [], [], [], [], [], []];
                let hours = [0, 0, 0, 0, 0, 0, 0];
                snapshot.forEach(doc => {
                    let task = { ...doc.data(), id: doc.id };
                    if (this.userid === task.user && task.day >= 0) {
                        daysTasks[task.day].push(task);
                        hours[task.day] += task.length;
                    }
                });
                var i = 0;
                this.days.forEach(day => {
                    day.tasks = daysTasks[i];
                    day.tasksHours = hours[i];
                    this.sortDayByTasksLength(i++);
                })
            });
        },
        //update the app every refreshing 
        updateApp: function () {
            //update username
            this.username=firebase.auth().currentUser.displayName;
            //1.handle with update of day's name
            this.initDaysNames();
            //2.get the start date from user
            firebase.firestore().collection("users").doc(this.userid).get().then(snapshot => {
                if (snapshot.data()) {
                    startDate = new Date(snapshot.data().startDate.seconds * 1000);
                    //3.calculate the time that pass until the current date
                    var currentDay = new Date();
                    Difference_In_Days = Math.round((currentDay - startDate) / (1000 * 60 * 60 * 24));
                    
                    //5.update tasks days and delete the task with negative value of day 
                    var tasks = firebase.firestore().collection("tasks").where("user", "==", this.userid);
                    for (var i = 0; i < Difference_In_Days; i++) {
                        console.log("update " + Difference_In_Days + " times");
                        tasks.get().then(snapshot => {
                            snapshot.forEach(doc => {
                                if (doc.data().day == 0) {
                                    firebase.firestore().collection("tasks").doc(doc.id).delete();
                                }
                                else {
                                    var id = doc.id;
                                    const updateDay = firebase.functions().httpsCallable("updateDay");
                                    updateDay({
                                        id
                                    });
                                }

                            })
                        })
                    }
                }
            });
            //4.update again the start date of user
            const updateDate = firebase.functions().httpsCallable("updateDate");
            var id = this.userid;
            updateDate({ id });
        },
        //init the days name by the 7th upcoming days
        initDaysNames: function () {
            var index = new Date().getDay();
            this.days[0].name = this.daysNames[index];
            for (var i = 0; i < this.daysNames.length - 1; i++) {
                if (index < this.daysNames.length) {
                    index++;
                }
                if (index == this.daysNames.length) {
                    index = 0;
                }
                this.days[i + 1].name = this.daysNames[index];
            }
            console.log("weak days initialized ");
        },
        //checking input of task
        checkNameAndLocation: function (name, location) {
            if (name != "" && location != "") {
                return true;
            }
            return false;

        },
        //checking input of task
        checkLength: function (length, day) {
            if (isNaN(length) || length <= 0 || length > 24) {
                return false;
            }
            else if (Number(this.days[day].tasksHours) + Number(length) <= Number(this.capacityHoursPerDay)) {
                return true;
            }
        },
        //sort the tasks by their length
        sortDayByTasksLength: function (day) {
            this.days[day].tasks.sort(function (a, b) {
                return a.length - b.length;
            });
        },
        //remove task when it done
        removeTask: function (day, task) {
            console.log(task);
            firebase.firestore().collection("tasks").doc(task.id).delete();
            this.days[day].tasksHours -= task.length;
        }
    }
});