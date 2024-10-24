const cl = console.log;

const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const postsForm = document.getElementById("postsForm");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const postsContainer = document.getElementById("postsContainer");
const loader = document.getElementById("loader");


let BASE_URL = `https://jsonplaceholder.typicode.com`;

let POST_URL = `${BASE_URL}/posts`;

const snackBar = (title, icon) => {
    Swal.fire({
        title : title,
        icon : icon,
        timer : 2500
    })
}

const onDelete = (eve) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            let getId = eve.closest(".card").id;
            let DELETE_URL = `${BASE_URL}/posts/${getId}`;
            loader.classList.remove("d-none");
            fetch(DELETE_URL, {
                method : "DELETE",
                body : null,
                headers : {
                    "Content-type" : "application/json",
                    "Authorisation" : "Bearer Token from LS"
                }
            })
            .then(res => res.json())
            .then(res => {
                eve.closest(".card").remove();
            })
            .catch(err => {
                snackBar("Something Went Wrong !!!", "error")
            })
            .finally(() => {
                loader.classList.add("d-none");
            })
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
}

const onEdit = (eve) => {
    let getId = eve.closest(".card").id;
    cl(getId)
    localStorage.setItem("getId", getId);
    let EDIT_URL = `${BASE_URL}/posts/${getId}`;
    loader.classList.remove("d-none");
    fetch(EDIT_URL, {
        method : "GET",
        body : null,
        headers : {
            "Content-type" : "application/json",
            "Authorisation" : "Bearer Token from LS"
        }
    })
    .then(res => res.json())
    .then(res => {
        title.value = res.title;
        body.value = res.body;
        userId.value = res.userId;
        addBtn.classList.add("d-none");
        updateBtn.classList.remove("d-none");
        let getScrollValue = window.scrollY;
        if(getScrollValue > 100){
            window.scrollTo({
                top : 0,
                behavior : "smooth"
            });
        }
    })
    .catch(err => {
        snackBar("Something Went Wrong !!!", "error")
    })
    .finally(() => {
        loader.classList.add("d-none");
    })
}

let result = ``;
const createPostsCards = (arr) => {
    for(let i = 0; i < arr.length; i++){
        result += `
                        <div class="card mt-4" id="${arr[i].id}">
                            <div class="card-header text-capitalize">
                                <h4>${arr[i].title}</h4>
                            </div>
                            <div class="card-body text-capitalize">
                                <p>${arr[i].body}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                            </div>
                        </div>
        `
        postsContainer.innerHTML = result;
    }
}

const fetchAllPosts = () => {
    loader.classList.remove("d-none");
    fetch(POST_URL,{
        method : "GET",
        body : null,
        headers : {
            "Content-type" : "application/json",
            "Authorisation" : "Bearer Token from LS"
        }
    })
    .then(res => {
        return res.json()
    })
    .then(res => {
        createPostsCards(res);
    })
    .catch(err => {
        snackBar("Something Went Wrong !!!", "error")
    })
    .finally(() => {
        loader.classList.add("d-none");
    })
}

fetchAllPosts();

const createCard = (obj) => {
    let card = document.createElement("div");
    card.id = obj.id;
    card.className = 'card mt-4';
    card.innerHTML = `
                            <div class="card-header text-capitalize">
                                <h4>${obj.title}</h4>
                            </div>
                            <div class="card-body text-capitalize">
                                <p>${obj.body}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                            </div>
    `
    postsContainer.prepend(card);
    snackBar("A new Post added successfully !!!", "success");
}

const onSubmitBtnClick = (eve) => {
    eve.preventDefault();
    let obj = {
        title : title.value,
        body : body.value,
        userId : userId.value
    }
    loader.classList.remove("d-none");
    fetch(POST_URL , {
        method : "POST",
        body : JSON.stringify(obj),
        headers : {
            "Content-type" : "application/json",
            "Authorisation" : "Bearer Token from LS"
        }
    })
    .then(res => res.json())
    .then(res => {
        createCard(res);
    })
    .catch(err => {
        snackBar("Something Went Wrong !!!", "error")
    })
    .finally(() => {
        loader.classList.add("d-none");
    })
}

const onUpdateBtnClick = (eve) => {
    let getId = localStorage.getItem("getId");
    let UPDATE_URL = `${BASE_URL}/posts/${getId}`;

    let obj = {
        title : title.value,
        body : body.value,
        userId : userId.value
    }

    loader.classList.remove("d-none");
    fetch(UPDATE_URL, {
        method : "PATCH",
        body : JSON.stringify(obj),
        headers : {
            "Content-type" : "application/json",
            "Authorisation" : "Bearer Token from LS"
        }
    })
    .then(res => res.json())
    .then(res => {
       let card = [...document.getElementById(getId).children];
       card[0].innerHTML = `<h4>${res.title}</h4>`;
       card[1].innerHTML = `<p>${res.body}</p>`;
       updateBtn.classList.add("d-none");
       addBtn.classList.remove("d-none");
       snackBar("A Post updated successfully !!!", "success")
    })
    .catch(err => {
        snackBar("Something Went Wrong !!!", "error")
    })
    .finally(() => {
        loader.classList.add("d-none");
    })
}

postsForm.addEventListener("submit", onSubmitBtnClick);
updateBtn.addEventListener("click", onUpdateBtnClick);