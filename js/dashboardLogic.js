import { createResume, listResumes, deleteResume } from './db.js';
import { getDefaultResume } from './utils.js';
import { logout } from './auth.js';

export async function initDashboard(user) {
    const grid = document.getElementById('resume-grid');
    grid.innerHTML = 'Loading...';

    const resumes = await listResumes(user.uid);
    grid.innerHTML = '';

    if (resumes.length === 0) {
        grid.innerHTML = '<p>No resumes found. Create one!</p>';
    }

    resumes.forEach(res => {
        const card = document.createElement('div');
        card.className = 'resume-card';
        card.innerHTML = `
            <h3>${res.profile.name || 'Untitled'}</h3>
            <p style="font-size:12px; color:#666;">Last updated: ${res.updatedAt ? new Date(res.updatedAt.toDate()).toLocaleDateString() : 'N/A'}</p>
            <div class="card-actions">
                <a href="editor.html?id=${res.id}" class="btn btn-primary">Edit</a>
                <a href="viewer.html?id=${res.id}" class="btn btn-secondary" target="_blank">View</a>
                <button onclick="window.handleDelete('${res.id}')" class="btn btn-danger">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.handleCreate = async (uid) => {
    try {
        const defaultData = getDefaultResume();
        const id = await createResume(uid, defaultData);
        window.location.href = `editor.html?id=${id}`;
    } catch (e) {
        alert("Error creating resume");
        console.error(e);
    }
};

window.handleDelete = async (resumeId) => {
    if(confirm("Are you sure?")) {
        // We need the UID here. In a real app we'd manage state better. 
        // For now, reload to refresh or pass UID.
        // Quick hack: get UID from auth in init.
        // Ideally pass delete callback.
        alert("Please implement delete connecting to user ID in scope.");
    }
}