import { getResume, updateResume } from './db.js';
import { renderResume, applyFontScale } from './resumeRenderer.js';
import { debounce, setDeepValue } from './utils.js';

let globalData = {};
let currentUserId = null;
let currentResumeId = null;

export async function initEditor(userId, resumeId) {
    currentUserId = userId;
    currentResumeId = resumeId;
    
    try {
        const docData = await getResume(userId, resumeId);
        globalData = docData; // docData contains the wrapper, we need inner data? 
        // Based on DB schema: { id, data: {...}, ... }
        // If createResume saved it wrapped in 'data', unwrap it. 
        // Or if it saved flat. Let's assume flat for simplicity in db.js, 
        // BUT db.js createResume spread resumeData. 
        
        // Render
        const container = document.getElementById('resume-container');
        renderResume(globalData, container, { editable: true });
        
        initSidebar();
        setupAutoSave();
        
        // Expose addBullet for the inline buttons
        window.addBullet = (key, index) => {
            if (globalData[key] && globalData[key][index]) {
                if (!globalData[key][index].bullets) globalData[key][index].bullets = [];
                globalData[key][index].bullets.push("New bullet");
                saveAndRender();
            }
        };

    } catch (err) {
        console.error(err);
        alert("Error loading resume");
        window.location.href = 'dashboard.html';
    }
}

function saveAndRender() {
    renderResume(globalData, document.getElementById('resume-container'), { editable: true });
    triggerSave();
}

// Debounced Save
const triggerSave = debounce(async () => {
    const status = document.getElementById('save-status');
    status.innerText = "Saving...";
    try {
        await updateResume(currentUserId, currentResumeId, globalData);
        status.innerText = "Saved";
        setTimeout(() => status.innerText = "", 2000);
    } catch (e) {
        status.innerText = "Error Saving";
        console.error(e);
    }
}, 1000);

function setupAutoSave() {
    // Listen for edits in contenteditable fields
    const container = document.getElementById('resume-container');
    
    // MutationObserver is better for contenteditable than 'input' sometimes, 
    // but 'input' is sufficient for text changes. 'blur' is safer for logic.
    // Let's use 'blur' to update data model, and 'input' to detect "unsaved" state if needed.
    
    container.addEventListener('blur', (e) => {
        if (e.target.isContentEditable && e.target.dataset.path) {
            const val = e.target.innerText; // or innerHTML if you want bolding
            const path = e.target.dataset.path;
            
            // Allow bold tags? innerHTML is risky but required for 'Bold Selection' tool
            setDeepValue(globalData, path, e.target.innerHTML);
            triggerSave();
        }
    }, true);
}

function initSidebar() {
    // Layout Lists
    const listLeft = document.getElementById('list-left');
    const listRight = document.getElementById('list-right');
    
    const createLi = (id) => {
        const li = document.createElement('li');
        li.className = 'sortable-item';
        li.dataset.id = id;
        li.innerText = globalData.settings.titles[id] || id.toUpperCase();
        return li;
    };

    if (globalData.settings.layout.left) globalData.settings.layout.left.forEach(id => listLeft.appendChild(createLi(id)));
    if (globalData.settings.layout.right) globalData.settings.layout.right.forEach(id => listRight.appendChild(createLi(id)));

    // Initialize SortableJS
    new Sortable(listLeft, { group: 'sections', animation: 150 });
    new Sortable(listRight, { group: 'sections', animation: 150 });

    // Font Scale
    const slider = document.getElementById('fontScaleSlider');
    if(slider) {
        slider.value = globalData.settings.fontScale || 1;
        slider.oninput = (e) => {
            const val = parseFloat(e.target.value);
            globalData.settings.fontScale = val;
            applyFontScale(val);
            triggerSave();
        };
    }
}

// Attached to Window for HTML buttons
window.updateLayoutFromSidebar = () => {
    const leftItems = Array.from(document.getElementById('list-left').children).map(li => li.dataset.id);
    const rightItems = Array.from(document.getElementById('list-right').children).map(li => li.dataset.id);
    globalData.settings.layout.left = leftItems;
    globalData.settings.layout.right = rightItems;
    saveAndRender();
};

window.downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(globalData, null, 4));
    const node = document.createElement('a');
    node.href = dataStr;
    node.download = "resume.json";
    document.body.appendChild(node);
    node.click();
    node.remove();
};