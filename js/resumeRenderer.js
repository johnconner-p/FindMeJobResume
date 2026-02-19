// This function renders the resume EXACTLY as your old editor.html/script.js did.
// It handles both View Mode (clean) and Edit Mode (contenteditable).

export function renderResume(data, container, options = { editable: false }) {
    container.innerHTML = ''; // Clear container

    // Wrapper div (resume-content)
    const content = document.createElement('div');
    content.className = 'resume-content';

    // 1. Header
    content.appendChild(renderHeader(data.profile, options.editable));

    // 2. Columns
    const cols = document.createElement('div');
    cols.className = 'cols';

    const leftCol = document.createElement('div');
    leftCol.className = 'col-left';
    leftCol.id = 'col-left';

    const rightCol = document.createElement('div');
    rightCol.className = 'col-right';
    rightCol.id = 'col-right';

    // Render Layout based on settings
    const layout = data.settings.layout || { left: [], right: [] };

    layout.left.forEach(key => {
        renderSection(key, data, leftCol, options.editable);
    });

    layout.right.forEach(key => {
        renderSection(key, data, rightCol, options.editable);
    });

    cols.appendChild(leftCol);
    cols.appendChild(rightCol);
    content.appendChild(cols);

    container.appendChild(content);

    // Apply Font Scale
    if (data.settings.fontScale) {
        applyFontScale(data.settings.fontScale);
    }
}

// Helper to generate attributes for editable fields
function getAttrs(path, editable) {
    return editable ? `contenteditable="true" data-path="${path}"` : '';
}

function renderHeader(profile, editable) {
    const header = document.createElement('header');
    header.className = 'resume-header';
    
    // Header Left
    const left = document.createElement('div');
    left.className = 'header-left';
    left.innerHTML = `
        <h1 id="name" ${getAttrs('profile.name', editable)}>${profile.name}</h1>
        <h2 id="title" ${getAttrs('profile.title', editable)}>${profile.title}</h2>
    `;

    // Header Right (Contact) - Applied Structural Fix from your old code
    const right = document.createElement('div');
    right.id = 'contact';
    
    // NOTE: In your old code, you moved contact INTO header-left via JS. 
    // We replicate that final structure here directly for consistency.
    const contactHtml = `
        <div class="contact-row" style="display: flex; align-items: center; gap: 6px;">
            <i class="fas fa-phone-alt" style="font-size: 0.9em;"></i>
            <span ${getAttrs('profile.phone', editable)} style="min-width: 50px;">${profile.phone}</span> 
        </div>
        <div class="contact-row" style="display: flex; align-items: center; gap: 6px;">
            <i class="fas fa-envelope" style="font-size: 0.9em;"></i>
            <span ${getAttrs('profile.email', editable)} style="min-width: 50px;">${profile.email}</span> 
        </div>
        <div class="contact-row" style="display: flex; align-items: center; gap: 6px;">
            <i class="fab fa-linkedin" style="font-size: 0.9em;"></i>
            <span ${getAttrs('profile.linkedin', editable)} style="min-width: 50px;">${profile.linkedin}</span> 
        </div>
    `;
    
    right.innerHTML = contactHtml;
    
    // The "Fix": Append contact to left container, style it
    right.style.textAlign = 'left';
    right.style.marginTop = '8px';
    right.style.display = 'flex';
    right.style.flexWrap = 'wrap';
    right.style.gap = '15px';
    right.style.alignItems = 'center';
    right.classList.remove('header-right'); // As per your old script

    left.appendChild(right);
    header.appendChild(left);
    // header-right div is effectively merged into left now, keeping DOM consistent with old result

    return header;
}

function renderSection(key, data, container, editable) {
    const sectionData = data[key];
    const sectionTitle = (data.settings.titles && data.settings.titles[key]) ? data.settings.titles[key] : key.toUpperCase();

    const section = document.createElement('section');
    section.className = 'section';
    section.dataset.key = key;

    // Title
    const h3 = document.createElement('h3');
    h3.className = 'section-title';
    if(editable) {
        h3.contentEditable = true;
        h3.onblur = (e) => { 
             // Special case: update titles map
             data.settings.titles[key] = e.target.innerText;
             // Trigger global save event manually if needed, or rely on mutation observer
        };
    }
    h3.innerText = sectionTitle;
    section.appendChild(h3);

    const contentDiv = document.createElement('div');
    if (key === 'summary') {
        contentDiv.innerHTML = `<p class="summary-text" ${getAttrs('summary', editable)}>${sectionData}</p>`;
    } 
    else if (key === 'experience') renderExperience(sectionData, contentDiv, key, editable);
    else if (key === 'education') renderEducation(sectionData, contentDiv, key, editable);
    else if (key === 'skills') renderSkills(sectionData, contentDiv, key, editable);
    else if (key === 'projects') renderProjects(sectionData, contentDiv, key, editable);
    else if (key === 'engagements') renderEngagements(sectionData, contentDiv, key, editable);

    section.appendChild(contentDiv);
    container.appendChild(section);
}

function renderExperience(items, container, key, editable) {
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'exp-item';
        
        const bulletsHtml = item.bullets ? item.bullets.map((b, bi) => 
            `<li ${getAttrs(`${key}.${index}.bullets.${bi}`, editable)}>${b}</li>`
        ).join('') : '';

        div.innerHTML = `
            <div class="exp-header">
                <span ${getAttrs(`${key}.${index}.role`, editable)}>${item.role}</span>
                <span style="display:flex; align-items:center;">
                    <i class="fas fa-calendar-alt" style="margin-right: 4px; font-size: 0.85em;"></i>
                    <span ${getAttrs(`${key}.${index}.duration`, editable)}>${item.duration}</span>
                </span>
            </div>
            <div class="exp-sub">
                <span ${getAttrs(`${key}.${index}.company`, editable)}>${item.company}</span>
                <span style="display:flex; align-items:center;">
                    <i class="fas fa-map-marker-alt" style="margin-right: 4px; font-size: 0.85em;"></i>
                    <span ${getAttrs(`${key}.${index}.location`, editable)}>${item.location}</span>
                </span>
            </div>
            <div class="exp-desc" ${getAttrs(`${key}.${index}.description`, editable)}>${item.description || ''}</div>
            <ul class="exp-bullets">${bulletsHtml}</ul>
            ${editable ? `<button onclick="window.addBullet('${key}', ${index})" style="background:none; border:none; color:blue; font-size:10px; cursor:pointer; margin-left:15px;">+ Add Bullet</button>` : ''}
        `;
        container.appendChild(div);
    });
}

function renderEducation(items, container, key, editable) {
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'sidebar-item';
        div.innerHTML = `
            <div class="sidebar-title" ${getAttrs(`${key}.${index}.degree`, editable)}>${item.degree}</div>
            <div class="sidebar-sub"><span ${getAttrs(`${key}.${index}.institution`, editable)}>${item.institution}</span></div>
            <div class="sidebar-sub sidebar-italic">
                <span style="display:flex; align-items:center;">
                    <i class="fas fa-map-marker-alt" style="margin-right: 4px; font-size: 0.85em;"></i>
                    <span ${getAttrs(`${key}.${index}.location`, editable)}>${item.location}</span>
                </span>
                <span style="display:flex; align-items:center;">
                    <i class="fas fa-calendar-alt" style="margin-right: 4px; font-size: 0.85em;"></i>
                    <span ${getAttrs(`${key}.${index}.year`, editable)}>${item.year}</span>
                </span>
            </div>
            <div class="sidebar-sub"><span ${getAttrs(`${key}.${index}.details`, editable)}>${item.details}</span></div>
        `;
        container.appendChild(div);
    });
}

function renderSkills(items, container, key, editable) {
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'skill-group';
        div.innerHTML = `
            <div class="skill-cat" ${getAttrs(`${key}.${index}.category`, editable)}>${item.category}</div>
            <div class="skill-list" ${getAttrs(`${key}.${index}.items`, editable)}>${item.items}</div>
        `;
        container.appendChild(div);
    });
}

function renderProjects(items, container, key, editable) {
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'sidebar-item';
        const bulletsHtml = item.bullets ? `<ul class="sidebar-bullets">${item.bullets.map((b, bi) => `<li ${getAttrs(`${key}.${index}.bullets.${bi}`, editable)}>${b}</li>`).join('')}</ul>` : '';

        div.innerHTML = `
            <div class="sidebar-title" ${getAttrs(`${key}.${index}.title`, editable)}>${item.title}</div>
            <div class="sidebar-sub sidebar-italic">
                <span ${getAttrs(`${key}.${index}.subtitle`, editable)}>${item.subtitle}</span>
                <span style="display:flex; align-items:center;">
                    <i class="fas fa-calendar-alt" style="margin-right: 4px; font-size: 0.85em;"></i>
                    <span ${getAttrs(`${key}.${index}.duration`, editable)}>${item.duration}</span>
                </span>
            </div>
            <div class="sidebar-desc" ${getAttrs(`${key}.${index}.description`, editable)}>${item.description}</div>
            ${bulletsHtml}
            ${editable ? `<button onclick="window.addBullet('${key}', ${index})" style="background:none; border:none; color:blue; font-size:10px; cursor:pointer; margin-left:12px;">+ Add Bullet</button>` : ''}
        `;
        container.appendChild(div);
    });
}

function renderEngagements(items, container, key, editable) {
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'sidebar-item';
        div.innerHTML = `
            <div class="sidebar-title"><i class="fas fa-check-circle"></i> <span ${getAttrs(`${key}.${index}.title`, editable)}>${item.title}</span></div>
            <div class="sidebar-desc" ${getAttrs(`${key}.${index}.description`, editable)}>${item.description}</div>
        `;
        container.appendChild(div);
    });
}

export function applyFontScale(scale) {
    const styleId = 'dynamic-font-scale';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
        body { font-size: ${10.5 * scale}pt !important; }
        .resume-header h1 { font-size: ${24 * scale}pt !important; }
        .resume-header h2 { font-size: ${10 * scale}pt !important; }
        .section-title { font-size: ${11 * scale}pt !important; }
        .exp-header { font-size: ${10.5 * scale}pt !important; }
        .sidebar-title { font-size: ${10.5 * scale}pt !important; }
        .exp-desc, .sidebar-desc, .skill-list, li { font-size: ${10 * scale}pt !important; }
        .exp-sub, .sidebar-sub { font-size: ${10 * scale}pt !important; }
        .contact-row { font-size: ${9 * scale}pt !important; }
        .contact-row i { font-size: ${10 * scale}pt !important; }
    `;
}