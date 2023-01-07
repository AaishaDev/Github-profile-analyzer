
    const expand = document.querySelectorAll(".user_details>div");
    const repos = document.querySelector(".repos");
    const followers = document.querySelector(".followers");
    const followings = document.querySelector(".followings");
    const form = document.querySelector(".form");
    const formInput = document.querySelector(".form_input");
    const submitBtn = document.querySelector(".submit_btn");
    const container = document.querySelector(".container");
    const container2 = document.querySelector(".container2");
    const name = document.querySelector('[data-name]');
    const bio = document.querySelector('[data-bio]');
    const avatar=document.querySelector('[data-avatar]');
    const repoCount = document.querySelector('[data-repoCount]');
    const followerCount = document.querySelector('[data-followerCount]');
    const followingCount = document.querySelector('[data-followingCount]');
    const searchInput =  document.querySelector('[data-searchInput]');
    const repoDate = document.querySelector(".repo_date");
    const profileLink = document.querySelector(".container2 .btn")

   
  
    
    let userName = "";
  

    searchInput.onkeypress = (e) => {
          if (e.key === "Enter") {
          //  console.log("enter", searchInput.value);

           repos.innerHTML="";
           followers.innerHTML="";
           followings.innerHTML="";
           getUsers(searchInput.value)
          }
        }


    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (formInput.value) {
        userName = formInput.value;
        getUsers(userName);
      } else alert("Please enter username");
    });



    const getUsers = async (userName) => {
      submitBtn.value="loading..."
      try {
        let res = await fetch(`https://api.github.com/users/${userName}`);
        // console.log(res, "response");
        if (!res.ok) throw new Error("username not found");
        let data = await res.json();
        // console.log(data);

        let repoRes = await fetch(data.repos_url);
        let repoData = await repoRes.json();
        // console.log(repoData, "repo");


        let followersRes = await fetch(data.followers_url);
        let followersData = await followersRes.json();
        // console.log(followersData, "followers");

        profileLink.onclick=()=>{
          const link = document.createElement('a');
          link.href = `https://github.com/${data.login}`;
          link.setAttribute('target', '_blank');
          link.click();
        }


        name.innerHTML=data.name;
        bio.innerHTML=data.bio;
        avatar.src=data.avatar_url;
        repoCount.innerHTML = data.public_repos;
        followerCount.innerHTML = data.followers;
        followingCount.innerHTML = data.following;

        repoData.map((elem)=>{
            

          const dateString = elem.updated_at;
          const date = new Date(dateString);
          const dateOnly = date.toISOString().split('T')[0];

          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const readableDate = date.toLocaleDateString('en-US', options);
          // console.log(dateOnly, readableDate,"both dates"); 
            repos.innerHTML+=`
            <div class="repo">
          <p class="repo_name">${elem.name}</p>
          <p class="repo_description">
           ${elem.description?elem.description:""}
          </p>
          <div class="repo_detail">
            <p class="repo_language">${elem.language?elem.language:""}</p>
            <p class="repo_date">Updated on ${readableDate}</p>
          </div>
        </div>

            `
        })
      

        container.classList.add('hidden');
        container2.classList.remove('hidden');

    
        followersData.map(async(elem)=>{
         
          let res = await fetch(`https://api.github.com/users/${elem.login}`);
          let data = await res.json();
        // console.log(data, "follower data");

          followers.innerHTML+=`
          <div class="follower">
          <div>
            <img width="50px" src=${elem.avatar_url} alt="" />
          </div>
          <div>
            <div>
              <div class="follow_name">${data.name}</div>
              <div class="follow_user_name">@${elem.login}</div>
            </div>
            <div class="follower_bio">${data.bio?data.bio:""}</div>
          </div>
        </div>
          `
        })
        

       
        let followingsRes = await fetch(` https://api.github.com/users/${userName}/following `);
        // console.log(followingsRes);
        let followingsData = await followingsRes.json();
        // console.log("following data", followingsData)


        if (followingsData.length==0) followings.innerHTML=`<h2 style="text-align:center; >None</h2>`
        followingsData.map(async(elem)=>{

          let res = await fetch(`https://api.github.com/users/${elem.login}`);
          let data = await res.json();
        // console.log(data, "following data");
          followings.innerHTML+=`
          <div class="following">
          <div>
            <img width="50px" src=${elem.avatar_url} alt="" />
          </div>
          <div>
            <div>
              <div class="follow_name">${data.name}</div>
              <div class="follow_user_name">@${elem.login}</div>
            </div>
            <div class="follower_bio">${data.bio?data.bio:""}</div>
          </div>
        </div>
          `
        })
        
      
      } catch (error) {
        alert(error);
        submitBtn.value="Submit";
        formInput.value="";
      }
    };

    // click events

    expand.forEach((element, index) => {
      element.onclick = () => {
        switch (index) {
          case 1:
          
            repos.classList.add("hidden");
            followers.classList.remove("hidden");
            followers.classList.add("show");
            followings.classList.add("hidden");
            expand[0].classList.remove("active_tab");
            expand[1].classList.add("active_tab");
            expand[2].classList.remove("active_tab");

            break;
          case 2:
           
            repos.classList.add("hidden");
            followers.classList.add("hidden");
            followings.classList.remove("hidden");
            followings.classList.add("show");
            expand[0].classList.remove("active_tab");
            expand[1].classList.remove("active_tab");
            expand[2].classList.add("active_tab");

            break;

          default:
           
            repos.classList.remove("hidden");
            repos.classList.add("show");
            followers.classList.add("hidden");
            followings.classList.add("hidden");
            expand[0].classList.add("active_tab");
            expand[1].classList.remove("active_tab");
            expand[2].classList.remove("active_tab");

            break;
        }
      };
    });
