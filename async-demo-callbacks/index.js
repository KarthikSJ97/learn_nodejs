//Learn Callbacks

console.log('Before');
getUser(1, displayUser);
console.log('After');

//Named functions

function displayCommits(commits) {
    console.log(commits);
}

function displayRepoList(repoList) {
    console.log('repositories: ', repoList);
    getCommits(repoList[0], displayCommits);
}

function displayUser(user) {
    console.log(user);
    getUserRepositories(user.gitHubUsername, displayRepoList);
}

//Actual Functions

function getUser(id, callback) {
    setTimeout(() => {
        console.log('Getting user from Database...');
        callback({ id: id, gitHubUsername: 'KarthikSJ97' });
    }, 2000);
}

function getUserRepositories(username, callback) {
    setTimeout(() => {
        console.log(`Getting repos from GitHub for the username: ${username}...`);
        callback(["repo1", "repo2", "repo3"]);
    }, 2000);
}

function getCommits(repoName) {
    console.log(`Displaying all the comits of repo: ${repoName}`);
}