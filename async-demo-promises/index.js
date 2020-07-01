//Learn Promises

console.log('Before');
getUser(1)
    .then(user => getUserRepositories(user.gitHubUsername))
    .then(repos => getCommits(repos[0]))
    .then(commits => console.log(commits))
    .catch(error => console.log(error.message));
console.log('After');


//Actual Functions

function getUser(id) {
    return new Promise((resolve, reject) => {
        //Kick off some async work
        setTimeout(() => {
            console.log('Getting user from Database...');
            resolve({ id: id, gitHubUsername: 'KarthikSJ97' });
        }, 2000);
    })

    
}

function getUserRepositories(username) {
    return new Promise((resolve, reject) => {
        //Async code
        setTimeout(() => {
            console.log(`Getting repos from GitHub for the username: ${username}...`);
            resolve(["repo1", "repo2", "repo3"]);
        }, 2000);
    })
}

function getCommits(repoName) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Getting commits from GitHub for the repo: ${repoName}...`);
            resolve(["commit1"]);
        }, 2000);
    })
}