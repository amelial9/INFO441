async function init(){
    await loadIdentity();
    await loadUserInfo();
}

async function saveUserInfo(){
    //TODO: do an ajax call to save whatever info you want about the user from the user table
    //see postComment() in the index.js file as an example of how to do this
    try {
        const username = new URLSearchParams(window.location.search).get('user');
        if (!username) {
            return;
        }

        const favoriteBobaPlace = document.getElementById('favorite-boba-place-input').value;
        const personalWebsite = document.getElementById('personal-website-input').value;

        console.log('Saving user info:', { username, favoriteBobaPlace, personalWebsite });

        const response = await fetch(`/api/v3/userinfo/${username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                favoriteBobaPlace,
                personalWebsite
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save user info');
        }

        const savedData = await response.json();
        console.log('Saved user info:', savedData);

        await loadUserInfo();
    } catch (error) {
        console.error('Error saving user info:', error);
    }
}

async function loadUserInfo(){
    try {
        const username = new URLSearchParams(window.location.search).get('user');
        if (!username) {
            return;
        }

        document.getElementById('username-span').textContent = username;

        const response = await fetch(`/api/v3/userinfo/${username}`);
        if (!response.ok) {
            throw new Error('Failed to load user info');
        }

        const userInfo = await response.json();
        console.log('Loaded user info:', userInfo);
        
        document.getElementById('favorite-boba-place').textContent = userInfo.favoriteBobaPlace || 'Not specified';
        
        const websiteLink = document.getElementById('personal-website');
        if (userInfo.personalWebsite) {
            websiteLink.href = userInfo.personalWebsite;
            websiteLink.textContent = userInfo.personalWebsite;
        } else {
            websiteLink.textContent = 'Not specified';
        }

        document.getElementById('favorite-boba-place-input').value = userInfo.favoriteBobaPlace || '';
        document.getElementById('personal-website-input').value = userInfo.personalWebsite || '';
        
        if (username === myIdentity) {
            document.getElementById('user_info_new_div').classList.remove('d-none');
        } else {
            document.getElementById('user_info_new_div').classList.add('d-none');
        }

        loadUserInfoPosts(username)
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

async function loadUserInfoPosts(username){
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/posts?username=${encodeURIComponent(username)}`);
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
            ${escapeHTML(postInfo.description)}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}

async function deletePost(postID){
    let responseJson = await fetchJSON(`api/${apiVersion}/posts`, {
        method: "DELETE",
        body: {postID: postID}
    })
    loadUserInfo();
}