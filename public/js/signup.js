let signupApp = new Vue({
    el: ".signup",
    data: {
        id: '',
        name: '',
        password: ''
    },
    methods: {
        signup: function () {
            axios.post("/signup", {
                    id: signupApp.id,
                    name: signupApp.name,
                    password: signupApp.password
                })
                .then((res) => {
                    console.log(res)
                    if (!(res.data.success)) {
                        alert(res.data.message);
                    }
                    else{
                        alert(res.data.message)
                        location.href = res.data.redirectUrl;
                    }
                })
                .catch((error) => {
                    alert(error.message)
                })
        }
    }
})