var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function() {

    // get repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    // if name exists then setup the dom element
    if (repoName) {
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    } else {

        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
    
};

var getRepoIssues = function(repo) {
    console.log(repo);
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        // request successful
        if (response.ok) {
            response.json().then(function(data) {
            // pass response data to dom function
                displayIssues(data);
                // check if api has paginatedd issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        } else {
            //redirect to home page 
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    for (var i = 0; i < issues.length; i++) {
        // create  a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("herf", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create a span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // apppend to container 
        issueEl.appendChild(titleEl);

        // create a type element 
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)"
        }

        // appendd to container
        issueEl.appendChild(typeEl);
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues visit ";
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target","_blank");

    // append to wwarning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();