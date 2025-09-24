async function loadProject() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("id");

    if (!projectId) {
        document.querySelector("#project-title").innerText = "Project Not Found";
        return;
    }

    try {
        const res = await fetch("data/projects.json");
        const projects = await res.json();

        if (!projects[projectId]) {
            document.querySelector("#project-title").innerText = "Invalid Project ID";
            return;
        }

        const project = projects[projectId];

        // Fill in data
        document.querySelector("#project-title").innerText = project.title;
        document.querySelector("#project-description").innerText = project.description;
        document.querySelector("#project-video source").src = project.video;
        document.querySelector("#project-video").poster = project.thumbnail;
        document.querySelector("#project-video").load();

        document.querySelector("#project-tech").innerText = project.tech.join(", ");
        document.querySelector("#project-platform").innerText = project.platform;
        document.querySelector("#project-year").innerText = project.year;

        document.querySelector("#download-link").href = project.download;
        document.querySelector("#github-link").href = project.github;

    } catch (err) {
        console.error("Error loading project:", err);
    }
}

loadProject();
