const ProjectEngine = {
    STORAGE_KEY: 'ENGINEERING_SUITE_PROJECTS',
    
    getAllProjects() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    },

    init() {
        let projects = this.getAllProjects();
        if (Object.keys(projects).length === 0) {
            projects['Default Main Project'] = this.captureCurrentInputs();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
        }
        this.renderDropdown();
    },

    renderDropdown() {
        const select = document.getElementById('projectSelect');
        if (!select) return;
        const projects = this.getAllProjects();
        select.innerHTML = '';
        Object.keys(projects).forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.innerText = name;
            select.appendChild(opt);
        });
    },

    captureCurrentInputs() {
        const inputs = document.querySelectorAll('input');
        const state = {};
        inputs.forEach(inp => {
            if (inp.id) state[inp.id] = inp.value;
        });
        return state;
    },

    saveCurrentProject() {
        const select = document.getElementById('projectSelect');
        if (!select || !select.value) return;
        const projects = this.getAllProjects();
        projects[select.value] = this.captureCurrentInputs();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
        alert(`Project "${select.value}" saved successfully!`);
    },

    createNewProject() {
        const nameInput = document.getElementById('newProjectName');
        if (!nameInput || !nameInput.value.trim()) {
            alert('Please enter a project name');
            return;
        }
        const name = nameInput.value.trim();
        const projects = this.getAllProjects();
        projects[name] = this.captureCurrentInputs();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
        nameInput.value = '';
        this.renderDropdown();
        document.getElementById('projectSelect').value = name;
        this.loadSelectedProject();
        alert(`New project "${name}" created and loaded!`);
    },

    loadSelectedProject() {
        const select = document.getElementById('projectSelect');
        if (!select || !select.value) return;
        const projects = this.getAllProjects();
        const state = projects[select.value];
        if (state) {
            Object.keys(state).forEach(id => {
                const inp = document.getElementById(id);
                if (inp) inp.value = state[id];
            });
            const titleEl = document.getElementById('currentProjectTitle');
            if (titleEl) titleEl.innerText = select.value;
            if (typeof recalculateAll === 'function') recalculateAll();
        }
    }
};
