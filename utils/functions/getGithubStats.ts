const USER_URL = "https://api.github.com/users/benz206";
const REPO_URL = "https://api.github.com/users/benz206/repos";
const LANGUAGES_URL =
    "https://api.github.com/repos/benz206/ben-portfolio/languages";

function formatBytes(bytes: number, decimals: number = 2) {
    if (bytes === 0) return "0 Bytes";

    bytes *= 1024;

    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(dm) + " " + sizes[i];
}

async function show() {
    let userResponse = await fetch(USER_URL);
    let repoResponse = await fetch(REPO_URL);
    let languagesResponse = await fetch(LANGUAGES_URL);

    let userJSON = await userResponse.json();
    let repoJSON = await repoResponse.json();
    let languagesJSON = await languagesResponse.json();

    let repoSize = 0;

    for (let repo of repoJSON) {
        repoSize += repo.size;
    }

    let githubLinesTotal = 0;

    // for (const [LANG, LINES] of Object.entries(languagesJSON)) {
    //     githubLinesTotal += LINES;
    // }

    // for (const [LANG, LINES] of Object.entries(languagesJSON)) {
    //     let percentage = Math.round(LINES / githubLinesTotal * 10000) / 100;
    // }

    // document.getElementById("github_reposize").textContent = formatBytes(repoSize);
    // document.getElementById("github_repos").textContent = userJSON.public_repos;
    // document.getElementById("github_followers").textContent = `${userJSON.followers} - ${userJSON.following}`;
}
