 async function goToProfile() {
            const id = document.getElementById("userIdInput").value;
            
            // Instead of window.location.href (which refreshes the whole page), 
            // we will use 'fetch' to grab data and show it in our Compose-like UI.
            const response = await fetch("/users/" + id);
            
            if (response.ok) {
                const data = await response.json();
                
                // Update the UI "State" manually
                document.getElementById("resultCard").style.display = "block";
                document.getElementById("userName").innerText = "Name: " + data.name;
                document.getElementById("userRole").innerText = "Role: " + data.role;
                document.getElementById("userSkills").innerText = "Skills: " + data.skills;
            } else {
                alert("User not found!");
            }
        }

async function get_users_filtered(){

    const pattern = document.getElementById("userSeachByName").value ; 
    const response = await fetch("/users_filtered?pattern="+ pattern) ; 

    if (response.ok) {
        const data = await response.json() ;

        const container = document.getElementById("list_users_filtered") ; 
        container.style.display= "block" ; 

        container.innerHTML = "" ; 


        for (const id in data ) {
            const user = data[id] ; 


            const userRow = document.createElement("p");
            userRow.className = "user_item" ; 
            userRow.innerText = "Name: " + user.name + " | Role: " + user.role;

            container.appendChild(userRow)
        }

    }
}
async function getAllProfiles() {
    const response = await fetch("/users");

    if (response.ok) {
        // Fix 1: json is a function, so add ()
        const data = await response.json(); 

        const container = document.getElementById("lazycolumn");
        container.style.display = "block";
        
        // Fix 2: Clear the container first (so you don't double the list if you click twice)
        container.innerHTML = ""; 

        // Fix 3: Use 'of' for arrays/objects in JS
        for (const id in data) {
            const user = data[id];
            
            
            const userRow = document.createElement("div"); 
            
            userRow.className = "user-item"; 
            
            const userInfo = document.createElement("span");
            userInfo.innerText = `Name: ${user.name} | Role: ${user.role}`;
            
            const deleteBtn = document.createElement("button") ; 
            deleteBtn.className = "delete_user"
            deleteBtn.innerText = "Delete" ; 
            deleteBtn.style.marginLeft = "10px" ; 

            const editBtn = document.createElement("button") ; 
            editBtn.className = "edit_user" ; 
            editBtn.innerText = "Edit" ; 
            editBtn.style.marginLeft = "10px" ; 

            editBtn.onclick = () => {
                window.location.href = `/add?id=${user.id}` ; 
            } ;  

            deleteBtn.onclick = () => deleteUser(user.id);
            // 4. Attach it to the parent
            userRow.appendChild(userInfo) ; 
            userRow.appendChild(deleteBtn) ; 
            userRow.appendChild(editBtn) ; 
            container.appendChild(userRow);
        }
    }
}



// Global variable to keep track of the ID
let currentUserId = new URLSearchParams(window.location.search).get("id");

async function initializePage() {
    if (currentUserId) {
        // 1. Change the UI
        document.getElementById("add_header").innerText = "Update User";
        document.getElementById("added_button").innerText = "Update";

        // 2. Fetch and Fill
        const response = await fetch("/user/" + currentUserId);
        if (response.ok) {
            const user = await response.json();
            document.getElementById("newName").value = user.name;
            document.getElementById("newRole").value = user.role;
            document.getElementById("skills").value = user.skills;
        }
    }

    else {
        document.getElementById("add_header").innerText = "Insert User" ; 
        document.getElementById("added_button").innerText ="Insert" ; 

    }
}

// Call this immediately
initializePage();

async function submitStudent() {
    const userData = {
        name: document.getElementById("newName").value,
        role: document.getElementById("newRole").value,
        skills: document.getElementById("skills").value
    };

    if (currentUserId) {
        // --- PUT (Update) ---
        const response = await fetch(`/users/update/${currentUserId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        if (response.ok) {
            alert("Updated!");
            window.location.href = "/";
        }
    } else {
        // --- POST (Create) ---
        const response = await fetch("/add/add_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        if (response.ok) {
            alert("Added!");
            window.location.href = "/";
        }
    }
}



async function deleteUser(id) {


    
    
    const response = await fetch("/users/delete/" +  id , {

        method : "DELETE"
    });


    if(response.ok)
    {
        alert("User Deleted") ; 


        getAllProfiles() ; 

    }
    
}