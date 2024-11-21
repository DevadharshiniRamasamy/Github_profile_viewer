const TOKEN = "";
let currentPage = 1;
const reposPerPage = 5;

async function fetchGitHubAPI(url) {
  const headers = TOKEN ? { Authorization: `token ${TOKEN}` } : {};
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error("Failed to fetch data. Check the username or API rate limits.");
  }

  return response.json();
}

async function getGitHubProfile() {
  const username = document.getElementById("username").value;
  const profileDiv = document.getElementById("profile");
  const repoList = document.getElementById("repo-list");
  const loadMoreBtn = document.getElementById("load-more");

  if (!username) {
    alert("Please enter a GitHub username!");
    return;
  }

  try {
    const userData = await fetchGitHubAPI(`https://api.github.com/users/${username}`);

    document.getElementById("avatar").src = userData.avatar_url;
    document.getElementById("name").textContent = userData.name || "No name available";
    document.getElementById("bio").textContent = userData.bio || "No bio available";
    document.getElementById("followers").textContent = userData.followers;
    document.getElementById("following").textContent = userData.following;

    profileDiv.style.display = "block";
    currentPage = 1;
    repoList.innerHTML = "";
    loadMoreBtn.style.display = "inline-block";

    await getRepositories(userData.repos_url, currentPage);
  } catch (error) {
    alert(error.message);
    profileDiv.style.display = "none";
  }
}

async function getRepositories(reposUrl, page) {
  const repoList = document.getElementById("repo-list");
  const loadMoreBtn = document.getElementById("load-more");

  try {
    const repoData = await fetchGitHubAPI(`${reposUrl}?per_page=${reposPerPage}&page=${page}`);

    if (repoData.length === 0) {
      loadMoreBtn.style.display = "none";
      return;
    }

    repoData.forEach(repo => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
      repoList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching repositories:", error);
  }
}

async function loadMoreRepos() {
  const username = document.getElementById("username").value;
  const userData = await fetchGitHubAPI(`https://api.github.com/users/${username}`);
  currentPage++;
  await getRepositories(userData.repos_url, currentPage);
}

function toggleTheme() {
  const body = document.body;
  const themeToggleBtn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");
  themeToggleBtn.textContent = body.classList.contains("dark-mode")
    ? "Switch to Light Mode"
    : "Switch to Dark Mode";
}
