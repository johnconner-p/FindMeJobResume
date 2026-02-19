// Debounce function to limit database writes
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Deep set value in object using path string "profile.name"
export function setDeepValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

// Generate default empty resume template if none provided
export function getDefaultResume() {
    // This is the structure from your resume.json
    return {
        settings: {
            layout: {
                left: ["summary", "experience"],
                right: ["education", "skills", "projects", "engagements"]
            },
            titles: {
                summary: "SUMMARY",
                experience: "EXPERIENCE",
                education: "EDUCATION",
                skills: "SKILLS",
                projects: "PROJECTS",
                engagements: "ENGAGEMENTS"
            },
            fontScale: 1
        },
        profile: {
            name: "YOUR NAME",
            title: "Professional Title",
            phone: "123-456-7890",
            email: "email@example.com",
            linkedin: "linkedin.com/in/yourname"
        },
        summary: "Professional summary goes here...",
        experience: [
            {
                role: "Job Title",
                company: "Company Name",
                location: "Location",
                duration: "Date - Date",
                description: "Short description",
                bullets: ["Achievement 1", "Achievement 2"]
            }
        ],
        education: [
            {
                degree: "Degree Name",
                institution: "University",
                location: "City",
                year: "Year",
                details: "GPA / Honors"
            }
        ],
        skills: [
            { category: "Category", items: "Skill 1, Skill 2" }
        ],
        projects: [
             {
                title: "Project Title",
                subtitle: "Context",
                duration: "Date",
                description: "Description",
                bullets: ["Detail 1"]
             }
        ],
        engagements: [
            { title: "Engagement Title", description: "Description" }
        ]
    };
}