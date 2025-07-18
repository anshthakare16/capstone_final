
// Add these after your existing global variables
let appData = {
  students: {},
  mentors: []
};
let isFinalListHODLoggedIn = false;
let currentMentorEditUser = null;
let currentFinalizeTeam = null;
let newIdeaBuffer = [];
let currentEditTeam = null;
let isHODLoggedIn = false;
// ====== APPLICATION STATE ======
let currentTeam = {};
let isLoggedIn = false;
let selectedMentorTeams = {};
let currentLoggedMentor = null;

// ====== SUPABASE DATA FUNCTIONS ======
// Load data from backend
async function loadDataFromBackend() {
    try {
        console.log('Loading data from backend...');
        
        // Load students data
        const studentsResponse = await fetch(`${API_BASE_URL}/api/students`);
        const studentsData = await studentsResponse.json();
        appData.students = studentsData.students;
        
        // Load mentors data
        const mentorsResponse = await fetch(`${API_BASE_URL}/api/mentors`);
        const mentorsData = await mentorsResponse.json();
        appData.mentors = mentorsData.mentors.map(mentor => mentor.name);
        
        console.log('Data loaded successfully:', { 
            students: Object.keys(appData.students).length,
            mentors: appData.mentors.length
        });
        
    } catch (error) {
        console.error('Error loading data from backend:', error);
    }
}

async function getTeams() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/teams`);
        if (!response.ok) throw new Error('Failed to fetch teams');
        
        const data = await response.json();
        return data.teams || [];
    } catch (error) {
        console.error('Error fetching teams:', error);
        return [];
    }
}


// Add this function to handle leader department selection
// Add this in your DOMContentLoaded or initialization function
// Authentication API calls
const API_BASE_URL = 'http://localhost:3000'; // Change this to your deployed backend URL

async function authenticateAdmin(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Admin authentication error:', error);
        return false;
    }
}
// Fetch mentors from backend
async function fetchMentors() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/mentors`);
        const data = await response.json();
        return data.mentors;
    } catch (error) {
        console.error('Error fetching mentors:', error);
        // Fallback to hardcoded mentors if API fails
        return [
            { username: 'mentor1', name: 'Jyoti Khurpude' },
            { username: 'mentor2', name: 'Sanjivani Kulkarni' },
            { username: 'mentor3', name: 'Mrunal Fatangare' },
            { username: 'mentor4', name: 'Hemlata Ohal' },
            { username: 'mentor5', name: 'Farahhdeeba Shaikh' },
            { username: 'mentor6', name: 'Prerana Patil' },
            { username: 'mentor7', name: 'Yogesh Patil' },
            { username: 'mentor8', name: 'Vilas Rathod' },
            { username: 'mentor9', name: 'Pradeep Paygude' },
            { username: 'mentor10', name: 'Kajal Chavan' },
            { username: 'mentor11', name: 'Megha Dhotey' },
            { username: 'mentor12', name: 'Pallavi Nehete' },
            { username: 'mentor13', name: 'Nita Dongre' },
            { username: 'mentor14', name: 'Mrunal Aware' },
            { username: 'mentor15', name: 'Shilpa Shitole' },
            { username: 'mentor16', name: 'Vaishali Langote' },
            { username: 'mentor17', name: 'Sulkshana Malwade' }
        ];
    }
}

// Populate mentor dropdowns
async function populateMentorDropdowns() {
    try {
        // Use the fetchMentors function that calls your backend
        const mentors = await fetchMentors();
        
        // Find all mentor dropdown select elements
        const mentorSelects = document.querySelectorAll('select[id^="mentor-"], select[id^="edit-mentor-"]');
        
        mentorSelects.forEach(select => {
            // Clear existing options
            select.innerHTML = '<option value="">Select Mentor</option>';
            
            // Populate with mentors from backend
            mentors.forEach((mentor, index) => {
                const option = document.createElement('option');
                option.value = index; // Use index as value (0-16)
                option.textContent = mentor.name;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error populating mentor dropdowns:', error);
    }
}


// Add showPage function if missing
function showPage(pageId) {
    console.log('Showing page:', pageId);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    // Show the target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Page shown successfully:', pageId);
    } else {
        console.error('Page not found:', pageId);
    }
    
    // Handle specific page initialization
    if (pageId === 'view-teams') {
        setTimeout(async () => {
            console.log('Loading view teams...');
            await displayTeams();
            await displayRemainingStudents();
        }, 100);
    } else if (pageId === 'team-management') {
        setTimeout(async () => {
            console.log('Loading team management...');
            await displayTeamsManagement();
        }, 100);
    } else if (pageId === 'mentor-panel') {
        setTimeout(() => {
            initializeMentorPanel();
        }, 100);
    }
}
async function displayTeams() {
    try {
        console.log('Fetching teams for display...');
        const teams = await getTeams();
        console.log('Teams fetched:', teams);
        
        const teamsContainer = document.getElementById('teams-list');
        if (!teamsContainer) {
            console.error('Teams container not found');
            return;
        }
        
        if (!teams || teams.length === 0) {
            teamsContainer.innerHTML = '<p class="no-teams">No teams registered yet.</p>';
            return;
        }
        
        // Display teams
        teamsContainer.innerHTML = teams.map(team => `
            <div class="team-card">
                <h3>${team.name}</h3>
                <p><strong>Team ID:</strong> ${team.team_id}</p>
                <p><strong>Leader:</strong> ${getStudentNameById(team.leader)}</p>
                <p><strong>Members:</strong> ${team.members.length}</p>
                <div class="team-members">
                    ${team.members.map(memberId => `
                        <span class="member-tag">${getStudentNameById(memberId)}</span>
                    `).join('')}
                </div>
                <p><strong>Status:</strong> ${team.status || 'Pending'}</p>
                <p><strong>Assigned Mentor:</strong> ${team.assigned_mentor || 'Not assigned'}</p>
            </div>
        `).join('');
        
        console.log('Teams displayed successfully');
    } catch (error) {
        console.error('Error displaying teams:', error);
        const teamsContainer = document.getElementById('teams-list');
        if (teamsContainer) {
            teamsContainer.innerHTML = '<p class="error">Error loading teams. Please try again.</p>';
        }
    }
}

async function displayTeamsManagement() {
    try {
        console.log('Fetching teams for management...');
        const teams = await getTeams();
        console.log('Teams fetched for management:', teams);
        
        const teamsContainer = document.getElementById('teams-management-list');
        if (!teamsContainer) {
            console.error('Teams management container not found');
            return;
        }
        
        if (!teams || teams.length === 0) {
            teamsContainer.innerHTML = '<p class="no-teams">No teams registered yet.</p>';
            return;
        }
        
        // Display teams with delete buttons
        teamsContainer.innerHTML = teams.map(team => `
            <div class="team-management-card">
                <h3>${team.name}</h3>
                <p><strong>Team ID:</strong> ${team.team_id}</p>
                <p><strong>Leader:</strong> ${getStudentNameById(team.leader)}</p>
                <p><strong>Members:</strong> ${team.members.length}</p>
                <button class="btn btn--danger" onclick="deleteTeam('${team.team_id}')">
                    Delete Team
                </button>
            </div>
        `).join('');
        
        console.log('Teams management displayed successfully');
    } catch (error) {
        console.error('Error displaying teams management:', error);
        const teamsContainer = document.getElementById('teams-management-list');
        if (teamsContainer) {
            teamsContainer.innerHTML = '<p class="error">Error loading teams. Please try again.</p>';
        }
    }
}
function getStudentNameById(studentId) {
    if (!studentId) return 'Unknown';
    
    const parts = studentId.split('_');
    if (parts.length !== 2) return studentId;
    
    const [department, index] = parts;
    const departmentStudents = appData.students[department];
    
    if (departmentStudents && departmentStudents[parseInt(index)]) {
        return departmentStudents[parseInt(index)];
    }
    
    return studentId;
}
async function debugViewTeams() {
    console.log('=== DEBUG: View Teams Issue ===');
    
    try {
        // Test database connection
        const teams = await getTeams();
        console.log('Teams from database:', teams);
        console.log('Number of teams:', teams.length);
        
        // Test DOM elements
        const teamsContainer = document.getElementById('teams-list');
        console.log('Teams container exists:', !!teamsContainer);
        
        // Test display function
        await displayTeams();
        
        return teams;
    } catch (error) {
        console.error('Debug error:', error);
        return [];
    }
}

// Add initializeApp function if missing
async function initializeApp() {
    console.log('Initializing app...');
    
    // Populate dropdowns
    populateDepartmentDropdowns();
    await populateMentorDropdowns();
    
    // Add any other initialization code here
}

// Populate department dropdowns
function populateDepartmentDropdowns() {
    const departments = Object.keys(appData.students);
    
    // Find all department dropdown select elements
    const deptSelects = document.querySelectorAll('select[id$="-department"], select[id$="-dept"]');
    
    deptSelects.forEach(select => {
        // Clear existing options
        select.innerHTML = '<option value="">Select Department</option>';
        
        // Populate with departments
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            select.appendChild(option);
        });
    });
}

async function authenticateHOD(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/hod`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('HOD authentication error:', error);
        return false;
    }
}

async function authenticateMentor(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/mentor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        return result.success ? result : { success: false };
    } catch (error) {
        console.error('Mentor authentication error:', error);
        return { success: false };
    }
}

async function handleTeamDetailsForm(event) {
    event.preventDefault();
     console.log('Form submitted!');
    
    hideError('team-error');
    
    const validationResult = await validateStudentSelections();
    console.log('Validation result:', validationResult);
    
    if (!validationResult) {
        console.log('Validation failed, returning false');
        return false;
    }
    hideError('team-error');
    
    if (!(await validateStudentSelections())) return false;
    
    const teamName = document.getElementById('team-name').value.trim();
    const leaderDepartment = document.getElementById('leader-department').value;
    const teamLeader = document.getElementById('team-leader').value;
    const member2 = document.getElementById('member-2').value;
    const member3 = document.getElementById('member-3').value;
    const member4 = document.getElementById('member-4').value;
    
    // Updated validation - only team name and leader required
    if (!teamName || !leaderDepartment || !teamLeader) {
        showError('team-error', 'Please fill in team name and select a team leader.');
        return false;
    }
    
    // Check for duplicate team name
    const existingTeams = await getTeams();
    if (existingTeams.some(team => team.name.toLowerCase() === teamName.toLowerCase())) {
        showError('team-error', 'Team name already exists. Please choose a different name.');
        return false;
    }
    
    // Build members array - start with just the leader
    const members = [teamLeader];
    if (member2) members.push(member2);
    if (member3) members.push(member3);
    if (member4) members.push(member4);
    
    // Ensure minimum 1 member (leader) and maximum 4 members
    if (members.length < 1) {
        showError('team-error', 'Team must have at least 1 member (the leader).');
        return false;
    }
    
    if (members.length > 4) {
        showError('team-error', 'Team cannot have more than 4 members.');
        return false;
    }
    
    currentTeam = {
        team_id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: teamName,
        leader: teamLeader,
        members: members
    };
    
    showPage('mentor-selection');
    return false;
}
async function handleTeamEditForm(event) {
    event.preventDefault();
    hideError('edit-error');
    
    try {
        // Collect form data
        const teamName = document.getElementById('edit-team-name-input').value.trim();
        const newLeader = document.getElementById('new-leader-select').value;
        
        // Collect mentor preferences (as array of integers)
        const mentorPreferences = [];
        for (let i = 1; i <= 4; i++) {
            const mentorIndex = document.getElementById(`edit-mentor-${i}`).value;
            if (mentorIndex !== '') {
                mentorPreferences.push(parseInt(mentorIndex));
            }
        }
        
        // Collect project ideas as array
        const projectIdeas = [
            document.getElementById('edit-idea-1').value.trim(),
            document.getElementById('edit-idea-2').value.trim(),
            document.getElementById('edit-idea-3').value.trim()
        ];
        
        // Validation
        if (!teamName) {
            showError('edit-error', 'Team name is required.');
            return;
        }
        
        if (mentorPreferences.length !== 4) {
            showError('edit-error', 'All four mentor preferences are required.');
            return;
        }
        
        if (projectIdeas.some(idea => !idea)) {
            showError('edit-error', 'All three project ideas are required.');
            return;
        }
        
        // Update team data
        const updatedTeam = {
            name: teamName,
            leader: newLeader || currentEditTeam.leader,
            members: currentEditTeam.members,
            mentor_preferences: mentorPreferences,
            project_ideas: projectIdeas
        };
        
        // Save to backend
        const response = await fetch(`${API_BASE_URL}/api/teams/${currentEditTeam.team_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTeam)
        });
        
        if (!response.ok) throw new Error('Failed to update team');
        
        alert('Team updated successfully!');
        closeEditModal();
        await loadEditTeams();
        
    } catch (error) {
        console.error('Error updating team:', error);
        showError('edit-error', 'Error updating team: ' + error.message);
    }
}

// Add this function for debugging
async function debugSupabase() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('teams').select('*');
        console.log('Supabase data:', data);
        console.log('Supabase error:', error);
        console.log('Number of teams:', data ? data.length : 0);
        return data;
    } catch (err) {
        console.error('Connection error:', err);
        return null;
    }
}

// Helper function to get all registered students from all teams
async function getAllRegisteredStudents() {
    try {
        const teams = await getTeams();
        const registeredStudents = new Set();
        
        teams.forEach(team => {
            // Add all members from each team to the set
            team.members.forEach(member => {
                registeredStudents.add(member);
            });
        });
        
        return Array.from(registeredStudents);
    } catch (error) {
        console.error('Error getting registered students:', error);
        return [];
    }
}

// Helper function to get available (unregistered) students for a department
async function getAvailableStudentsForDepartment(department, currentTeamId = null) {
    try {
        const allStudents = appData.students[department] || [];
        const teams = await getTeams();
        const registeredStudentIds = new Set();
        
        teams.forEach(team => {
            // Add all member IDs from ALL teams (including current team being edited)
            team.members.forEach(memberId => {
                registeredStudentIds.add(memberId);
            });
        });
        
        // Filter out ALL registered students (including current team members)
        const availableStudents = allStudents.filter((student, index) => {
            const studentId = `${department}_${index}`;
            return !registeredStudentIds.has(studentId);
        });
        
        console.log('Department:', department);
        console.log('All students:', allStudents);
        console.log('Registered student IDs:', Array.from(registeredStudentIds));
        console.log('Available students:', availableStudents);
        
        return availableStudents;
    } catch (error) {
        console.error('Error getting available students:', error);
        return [];
    }
}



function backToDashboardWithLogout(panelType) {
    // Auto-logout based on panel type
    switch(panelType) {
        case 'edit-teams':
            // HOD logout for edit teams
            if (isHODLoggedIn) {
                hodLogout();
            }
            break;
            
        case 'view-final-list':
            // HOD logout for final list
            if (isFinalListHODLoggedIn) {
                finalListHODLogout();
            }
            break;
            
        case 'mentor-edit':
            // Mentor logout for mentor edit
            if (currentMentorEditUser) {
                mentorEditLogout();
            }
            break;
            
        case 'mentor-panel':
            // Mentor logout for mentor panel
            if (currentLoggedMentor) {
                mentorLogout();
            }
            break;
    }
    
    // Then navigate back to dashboard
    showPage('admin-dashboard');
}

async function handleMentorEditLogin() {
    const username = document.getElementById('mentor-edit-username').value.trim();
    const password = document.getElementById('mentor-edit-password').value.trim();
    
    hideError('mentor-edit-login-error');
    
    if (!username || !password) {
        showError('mentor-edit-login-error', 'Please enter both username and password.');
        return;
    }
    
    const result = await authenticateMentor(username, password);
    
    if (!result.success) {
        showError('mentor-edit-login-error', 'Invalid mentor credentials.');
        return;
    }
    
    // Set current mentor
    currentMentorEditUser = {
        username: username,
        name: result.name,
        index: parseInt(username.replace('mentor', '')) - 1
    };
    
    // Hide login form and show dashboard
    const loginForm = document.querySelector('#mentor-edit .mentor-login-form');
    if (loginForm) {
        loginForm.style.display = 'none';
    }
    
    const dashboard = document.getElementById('mentor-edit-dashboard');
    if (dashboard) {
        dashboard.style.display = 'block';
    }
    
    const nameElement = document.getElementById('mentor-edit-logged-name');
    if (nameElement) {
        nameElement.textContent = result.name;
    }
    
    // Load mentor's confirmed teams
    loadMentorEditTeams();
}



// Mentor Edit Logout Handler
function mentorEditLogout() {
    currentMentorEditUser = null;
    
    // Show login form
    const loginForm = document.querySelector('#mentor-edit .mentor-login-form');
    if (loginForm) {
        loginForm.style.display = 'block';
    }
    
    // Hide dashboard
    const dashboard = document.getElementById('mentor-edit-dashboard');
    if (dashboard) {
        dashboard.style.display = 'none';
    }
    
    // Clear form fields
    const usernameField = document.getElementById('mentor-edit-username');
    const passwordField = document.getElementById('mentor-edit-password');
    
    if (usernameField) {
        usernameField.value = '';
    }
    
    if (passwordField) {
        passwordField.value = '';
    }
    
    // Hide any error messages
    hideError('mentor-edit-login-error');
}


// Load Mentor's Confirmed Teams
async function loadMentorEditTeams() {
    if (!currentMentorEditUser) {
        console.log('No current mentor user');
        return;
    }
    
    try {
        console.log('Loading teams for mentor:', currentMentorEditUser.name); // Debug log
        
        const teams = await getTeams();
        console.log('All teams:', teams); // Debug log
        
        // Filter teams confirmed by this mentor
        const confirmedTeams = teams.filter(team => {
            const isAccepted = team.mentor_status === 'accepted';
            const isFinalMentor = team.final_mentor === currentMentorEditUser.name;
            
            console.log(`Team ${team.name}: status=${team.mentor_status}, final_mentor=${team.final_mentor}, matches=${isAccepted && isFinalMentor}`);
            
            return isAccepted && isFinalMentor;
        });
        
        console.log('Confirmed teams:', confirmedTeams); // Debug log
        
        displayMentorEditTeams(confirmedTeams);
        
        // Add event listeners to deselect buttons after displaying teams
        setTimeout(() => {
            document.querySelectorAll('.deselect-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const teamId = this.getAttribute('data-team-id');
                    console.log('Deselect button clicked for team:', teamId); // Debug log
                    deselectTeam(teamId);
                });
            });
        }, 100);
        
    } catch (error) {
        console.error('Error loading mentor edit teams:', error);
        alert('Error loading teams: ' + error.message);
    }
}



// Display Mentor's Confirmed Teams
function displayMentorEditTeams(teams) {
    const container = document.getElementById('mentor-edit-teams-display');
    
    if (teams.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>You have no confirmed teams.</p></div>';
        return;
    }
    
    let html = '<div class="mentor-edit-teams-container">';
    
    teams.forEach(team => {
        const leader = getStudentById(team.leader);
        const leaderName = leader ? leader.name : 'Unknown';
        const memberCount = team.members ? team.members.length : 0;
        const projectIdeas = team.project_ideas || [];
        
        html += `
            <div class="mentor-edit-team-card">
                <div class="team-card-header">
                    <h5>${team.name}</h5>
                    <span class="status-badge status-confirmed">Confirmed</span>
                </div>
                
                <div class="team-details">
                    <p><strong>Leader:</strong> ${leaderName}</p>
                    <p><strong>Total Members:</strong> ${memberCount}</p>
                    <p><strong>Final Idea:</strong> ${team.final_idea || 'Not finalized'}</p>
                    <p><strong>Registered:</strong> ${new Date(team.registration_date).toLocaleDateString()}</p>
                </div>
                
                <div class="project-ideas">
                    <strong>Project Ideas:</strong>
                    <ol>
                        <li>${projectIdeas[0] || 'Not provided'}</li>
                        <li>${projectIdeas[1] || 'Not provided'}</li>
                        <li>${projectIdeas[2] || 'Not provided'}</li>
                    </ol>
                </div>
                
                <div class="mentor-edit-actions">
                    <button class="btn btn--danger" onclick="deselectTeam('${team.team_id}')">
                        Deselect Team
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}



// Deselect Team Function
async function deselectTeam(teamId) {
    alert('Deselect function called for team: ' + teamId);
    console.log('Deselect button clicked for team:', teamId);
    
    if (!currentMentorEditUser) {
        alert('Please login first.');
        return;
    }
    
    if (!confirm('Are you sure you want to deselect this team? It will be forwarded to the next mentor preference.')) {
        return;
    }
    
    try {
        // Get fresh team data
        const teams = await getTeams();
        const team = teams.find(t => t.team_id === teamId);
        
        if (!team) {
            alert('Team not found.');
            return;
        }
        
        console.log('Team found:', team);
        
        const mentorPreferences = team.mentor_preferences || [];
        const currentMentorIndex = team.current_mentor_index || 0;
        
        // Check if there's a next mentor preference
        if (currentMentorIndex + 1 < mentorPreferences.length) {
            // Move to next mentor preference
            const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mentor_status: 'pending',
                    current_mentor_index: currentMentorIndex + 1,
                    final_mentor: null,
                    final_idea: null
                })
            });
            
            if (!response.ok) throw new Error('Failed to update team');
            
            alert('Team deselected and forwarded to next mentor preference.');
        } else {
            // No more mentor preferences, mark as rejected
            const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mentor_status: 'rejected',
                    final_mentor: null,
                    final_idea: nullw
                })
            });
            
            if (!response.ok) throw new Error('Failed to update team');
            
            alert('Team deselected. No more mentor preferences available.');
        }
        
        // Refresh the display
        await loadMentorEditTeams();
        
    } catch (error) {
        console.error('Error deselecting team:', error);
        alert('Error deselecting team: ' + error.message);
    }
}




async function handleFinalListHODLogin(event) {
    event.preventDefault();
    hideError('final-list-hod-login-error');
    
    const username = document.getElementById('final-list-hod-username').value.trim();
    const password = document.getElementById('final-list-hod-password').value.trim();
    
    const isValid = await authenticateHOD(username, password);
    
    if (isValid) {
        isFinalListHODLoggedIn = true;
        document.getElementById('final-list-hod-login-section').style.display = 'none';
        document.getElementById('final-list-dashboard').style.display = 'block';
        await loadFinalList();
    } else {
        showError('final-list-hod-login-error', 'Invalid HOD credentials. Please try again.');
    }
}


function finalListHODLogout() {
    isFinalListHODLoggedIn = false;
    document.getElementById('final-list-hod-login-section').style.display = 'block';
    document.getElementById('final-list-dashboard').style.display = 'none';
    document.getElementById('final-list-hod-username').value = '';
    document.getElementById('final-list-hod-password').value = '';
    hideError('final-list-hod-login-error');
}

async function loadFinalList() {
    if (!isFinalListHODLoggedIn) return;
    
    const teams = await getTeams();
    
    // Filter teams that have both final mentor and final idea
    const finalizedTeams = teams.filter(team => 
        team.mentor_status === 'accepted' && 
        team.final_mentor && 
        team.final_idea
    );
    
    displayFinalList(finalizedTeams);
}

function displayFinalList(teams) {
    const container = document.getElementById('final-list-display');
    
    if (teams.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No finalized teams found.</p></div>';
        return;
    }
    
    let html = `
        <div class="final-list-table-container">
            <table class="final-list-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Members</th>
                        <th>Mentor Preferences</th>
                        <th>Project Ideas</th>
                        <th>Final Mentor</th>
                        <th>Final Idea</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    teams.forEach(team => {
        // Get member names
        const memberNames = team.members.map(memberId => {
            const student = getStudentById(memberId);
            return student ? student.name : 'Unknown';
        });
        
        // Get mentor preferences
        const mentorPreferences = team.mentor_preferences || [];
        const mentorNames = mentorPreferences.map(index => 
            appData.mentors[index] || 'Unknown'
        );
        
        // Get project ideas
        const projectIdeas = team.project_ideas || [];
        
        html += `
            <tr>
                <td class="team-name-cell">${team.name}</td>
                <td class="members-cell">
                    ${memberNames.map(name => `<div class="member-item">${name}</div>`).join('')}
                </td>
                <td class="preferences-cell">
                    ${mentorNames.map(name => `<div class="preference-item">${name}</div>`).join('')}
                </td>
                <td class="ideas-cell">
                    ${projectIdeas.map(idea => `<div class="idea-item">${idea}</div>`).join('')}
                </td>
                <td class="final-mentor-cell">${team.final_mentor}</td>
                <td class="final-idea-cell">${team.final_idea}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

function exportFinalListToCSV() {
    if (!isFinalListHODLoggedIn) return;

    getTeams().then(teams => {
        const finalizedTeams = teams.filter(team =>
            team.mentor_status === 'accepted' &&
            team.final_mentor &&
            team.final_idea
        );

        if (finalizedTeams.length === 0) {
            alert('No finalized teams to export.');
            return;
        }

        // Header row (matches your second screenshot)
        let csvContent = 'name,members,mentor_preferences,project_ideas,final_mentor,final_idea\n';

        finalizedTeams.forEach(team => {
            // Members, mentors, ideas as newline-separated strings—each team is only one row.
            const members = team.members.map(memberId => {
                const student = getStudentById(memberId);
                return student ? student.name : '';
            }).join('\n');

            const mentorPreferences = (team.mentor_preferences || []).map(index =>
                appData.mentors[index] || ''
            ).join('\n');

            const projectIdeas = (team.project_ideas || []).join('\n');

            // Always wrap each value in quotes, so Excel handles newlines correctly
            function q(val) { return `"${(val||'').replace(/"/g, '""')}"`; }

            csvContent += [
                q(team.name),
                q(members),
                q(mentorPreferences),
                q(projectIdeas),
                q(team.final_mentor),
                q(team.final_idea)
            ].join(',') + '\n';
        });

        // Add BOM for Excel compatibility
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `final_team_list_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}








// Update the populateSelects function to also populate leader department
function populateSelects() {
    const departments = Object.keys(appData.students);
    
    // Populate leader department dropdown
    const leaderDeptSelect = document.getElementById('leader-department');
    if (leaderDeptSelect) {
        leaderDeptSelect.innerHTML = '<option value="">Select Department</option>';
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            leaderDeptSelect.appendChild(option);
        });
    }
    
    // Initialize team leader dropdown as empty
    const teamLeaderSelect = document.getElementById('team-leader');
    if (teamLeaderSelect) {
        teamLeaderSelect.innerHTML = '<option value="">Select Student</option>';
    }
    
    // Populate other member department dropdowns
    for (let i = 2; i <= 4; i++) {
        const deptSelect = document.getElementById(`member-${i}-dept`);
        if (deptSelect) {
            deptSelect.innerHTML = '<option value="">Select Department</option>';
            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                deptSelect.appendChild(option);
            });
        }
    }
}




async function saveTeam(team) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/teams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(team)
        });
        
        if (!response.ok) throw new Error('Failed to save team');
        
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Error saving team:', error);
        alert('Error saving team: ' + error.message);
        return false;
    }
}

async function deleteTeam(teamId) {
    if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete team');
            
            await displayTeamsManagement();
            await displayTeams();
            await displayRemainingStudents();
            alert('Team deleted successfully!');
        } catch (error) {
            console.error('Error deleting team:', error);
            alert('Error deleting team: ' + error.message);
        }
    }
}



async function getRegisteredStudents() {
    const teams = await getTeams();
    const registered = new Set();
    teams.forEach(team => {
        registered.add(team.leader);
        if (team.members) {
            team.members.forEach(member => registered.add(member));
        }
    });
    return registered;
}

// ====== UTILITY FUNCTIONS ======
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    // Handle specific page initialization
    if (pageId === 'view-teams') {
        setTimeout(() => {
            displayTeams();
            displayRemainingStudents();
        }, 100);
    } else if (pageId === 'team-management') {
        setTimeout(() => {
            displayTeamsManagement();
        }, 100);
    } else if (pageId === 'mentor-panel') {
        setTimeout(() => {
            initializeMentorPanel();
        }, 100);
    }
}
function initializeMentorPanel() {
    currentLoggedMentor = null;
    const mentorDashboard = document.getElementById('mentor-dashboard');
    const mentorLoginForm = document.querySelector('.mentor-login-form');
    if (mentorDashboard) mentorDashboard.style.display = 'none';
    if (mentorLoginForm) mentorLoginForm.style.display = 'block';
    const usernameField = document.getElementById('mentor-username');
    const passwordField = document.getElementById('mentor-password');
    if (usernameField) usernameField.value = '';
    if (passwordField) passwordField.value = '';
}
async function mentorLogin() {
    const username = document.getElementById('mentor-username').value.trim();
    const password = document.getElementById('mentor-password').value.trim();
    
    hideError('mentor-login-error');
    
    if (!username || !password) {
        showError('mentor-login-error', 'Please enter both username and password.');
        return;
    }
    
    const result = await authenticateMentor(username, password);
    
    if (!result.success) {
        showError('mentor-login-error', 'Invalid mentor credentials.');
        return;
    }
    
    // Set current mentor
    currentLoggedMentor = {
        username: username,
        name: result.name,
        index: parseInt(username.replace('mentor', '')) - 1
    };
    
    // Hide login form and show dashboard
    const loginForm = document.querySelector('#mentor-panel .mentor-login-form');
    if (loginForm) {
        loginForm.style.display = 'none';
    }
    
    const dashboard = document.getElementById('mentor-dashboard');
    if (dashboard) {
        dashboard.style.display = 'block';
    }
    
    const nameElement = document.getElementById('logged-mentor-name');
    if (nameElement) {
        nameElement.textContent = result.name;
    }
    
    // Load mentor's teams
    loadMentorTeams();
}



function mentorLogout() {
    currentLoggedMentor = null;
    
    // Show login form
    const loginForm = document.querySelector('#mentor-panel .mentor-login-form');
    if (loginForm) {
        loginForm.style.display = 'block';
    }
    
    // Hide dashboard
    const dashboard = document.getElementById('mentor-dashboard');
    if (dashboard) {
        dashboard.style.display = 'none';
    }
    
    // Clear form fields
    const usernameField = document.getElementById('mentor-username');
    const passwordField = document.getElementById('mentor-password');
    
    if (usernameField) {
        usernameField.value = '';
    }
    
    if (passwordField) {
        passwordField.value = '';
    }
    
    // Hide any error messages
    hideError('mentor-login-error');
}


async function loadMentorTeams() {
    if (!currentLoggedMentor) return;
    
    const mentorIndex = parseInt(currentLoggedMentor.username.replace('mentor', '')) - 1;
    const teams = await getTeams();
    
    // Filter teams where current mentor is relevant (either accepted by them or pending for them)
    const relevantTeams = teams.filter(team => {
        // Include accepted teams by this mentor
        if (team.mentor_status === 'accepted' && team.final_mentor === currentLoggedMentor.name) {
            return true;
        }
        
        // Include pending teams where this mentor is the current preference
        if (team.mentor_status === 'pending' && team.mentor_preferences) {
            const currentMentorIndex = team.current_mentor_index || 0;
            return team.mentor_preferences[currentMentorIndex] === mentorIndex;
        }
        
        return false;
    });
    
    displayMentorTeams(relevantTeams, mentorIndex);
}
async function handleHODLogin(event) {
    event.preventDefault();
    hideError('hod-login-error');
    
    console.log('HOD Login attempt'); // Debug log
    
    const username = document.getElementById('hod-username').value.trim();
    const password = document.getElementById('hod-password').value.trim();
    
    console.log('Username:', username, 'Password:', password); // Debug log
    
    const isValid = await authenticateHOD(username, password);
    
    if (isValid) {
        isHODLoggedIn = true;
        document.getElementById('hod-login-section').style.display = 'none';
        document.getElementById('edit-teams-dashboard').style.display = 'block';
        await loadEditTeams();
        console.log('HOD login successful'); // Debug log
    } else {
        showError('hod-login-error', 'Invalid HOD credentials. Please try again.');
        console.log('HOD login failed'); // Debug log
    }
}



// HOD Logout
function hodLogout() {
    isHODLoggedIn = false;
    document.getElementById('hod-login-section').style.display = 'block';
    document.getElementById('edit-teams-dashboard').style.display = 'none';
    document.getElementById('hod-username').value = '';
    document.getElementById('hod-password').value = '';
    hideError('hod-login-error');
}

// Load teams for editing
async function loadEditTeams() {
    if (!isHODLoggedIn) return;
    
    const teams = await getTeams();
    const container = document.getElementById('edit-teams-list');
    
    if (teams.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No teams registered yet.</p></div>';
        return;
    }
    
    container.innerHTML = teams.map(team => {
        const leader = getStudentById(team.leader);
        const leaderName = leader ? leader.name : 'Unknown';
        const memberCount = team.members ? team.members.length : 0;
        
        return `
            <div class="edit-team-card" onclick="openEditModal('${team.team_id}')">
                <h4>${team.name}</h4>
                <p><strong>Leader:</strong> ${leaderName}</p>
                <p><strong>Members:</strong> ${memberCount}</p>
                <p><strong>Registered:</strong> ${new Date(team.registration_date).toLocaleDateString()}</p>
            </div>
        `;
    }).join('');
}

// Open edit modal
async function openEditModal(teamId) {
    const teams = await getTeams();
    currentEditTeam = teams.find(team => team.team_id === teamId);
    
    if (!currentEditTeam) return;
    
    // Populate form with current data
    document.getElementById('edit-team-id').value = currentEditTeam.team_id;
    document.getElementById('edit-team-name').textContent = currentEditTeam.name;
    document.getElementById('edit-team-name-input').value = currentEditTeam.name;
    
    // Load current leader
    const leader = getStudentById(currentEditTeam.leader);
    document.getElementById('current-leader-name').textContent = leader ? leader.name : 'Unknown';
    
    // Load current members
    loadCurrentMembers();
    
    // Load mentor preferences
    loadMentorPreferences();
    
    // Load project ideas from array
    const projectIdeas = currentEditTeam.project_ideas || ['', '', ''];
    document.getElementById('edit-idea-1').value = projectIdeas[0] || '';
    document.getElementById('edit-idea-2').value = projectIdeas[1] || '';
    document.getElementById('edit-idea-3').value = projectIdeas[2] || '';
    
    // Populate dropdowns (this function will handle the event listener setup)
    populateEditDropdowns();
    
    // Show modal
    document.getElementById('team-edit-modal').style.display = 'flex';
}



// Close edit modal
function closeEditModal() {
    document.getElementById('team-edit-modal').style.display = 'none';
    currentEditTeam = null;
    hideError('edit-error');
    
    // Reset form
    document.getElementById('team-edit-form').reset();
    document.getElementById('leader-change-section').style.display = 'none';
    document.getElementById('add-member-section').style.display = 'none';
}

// Load current members
function loadCurrentMembers() {
    const container = document.getElementById('current-members-list');
    const leaderSelect = document.getElementById('new-leader-select');
    const addMemberBtn = document.querySelector('button[onclick="addNewMember()"]');
    
    leaderSelect.innerHTML = '<option value="">Choose new leader</option>';
    
    // Hide/show Add Member button based on member count
    if (currentEditTeam.members.length >= 4) {
        addMemberBtn.style.display = 'none';
    } else {
        addMemberBtn.style.display = 'inline-block';
    }
    
    container.innerHTML = currentEditTeam.members.map(memberId => {
        const member = getStudentById(memberId);
        const memberName = member ? member.name : 'Unknown';
        const memberDept = member ? member.department : 'Unknown';
        const isLeader = memberId === currentEditTeam.leader;
        const isOnlyMember = currentEditTeam.members.length === 1;
        
        // Add to leader selection
        if (member) {
            leaderSelect.innerHTML += `<option value="${memberId}">${memberName} (${memberDept})</option>`;
        }
        
        return `
            <div class="current-member">
                <div class="member-info">
                    <strong>${memberName}</strong> (${memberDept})
                    ${isLeader ? '<span class="badge">Leader</span>' : ''}
                </div>
                <div class="member-actions">
                    ${!isOnlyMember ? 
                        `<button type="button" class="btn btn--danger btn--sm" onclick="removeMember('${memberId}')">Remove</button>` : 
                        '<span class="text-muted">Cannot remove only member</span>'}
                </div>
            </div>
        `;
    }).join('');
}


// Load mentor preferences
function loadMentorPreferences() {
    const preferences = currentEditTeam.mentor_preferences || [];
    
    for (let i = 1; i <= 4; i++) {
        const select = document.getElementById(`edit-mentor-${i}`);
        select.innerHTML = '<option value="">Select Choice</option>';
        
        appData.mentors.forEach((mentor, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = mentor;
            if (preferences[i-1] === index) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }
}

// Populate edit dropdowns
// Update the populateEditDropdowns function
// Update the populateEditDropdowns function
function populateEditDropdowns() {
    const departments = Object.keys(appData.students);
    const deptSelect = document.getElementById('new-member-dept');
    const studentSelect = document.getElementById('new-member-student');
    
    // Clear existing options
    deptSelect.innerHTML = '<option value="">Select Department</option>';
    studentSelect.innerHTML = '<option value="">Select Student</option>';
    studentSelect.disabled = true;
    
    // Populate departments
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        deptSelect.appendChild(option);
    });
    
    // Remove all existing event listeners by cloning
    const newDeptSelect = deptSelect.cloneNode(true);
    deptSelect.parentNode.replaceChild(newDeptSelect, deptSelect);
    
    // Add single clean event listener
    const finalDeptSelect = document.getElementById('new-member-dept');
    finalDeptSelect.addEventListener('change', async function() {
        const department = this.value;
        const finalStudentSelect = document.getElementById('new-member-student');
        
        finalStudentSelect.innerHTML = '<option value="">Select Student</option>';
        finalStudentSelect.disabled = !department;
        
        if (department) {
            try {
                console.log('Loading available students for department:', department);
                console.log('Current team being edited:', currentEditTeam?.team_id);
                
                // Get available students for this department
                const availableStudents = await getAvailableStudentsForDepartment(
                    department, 
                    currentEditTeam?.team_id
                );
                
                console.log('Available students found:', availableStudents);
                
                if (availableStudents.length > 0) {
                    availableStudents.forEach((student, arrayIndex) => {
                        // Find the correct index in the original department array
                        const originalIndex = appData.students[department].indexOf(student);
                        const studentId = `${department}_${originalIndex}`;
                        
                        const option = document.createElement('option');
                        option.value = studentId;
                        option.textContent = student;
                        finalStudentSelect.appendChild(option);
                    });
                    finalStudentSelect.disabled = false;
                } else {
                    const option = document.createElement('option');
                    option.value = '';
                    option.textContent = 'No available students in this department';
                    finalStudentSelect.appendChild(option);
                    finalStudentSelect.disabled = true;
                }
            } catch (error) {
                console.error('Error loading available students:', error);
                showError('edit-error', 'Error loading available students');
            }
        }
    });
}




// Change leader
function changeLeader() {
    const section = document.getElementById('leader-change-section');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// Add new member
function addNewMember() {
    // Check if team already has 4 members
    if (currentEditTeam.members.length >= 4) {
        showError('edit-error', 'Maximum 4 members allowed per team. Remove a member first to add a new one.');
        return;
    }
    
    document.getElementById('add-member-section').style.display = 'block';
    populateEditDropdowns();
}


// Cancel add member
function cancelAddMember() {
    document.getElementById('add-member-section').style.display = 'none';
    document.getElementById('new-member-dept').value = '';
    document.getElementById('new-member-student').value = '';
}

// Confirm add member
async function confirmAddMember() {
    const studentId = document.getElementById('new-member-student').value;
    
    if (!studentId) {
        showError('edit-error', 'Please select a student to add.');
        return;
    }
    
    if (currentEditTeam.members.length >= 4) {
        showError('edit-error', 'Team cannot have more than 4 members.');
        return;
    }
    
    // Check if student is already in the team
    if (currentEditTeam.members.includes(studentId)) {
        showError('edit-error', 'This student is already in the team.');
        return;
    }
    
    // Add member to current team data
    currentEditTeam.members.push(studentId);
    
    // Refresh display
    loadCurrentMembers();
    cancelAddMember();
    
    showSuccess('Member added successfully!');
}


// Remove member
async function removeMember(memberId) {
    // Check if this is the only member left
    if (currentEditTeam.members.length <= 1) {
        showError('edit-error', 'Team must have at least 1 member. Delete the entire team instead.');
        return;
    }
    
    // Check if trying to remove the leader when they're the only member
    if (memberId === currentEditTeam.leader && currentEditTeam.members.length === 1) {
        showError('edit-error', 'Cannot remove the team leader when they are the only member. Delete the entire team instead.');
        return;
    }
    
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    // If removing the leader, automatically assign leadership to first remaining member
    if (memberId === currentEditTeam.leader) {
        const remainingMembers = currentEditTeam.members.filter(id => id !== memberId);
        currentEditTeam.leader = remainingMembers[0];
        
        if (!confirm(`This member is the team leader. Leadership will be transferred to ${getStudentById(remainingMembers[0])?.name || 'Unknown'}. Continue?`)) {
            return;
        }
    }
    
    // Remove member from current team data
    currentEditTeam.members = currentEditTeam.members.filter(id => id !== memberId);
    
    // Refresh display
    loadCurrentMembers();
    
    showSuccess('Member removed successfully!');
}




// Helper function to show success message
function showSuccess(message) {
    // You can implement a success toast notification here
    console.log('Success:', message);
}


function displayMentorTeams(mentorTeams, mentorIndex) {
    const container = document.getElementById('mentor-teams-display');
    if (!container) return;

    let html = '';
    
    // Get accepted teams for this mentor
    const acceptedTeams = mentorTeams.filter(team => 
        team.mentor_status === 'accepted' && team.final_mentor === currentLoggedMentor.name
    );
    
    // Get pending teams for this mentor
    const pendingTeams = mentorTeams.filter(team => 
        team.mentor_status === 'pending' && 
        team.mentor_preferences && 
        team.mentor_preferences[team.current_mentor_index || 0] === mentorIndex
    );
    
    // Display accepted teams section
    if (acceptedTeams.length > 0) {
        html += `
            <div class="mentor-section">
                <h4 class="mentor-section-title">Your Teams</h4>
                <div class="accepted-teams-container">
        `;
        
        acceptedTeams.forEach(team => {
            const statusText = team.final_idea ? 'Idea Finalized' : 'Click to Finalize Idea';
            html += `
                <div class="accepted-team-card" onclick="openFinalizeIdeaModal('${team.team_id}')" style="cursor: pointer;">
                    <div class="accepted-team-info">
                        <h5 class="accepted-team-name">${team.name}</h5>
                        <p class="accepted-team-leader">Leader: ${getStudentById(team.leader)?.name || team.leader}</p>
                    </div>
                    <div class="accepted-team-badge">
                        <span class="status-badge ${team.final_idea ? 'status-finalized' : 'status-accepted'}">${statusText}</span>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Display pending teams section
    html += `
        <div class="mentor-section">
            <h4 class="mentor-section-title">Pending Teams</h4>
    `;
    
    if (pendingTeams.length === 0) {
        html += '<div class="empty-state"><p>No teams are currently waiting for your response.</p></div>';
    } else {
        html += '<div class="mentor-teams-container">';
        
        pendingTeams.forEach(team => {
            const currentPreferenceIndex = team.current_mentor_index || 0;
            const preferenceOrder = ['1st', '2nd', '3rd', '4th'];
            const preferenceText = preferenceOrder[currentPreferenceIndex];
            
            const projectIdeas = team.project_ideas || ['', '', ''];
            
            html += `
                <div class="team-card mentor-team-card">
                    <div class="team-card-header">
                        <h5>${team.name}</h5>
                        <div class="preference-badge preference-${currentPreferenceIndex + 1}">
                            ${preferenceText} Choice
                        </div>
                    </div>
                    
                    <div class="team-details">
                        <p><strong>Leader:</strong> ${getStudentById(team.leader)?.name || team.leader}</p>
                        <p><strong>Members:</strong> ${team.members.map(member => getStudentById(member)?.name || member).join(', ')}</p>
                        <p><strong>Registered:</strong> ${new Date(team.registration_date).toLocaleDateString()}</p>
                    </div>
                    
                    <div class="project-ideas">
                        <strong>Project Ideas:</strong>
                        <ol>
                            <li>${projectIdeas[0] || 'Not provided'}</li>
                            <li>${projectIdeas[1] || 'Not provided'}</li>
                            <li>${projectIdeas[2] || 'Not provided'}</li>
                        </ol>
                    </div>
                    
                    <div class="mentor-actions">
                        <button class="btn btn--success" onclick="acceptTeam('${team.team_id}')">
                            Accept Team
                        </button>
                        <button class="btn btn--danger" onclick="rejectTeam('${team.team_id}')">
                            Reject Team
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    html += '</div>';
    
    container.innerHTML = html;
}

// Finalize Idea Modal Functions
async function openFinalizeIdeaModal(teamId) {
    const teams = await getTeams();
    currentFinalizeTeam = teams.find(team => team.team_id === teamId);
    
    if (!currentFinalizeTeam) return;
    
    newIdeaBuffer = [];
    
    // Set team name
    document.getElementById('finalize-team-name').textContent = currentFinalizeTeam.name;
    document.getElementById('finalize-team-id').value = teamId;
    
    // Render idea options
    renderIdeaOptions();
    
    // Show modal
    document.getElementById('finalize-idea-modal').style.display = 'flex';
}

function closeFinalizeIdeaModal() {
    currentFinalizeTeam = null;
    newIdeaBuffer = [];
    document.getElementById('finalize-idea-modal').style.display = 'none';
    document.getElementById('new-idea-input').value = '';
    hideError('finalize-error');
}

function renderIdeaOptions() {
    const container = document.getElementById('idea-options');
    const allIdeas = [...(currentFinalizeTeam.project_ideas || []), ...newIdeaBuffer];
    
    container.innerHTML = allIdeas.map((idea, index) => `
        <label class="idea-option">
            <input type="radio" name="selectedIdea" value="${index}">
            <span>${idea}</span>
        </label>
    `).join('');
}

function addIdeaOption() {
    const newIdea = document.getElementById('new-idea-input').value.trim();
    
    if (!newIdea) {
        showError('finalize-error', 'Please enter an idea before adding.');
        return;
    }
    
    newIdeaBuffer.push(newIdea);
    document.getElementById('new-idea-input').value = '';
    renderIdeaOptions();
}

async function confirmFinalizeIdea() {
    const selectedRadio = document.querySelector('input[name="selectedIdea"]:checked');
    
    if (!selectedRadio) {
        showError('finalize-error', 'Please select an idea to finalize.');
        return;
    }
    
    const allIdeas = [...(currentFinalizeTeam.project_ideas || []), ...newIdeaBuffer];
    const selectedIdea = allIdeas[parseInt(selectedRadio.value)];
    
    try {
        // Update project_ideas array with any new ideas and set final_idea
        const updatedIdeas = [...(currentFinalizeTeam.project_ideas || []), ...newIdeaBuffer];
        
        const response = await fetch(`${API_BASE_URL}/api/teams/${currentFinalizeTeam.team_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                project_ideas: updatedIdeas,
                final_idea: selectedIdea
            })
        });
        
        if (!response.ok) throw new Error('Failed to update team');
        
        alert('Final idea saved successfully!');
        closeFinalizeIdeaModal();
        await loadMentorTeams();
        
    } catch (error) {
        console.error('Error saving final idea:', error);
        showError('finalize-error', 'Error saving final idea. Please try again.');
    }
}



async function acceptTeam(teamId) {
    if (!currentLoggedMentor) return;
    
    if (!confirm('Are you sure you want to accept this team? This action cannot be undone.')) {
        return;
    }
    
    try {
        const mentorName = currentLoggedMentor.name;
        
        const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                final_mentor: mentorName,
                mentor_status: 'accepted'
            })
        });
        
        if (!response.ok) throw new Error('Failed to accept team');
        
        alert('Team accepted successfully!');
        await loadMentorTeams();
        
    } catch (error) {
        console.error('Error accepting team:', error);
        alert('Error accepting team: ' + error.message);
    }
}


async function rejectTeam(teamId) {
    if (!currentLoggedMentor) return;
    
    if (!confirm('Are you sure you want to reject this team? It will be forwarded to the next mentor preference.')) {
        return;
    }
    
    try {
        // Get the current team data
        const teams = await getTeams();
        const teamData = teams.find(team => team.team_id === teamId);
        
        if (!teamData) throw new Error('Team not found');
        
        const currentMentorIndex = teamData.current_mentor_index || 0;
        const mentorPreferences = teamData.mentor_preferences;
        
        // Check if there's a next mentor preference
        if (currentMentorIndex + 1 < mentorPreferences.length) {
            // Move to next mentor preference
            const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    current_mentor_index: currentMentorIndex + 1
                })
            });
            
            if (!response.ok) throw new Error('Failed to update team');
            
            alert('Team rejected and forwarded to next mentor preference.');
        } else {
            // No more mentor preferences, mark as rejected
            const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mentor_status: 'rejected'
                })
            });
            
            if (!response.ok) throw new Error('Failed to update team');
            
            alert('Team rejected. No more mentor preferences available.');
        }
        
        await loadMentorTeams();
        
    } catch (error) {
        console.error('Error rejecting team:', error);
        alert('Error rejecting team: ' + error.message);
    }
}


function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

function getStudentById(id) {
    if (!id) return null;
    const [dept, index] = id.split('_');
    if (appData.students[dept] && appData.students[dept][index]) {
        return {
            id: id,
            name: appData.students[dept][index],
            department: dept
        };
    }
    return null;
}

// ====== POPULATE DROPDOWN FUNCTIONS ======
async function populateTeamLeaderDropdown() {
    const registered = await getRegisteredStudents();
    const dropdown = document.getElementById('team-leader');
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">Select Team Leader</option>';
    
    Object.entries(appData.students).forEach(([dept, students]) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = dept;
        students.forEach((name, index) => {
            const studentId = `${dept}_${index}`;
            if (!registered.has(studentId)) {
                const option = document.createElement('option');
                option.value = studentId;
                option.textContent = name;
                optgroup.appendChild(option);
            }
        });
        if (optgroup.children.length > 0) {
            dropdown.appendChild(optgroup);
        }
    });
}

function populateDepartmentDropdowns() {
    const departmentDropdowns = ['member-2-dept', 'member-3-dept', 'member-4-dept'];
    const departments = Object.keys(appData.students);
    
    departmentDropdowns.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;
        
        dropdown.innerHTML = '<option value="">Select Department</option>';
        
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            dropdown.appendChild(option);
        });
    });
}

async function populateStudentByDepartment(department, targetDropdownId) {
    const registered = await getRegisteredStudents();
    const dropdown = document.getElementById(targetDropdownId);
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">Select Student</option>';
    
    if (department && appData.students[department]) {
        appData.students[department].forEach((name, index) => {
            const studentId = `${department}_${index}`;
            if (!registered.has(studentId)) {
                const option = document.createElement('option');
                option.value = studentId;
                option.textContent = name;
                dropdown.appendChild(option);
            }
        });
    }
    
    dropdown.disabled = !department;
}

function populateAdminMentorDropdown() {
    const dropdown = document.getElementById('mentor-selector');
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">Choose your mentor profile</option>';
    
    appData.mentors.forEach((mentor, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = mentor;
        dropdown.appendChild(option);
    });
}

// ====== VALIDATION FUNCTIONS ======
async function validateStudentSelections() {
    const selectedStudents = [];
    const dropdowns = ['team-leader', 'member-2', 'member-3', 'member-4'];
    
    dropdowns.forEach(dropdownId => {
        const element = document.getElementById(dropdownId);
        if (element && element.value) {
            selectedStudents.push(element.value);
        }
    });
    
    // Check for duplicates only if there are multiple selections
    if (selectedStudents.length > 1) {
        const hasDuplicates = selectedStudents.length !== new Set(selectedStudents).size;
        
        if (hasDuplicates) {
            showError('team-error', 'Each student can only be selected once. Please choose different students.');
            return false;
        }
    }
    
    // Check if team leader is selected (minimum requirement)
    if (selectedStudents.length === 0) {
        showError('team-error', 'Please select at least a team leader.');
        return false;
    }
    
    // Check if any selected students are already registered
    const registeredStudents = await getRegisteredStudents();
    const alreadyRegistered = selectedStudents.filter(studentId => registeredStudents.has(studentId));
    
    if (alreadyRegistered.length > 0) {
        const studentNames = alreadyRegistered.map(id => getStudentById(id)?.name).join(', ');
        showError('team-error', `The following students are already registered in other teams: ${studentNames}`);
        return false;
    }
    
    return true;
}


function validateMentorSelections() {
    const selectedMentors = [];
    const dropdowns = ['mentor-1', 'mentor-2', 'mentor-3', 'mentor-4'];
    
    dropdowns.forEach(dropdownId => {
        const element = document.getElementById(dropdownId);
        if (element && element.value) {
            selectedMentors.push(element.value);
        }
    });
    
    const hasDuplicates = selectedMentors.length !== new Set(selectedMentors).size;
    
    if (hasDuplicates) {
        showError('mentor-error', 'Each mentor can only be selected once. Please choose different mentors.');
        return false;
    }
    
    return true;
}

// ====== FORM HANDLERS ======



async function handleMentorSelectionForm(event) {
    event.preventDefault();
    hideError('mentor-error');
    
    if (!validateMentorSelections()) return false;
    
    const mentor1 = document.getElementById('mentor-1').value;
    const mentor2 = document.getElementById('mentor-2').value;
    const mentor3 = document.getElementById('mentor-3').value;
    const mentor4 = document.getElementById('mentor-4').value;
    
    if (!mentor1 || !mentor2 || !mentor3 || !mentor4) {
        showError('mentor-error', 'Please select all mentor preferences.');
        return false;
    }
    
    currentTeam.mentor_preferences = [
        parseInt(mentor1), parseInt(mentor2), 
        parseInt(mentor3), parseInt(mentor4)
    ];
    
    showPage('project-ideas');
    return false;
}

async function handleProjectIdeasForm(event) {
    event.preventDefault();
    hideError('ideas-error');
    
    const idea1 = document.getElementById('idea-1').value.trim();
    const idea2 = document.getElementById('idea-2').value.trim();
    const idea3 = document.getElementById('idea-3').value.trim();
    
    if (!idea1 || !idea2 || !idea3) {
        showError('ideas-error', 'Please fill in all project ideas.');
        return false;
    }
    
    if (idea1.length < 10 || idea2.length < 10 || idea3.length < 10) {
        showError('ideas-error', 'Each project idea must be at least 10 characters long.');
        return false;
    }
    
    currentTeam.project_ideas = [idea1, idea2, idea3];
    currentTeam.registration_date = new Date().toISOString();
    
    const success = await saveTeam(currentTeam);
    
    if (success) {
        // Reset forms
        document.getElementById('team-details-form').reset();
        document.getElementById('mentor-selection-form').reset();
        document.getElementById('project-ideas-form').reset();
        
        // Reset member dropdowns
        ['member-2', 'member-3', 'member-4'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.disabled = true;
                element.innerHTML = '<option value="">Select Student</option>';
            }
        });
        
        currentTeam = {};
        showPage('success-page');
    } else {
        showError('ideas-error', 'Failed to save team. Please try again.');
    }
    
    return false;
}

async function handleAdminLogin(event) {
    event.preventDefault();
    hideError('login-error');
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    const isValid = await authenticateAdmin(username, password);
    
    if (isValid) {
        isLoggedIn = true;
        document.getElementById('admin-login-form').reset();
        showPage('admin-dashboard');
    } else {
        showError('login-error', 'Invalid username or password');
    }
    
    return false;
}

function logout() {
    isLoggedIn = false;
    showPage('welcome-page');
}

// ====== DISPLAY FUNCTIONS ======
async function displayTeams() {
    const teams = await getTeams();
    const teamsContainer = document.getElementById('teams-list');
    if (!teamsContainer) return;
    
    if (teams.length === 0) {
        teamsContainer.innerHTML = '<div class="empty-state"><p>No teams registered yet.</p></div>';
        return;
    }
    
    teamsContainer.innerHTML = teams.map(team => `
        <div class="team-card">
            <h4>${team.name}</h4>
            <div class="team-info">
                <div class="team-detail">
                    <h5>Team Leader</h5>
                    <p>${getStudentById(team.leader)?.name} (${getStudentById(team.leader)?.department})</p>
                </div>
                <div class="team-detail">
                    <h5>All Members</h5>
                    <ul>
                        ${team.members.map(memberId => {
                            const student = getStudentById(memberId);
                            return `<li>${student?.name} (${student?.department})</li>`;
                        }).join('')}
                    </ul>
                </div>
                <div class="team-detail">
                    <h5>Department Distribution</h5>
                    <p>${getDepartmentDistribution(team.members)}</p>
                </div>
                <div class="team-detail">
                    <h5>Mentor Preferences</h5>
                    <ul>
                        ${team.mentor_preferences.map((mentorIndex, index) => 
                            `<li>${index + 1}. ${appData.mentors[mentorIndex]}</li>`
                        ).join('')}
                    </ul>
                </div>
                <div class="team-detail">
                    <h5>Project Ideas</h5>
                    <ul>
                        ${team.project_ideas.map((idea, index) => 
                            `<li><strong>Idea ${index + 1}:</strong> ${idea}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
            <p class="registration-date"><small>Registered on: ${new Date(team.registration_date).toLocaleDateString()}</small></p>
        </div>
    `).join('');
}

async function displayTeamsManagement() {
    const teams = await getTeams();
    const container = document.getElementById('teams-management-list');
    if (!container) return;
    
    // Filter out accepted teams from Team Management section
    const manageableTeams = teams.filter(team => 
        team.mentor_status !== 'accepted' || !team.final_mentor
    );
    
    if (manageableTeams.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No teams available for management. All teams have been assigned to mentors.</p></div>';
        return;
    }
    
    container.innerHTML = manageableTeams.map(team => `
        <div class="team-management-card">
            <div class="team-header">
                <h4>${team.name}</h4>
                <button onclick="deleteTeam('${team.team_id}')" class="btn btn--danger btn--sm">
                    Delete Team
                </button>
            </div>
            <div class="team-summary">
                <p><strong>Leader:</strong> ${getStudentById(team.leader)?.name}</p>
                <p><strong>Members:</strong> ${team.members.length}</p>
                <p><strong>Registered:</strong> ${new Date(team.registration_date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${getTeamStatusText(team)}</p>
            </div>
        </div>
    `).join('');
}
function getTeamStatusText(team) {
    if (team.mentor_status === 'pending') {
        const currentMentorIndex = team.current_mentor_index || 0;
        const currentMentor = appData.mentors[team.mentor_preferences[currentMentorIndex]] || 'Unknown';
        return `Pending with ${currentMentor}`;
    } else if (team.mentor_status === 'rejected') {
        return 'Rejected by all mentors';
    } else {
        return 'Waiting for mentor response';
    }
}


function getDepartmentDistribution(memberIds) {
    const deptCounts = {};
    memberIds.forEach(id => {
        const student = getStudentById(id);
        if (student) {
            deptCounts[student.department] = (deptCounts[student.department] || 0) + 1;
        }
    });
    
    return Object.entries(deptCounts)
        .map(([dept, count]) => `${dept}: ${count}`)
        .join(', ');
}

async function displayRemainingStudents() {
    const teams = await getTeams();
    const registeredStudentIds = new Set();
    
    teams.forEach(team => {
        team.members.forEach(memberId => registeredStudentIds.add(memberId));
    });
    
    const container = document.getElementById('remaining-students-display');
    if (!container) return;
    
    let html = '<h3>Students Not Yet in Teams</h3>';
    
    Object.keys(appData.students).forEach(department => {
        const remainingStudents = appData.students[department]
            .map((name, index) => ({ id: `${department}_${index}`, name }))
            .filter(student => !registeredStudentIds.has(student.id));
        
        html += `
            <div class="department-section">
                <h4>${department} (${remainingStudents.length} remaining out of ${appData.students[department].length})</h4>
                <div class="students-grid">
                    ${remainingStudents.length === 0 ? 
                        '<div class="no-students">All students assigned to teams</div>' :
                        remainingStudents.map(student => `<div class="student-card">${student.name}</div>`).join('')
                    }
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ====== MENTOR PANEL FUNCTIONS ======
async function handleMentorSelection() {
    const mentorIndex = document.getElementById('mentor-selector').value;
    const mentorDisplay = document.getElementById('mentor-teams-display');
    
    if (!mentorIndex) {
        mentorDisplay.classList.add('hidden');
        return;
    }
    
    const mentorName = appData.mentors[mentorIndex];
    document.getElementById('mentor-name-display').textContent = mentorName;
    
    await displayMentorPreferences(parseInt(mentorIndex));
    mentorDisplay.classList.remove('hidden');
}

async function displayMentorPreferences(mentorIndex) {
    const teams = await getTeams();
    const preferencesContainer = document.getElementById('preference-stats');
    const selectionContainer = document.getElementById('team-selection');
    
    // Group teams by preference level for this mentor
    const preferences = {
        first: [],
        second: [],
        third: [],
        fourth: []
    };
    
    teams.forEach(team => {
        if (team.mentor_preferences) {
            const mentorPos = team.mentor_preferences.indexOf(mentorIndex);
            if (mentorPos === 0) preferences.first.push(team);
            else if (mentorPos === 1) preferences.second.push(team);
            else if (mentorPos === 2) preferences.third.push(team);
            else if (mentorPos === 3) preferences.fourth.push(team);
        }
    });
    
    // Display preference statistics
    preferencesContainer.innerHTML = `
        <div class="preference-grid">
            <div class="preference-card first-choice">
                <h4>1st Choice (${preferences.first.length} teams)</h4>
                ${preferences.first.map(team => `
                    <div class="team-preference-item">
                        <strong>${team.name}</strong>
                        <p>Leader: ${getStudentById(team.leader)?.name}</p>
                        <p>Members: ${team.members.length}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="preference-card second-choice">
                <h4>2nd Choice (${preferences.second.length} teams)</h4>
                ${preferences.second.map(team => `
                    <div class="team-preference-item">
                        <strong>${team.name}</strong>
                        <p>Leader: ${getStudentById(team.leader)?.name}</p>
                        <p>Members: ${team.members.length}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="preference-card third-choice">
                <h4>3rd Choice (${preferences.third.length} teams)</h4>
                ${preferences.third.map(team => `
                    <div class="team-preference-item">
                        <strong>${team.name}</strong>
                        <p>Leader: ${getStudentById(team.leader)?.name}</p>
                        <p>Members: ${team.members.length}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="preference-card fourth-choice">
                <h4>4th Choice (${preferences.fourth.length} teams)</h4>
                ${preferences.fourth.map(team => `
                    <div class="team-preference-item">
                        <strong>${team.name}</strong>
                        <p>Leader: ${getStudentById(team.leader)?.name}</p>
                        <p>Members: ${team.members.length}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Display team selection interface
    const allTeamsForMentor = [...preferences.first, ...preferences.second, ...preferences.third, ...preferences.fourth];
    const selectedTeams = selectedMentorTeams[mentorIndex] || [];
    
    selectionContainer.innerHTML = `
        <div class="team-selection-section">
            <h4>Select Your Teams (Maximum 4)</h4>
            <p class="selection-info">Selected: ${selectedTeams.length}/4 teams</p>
            
            <div class="teams-selection-grid">
                ${allTeamsForMentor.map(team => {
                    const isSelected = selectedTeams.includes(team.team_id);
                    const preferenceLevel = team.mentor_preferences.indexOf(mentorIndex) + 1;
                    
                    return `
                        <div class="team-selection-card ${isSelected ? 'selected' : ''}">
                            <div class="team-selection-header">
                                <h5>${team.name}</h5>
                                <span class="preference-badge preference-${preferenceLevel}">
                                    ${preferenceLevel}${getOrdinalSuffix(preferenceLevel)} Choice
                                </span>
                            </div>
                            <div class="team-selection-details">
                                <p><strong>Leader:</strong> ${getStudentById(team.leader)?.name}</p>
                                <p><strong>Members:</strong> ${team.members.length}</p>
                                <p><strong>Departments:</strong> ${getDepartmentDistribution(team.members)}</p>
                            </div>
                            <div class="team-selection-actions">
                                ${isSelected ? 
                                    `<button class="btn btn--danger btn--sm" onclick="deselectTeam(${mentorIndex}, '${team.team_id}')">
                                        Remove Team
                                    </button>` :
                                    `<button class="btn btn--primary btn--sm" onclick="selectTeam(${mentorIndex}, '${team.team_id}')" 
                                        ${selectedTeams.length >= 4 ? 'disabled' : ''}>
                                        Select Team
                                    </button>`
                                }
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function selectTeam(mentorIndex, teamId) {
    if (!selectedMentorTeams[mentorIndex]) {
        selectedMentorTeams[mentorIndex] = [];
    }
    
    if (selectedMentorTeams[mentorIndex].length >= 4) {
        alert('You can only select maximum 4 teams.');
        return;
    }
    
    if (!selectedMentorTeams[mentorIndex].includes(teamId)) {
        selectedMentorTeams[mentorIndex].push(teamId);
        displayMentorPreferences(mentorIndex);
        
        // Save to localStorage for persistence
        localStorage.setItem('mentorSelections', JSON.stringify(selectedMentorTeams));
        
        alert('Team selected successfully!');
    }
}

function getOrdinalSuffix(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
}

async function exportMentorSelectionsToCSV() {
    const teams = await getTeams();
    
    if (Object.keys(selectedMentorTeams).length === 0) {
        alert('No mentor selections to export.');
        return;
    }
    
    const headers = ['Mentor Name', 'Team Name', 'Team Leader', 'Team Members', 'Selection Status'];
    
    const csvContent = [
        headers.join(','),
        ...Object.entries(selectedMentorTeams).flatMap(([mentorIndex, teamIds]) => {
            const mentorName = appData.mentors[mentorIndex];
            return teamIds.map(teamId => {
                const team = teams.find(t => t.team_id === teamId);
                if (!team) return '';
                
                const leader = getStudentById(team.leader);
                const members = team.members.map(id => getStudentById(id)?.name).join('; ');
                
                return [
                    `"${mentorName}"`,
                    `"${team.name}"`,
                    `"${leader?.name}"`,
                    `"${members}"`,
                    `"Selected"`
                ].join(',');
            });
        }).filter(row => row)
    ].join('\n');
    
    downloadCSV(csvContent, 'mentor_selections.csv');
}

// ====== EXPORT FUNCTIONS ======
async function exportTeamsToCSV() {
    const teams = await getTeams();
    
    if (teams.length === 0) {
        alert('No teams to export.');
        return;
    }
    
    const headers = ['Team Name', 'Leader', 'Leader Department', 'All Members', 'Department Distribution', 
                    'Mentor 1st Choice', 'Mentor 2nd Choice', 'Mentor 3rd Choice', 'Mentor 4th Choice',
                    'Project Idea 1', 'Project Idea 2', 'Project Idea 3', 'Registration Date'];
    
    const csvContent = [
        headers.join(','),
        ...teams.map(team => {
            const leader = getStudentById(team.leader);
            const allMembers = team.members.map(id => getStudentById(id)?.name).join('; ');
            const deptDist = getDepartmentDistribution(team.members);
            const mentors = team.mentor_preferences.map(index => appData.mentors[index]);
            
            return [
                `"${team.name}"`,
                `"${leader?.name}"`,
                `"${leader?.department}"`,
                `"${allMembers}"`,
                `"${deptDist}"`,
                ...mentors.map(m => `"${m}"`),
                ...team.project_ideas.map(idea => `"${idea}"`),
                `"${new Date(team.registration_date).toLocaleDateString()}"`
            ].join(',');
        })
    ].join('\n');
    
    downloadCSV(csvContent, 'capstone_teams.csv');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ====== CHARACTER COUNTER SETUP ======
function setupCharacterCounters() {
    const textareas = ['idea-1', 'idea-2', 'idea-3'];
    textareas.forEach(id => {
        const textarea = document.getElementById(id);
        const counter = document.getElementById(`${id}-counter`);
        
        if (textarea && counter) {
            textarea.addEventListener('input', function() {
                const length = this.value.length;
                const maxLength = 500;
                counter.textContent = `${length}/${maxLength} characters`;
                
                if (length > maxLength * 0.9) {
                    counter.classList.add('warning');
                } else {
                    counter.classList.remove('warning');
                }
                
                if (length > maxLength) {
                    counter.classList.add('error');
                } else {
                    counter.classList.remove('error');
                }
            });
        }
    });
}

// ====== INITIALIZATION ======
function initializeApp() {
    // Populate all dropdowns
    populateSelects();
    populateDepartmentDropdowns();
    populateMentorDropdowns();
    setupCharacterCounters();
    
    // Team Leader Department Event Listener - FIXED
    const leaderDeptDropdown = document.getElementById('leader-department');
    if (leaderDeptDropdown) {
        leaderDeptDropdown.addEventListener('change', async function() {
            const department = this.value;
            const studentSelect = document.getElementById('team-leader');
            
            studentSelect.innerHTML = '<option value="">Select Student</option>';
            
            if (department && appData.students[department]) {
                // Get already registered students to exclude them
                const registeredStudents = await getRegisteredStudents();
                
                appData.students[department].forEach((student, index) => {
                    const studentId = `${department}_${index}`;
                    
                    // Only add if student is not already registered
                    if (!registeredStudents.has(studentId)) {
                        const option = document.createElement('option');
                        option.value = studentId; // Use proper ID format
                        option.textContent = student;
                        studentSelect.appendChild(option);
                    }
                });
            }
        });
    }
    const mentorEditLoginBtn = document.getElementById('mentor-edit-login-btn');
    const mentorEditLogoutBtn = document.getElementById('mentor-edit-logout-btn');
    const mentorEditPasswordField = document.getElementById('mentor-edit-password');

    if (mentorEditLoginBtn) {
        mentorEditLoginBtn.addEventListener('click', handleMentorEditLogin);
    }

    if (mentorEditLogoutBtn) {
        mentorEditLogoutBtn.addEventListener('click', mentorEditLogout);
    }

    if (mentorEditPasswordField) {
        mentorEditPasswordField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleMentorEditLogin();
        });
    }
    const finalListHodLoginForm = document.getElementById('final-list-hod-login-form');
    if (finalListHodLoginForm) {
        finalListHodLoginForm.addEventListener('submit', handleFinalListHODLogin);
    }
    const hodLoginForm = document.getElementById('hod-login-form');
    if (hodLoginForm) {
        hodLoginForm.addEventListener('submit', handleHODLogin);
    }
    
    // Team Edit Form
    const teamEditForm = document.getElementById('team-edit-form');
    if (teamEditForm) {
        teamEditForm.addEventListener('submit', handleTeamEditForm);
    }
    // Form event listeners
    const teamForm = document.getElementById('team-details-form');
    if (teamForm) {
        teamForm.addEventListener('submit', handleTeamDetailsForm);
    }
    
    const mentorForm = document.getElementById('mentor-selection-form');
    if (mentorForm) {
        mentorForm.addEventListener('submit', handleMentorSelectionForm);
    }
    
    const ideasForm = document.getElementById('project-ideas-form');
    if (ideasForm) {
        ideasForm.addEventListener('submit', handleProjectIdeasForm);
    }
    
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // Department change listeners for other members
    for (let i = 2; i <= 4; i++) {
        const deptDropdown = document.getElementById(`member-${i}-dept`);
        if (deptDropdown) {
            deptDropdown.addEventListener('change', function() {
                populateStudentByDepartment(this.value, `member-${i}`);
            });
        }
    }
    
    // Mentor authentication event listeners
    const mentorLoginBtn = document.getElementById('mentor-login-btn');
    const mentorLogoutBtn = document.getElementById('mentor-logout-btn');
    const mentorPasswordField = document.getElementById('mentor-password');

    if (mentorLoginBtn) {
        mentorLoginBtn.addEventListener('click', mentorLogin);
    }

    if (mentorLogoutBtn) {
        mentorLogoutBtn.addEventListener('click', mentorLogout);
    }

    if (mentorPasswordField) {
        mentorPasswordField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') mentorLogin();
        });
    }

    // Mentor selector event listener
    const mentorSelector = document.getElementById('mentor-selector');
    if (mentorSelector) {
        mentorSelector.addEventListener('change', handleMentorSelection);
    }
    
    // Load saved mentor selections
    const savedSelections = localStorage.getItem('mentorSelections');
    if (savedSelections) {
        selectedMentorTeams = JSON.parse(savedSelections);
    }
}



// ====== START APPLICATION ======
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded');
    await loadDataFromBackend();
    await initializeApp();
    
    // Your existing event listeners...
});


// Make functions globally available for onclick handlers
window.showPage = showPage;
window.handleTeamDetailsForm = handleTeamDetailsForm;
window.handleMentorSelectionForm = handleMentorSelectionForm;
window.handleProjectIdeasForm = handleProjectIdeasForm;
window.handleAdminLogin = handleAdminLogin;
window.logout = logout;
window.deleteTeam = deleteTeam;
window.exportTeamsToCSV = exportTeamsToCSV;
window.handleMentorSelection = handleMentorSelection;
window.selectTeam = selectTeam;
window.deselectTeam = deselectTeam;
window.exportMentorSelectionsToCSV = exportMentorSelectionsToCSV;
// Make sure deselectTeam is globally available
window.deselectTeam = deselectTeam;
window.handleMentorEditLogin = handleMentorEditLogin;
window.mentorEditLogout = mentorEditLogout;
window.openFinalizeIdeaModal = openFinalizeIdeaModal;
window.closeFinalizeIdeaModal = closeFinalizeIdeaModal;
window.addIdeaOption = addIdeaOption;
window.confirmFinalizeIdea = confirmFinalizeIdea;
window.acceptTeam = acceptTeam;
window.rejectTeam = rejectTeam;
window.mentorLogin = mentorLogin;
window.mentorLogout = mentorLogout;
window.handleHODLogin = handleHODLogin;
window.hodLogout = hodLogout;
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.changeLeader = changeLeader;
window.addNewMember = addNewMember;
window.cancelAddMember = cancelAddMember;
window.confirmAddMember = confirmAddMember;
window.removeMember = removeMember;
window.exportFinalListToCSV = exportFinalListToCSV;
window.finalListHODLogout = finalListHODLogout;
// Add this line with your other window assignments
window.backToDashboardWithLogout = backToDashboardWithLogout;
