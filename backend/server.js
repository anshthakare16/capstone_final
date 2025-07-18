const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase (add these to your .env file)
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Student data - your exact data
const studentsData = {
    "CSE A": [
        "Daksh Sharma", "Tanmay Pravin Tate", "Deven Sharad Kshirsagar", "Aarush Pradeep Kote",
        "Lokhande Sejal Manoj", "Darshan Dhananjay Jagtap", "Rushil Jain", "Deshmukh Ayush Ashish",
        "Kadam Vaishnavi Shailendra", "Pawar Yuvraj Shailesh", "Bhorkar Jay Anand",
        "Hoshmit Rajesh Mahajan", "Vaidehee Susheel Belan", "Bhakti Dinesh Joshi",
        "Atharv Gajanan Chaware", "Kulkarni Avaneesh Yogesh", "Samihan Raj Sandbhor",
        "Riddhesh Yogesh Patil", "Londhe Rohan Rohit", "Sairam Sachin Pardeshi",
        "Om Sachin Pardeshi", "Aryan Madhukar Shinde", "Ishani Amol Badhe",
        "Bhamodkar Samruddhi Sandip", "Shaikh Saad Imran", "Shlok Chaitanya Shah",
        "Jog Arjun Kedar", "Purva Swanand Deshmukh", "Janavi Honrao", "Ranavare Ishan Nitin",
        "Abhiraj Pradeep Borade", "Goluguri Sulieman", "Ayush Chandrashekhar Pasalkar",
        "Aarushi Pankaj Jawale", "Deshpande Aarya Aniruddha", "Ishan Bhushan Dhaneshwar",
        "Jadhav Nikhil Raju", "Shaurya Rohit Shewale", "Telagamreddy Purnasai Saatvik",
        "Anish Chaitanya Rashinkar", "Aditya Singh Chauhan", "Aditya Jaydeep Shevate",
        "Lalit Vijay Patil", "Nimish Bhojraj Lanjewar", "Aditya Anil Patil",
        "Bhargav Athreya Munnaluri", "Pardeshi Samiksha Bipin", "Om Santosh Desai",
        "Aranya Nath Misra", "Armaan Kumar Rana", "Pilmenraj Glen Leslie",
        "Shwetank Prafulla Patil", "Nidhi Umakant Thakare", "Ashkan Altaf Tamboli",
        "Deep Dilip Salunkhe", "Krishnaraj Ravindra Shinde", "Aayush Abhijeet Patil",
        "Shivam Sachin Honrao", "Arnav Tushar Gandre", "Isha Satish Thube",
        "Attar Saniya Sameer", "Simran Ramdayal Ray", "Deokar Durva Dilip",
        "Vaidehi Prashant Mane", "Vedant Sachin Muthiyan", "Kelkar Amogh Amit",
        "Kulkarni Ashutosh Ashish", "Taniska Ashish Dhanlonhe", "Yognandan Narayan Bhere",
        "Avani Pravin Chandsare", "Giridhar Krishna Sunil", "Harshavardhan Kailas Sasar",
        "Samarth Shivaji Kokate", "Raj Deepak Chavan"
    ],
    "CSE B": [
        "Reeya Mandar Keskar", "Radha Prasad Kurhekar", "Deshmukh Aarya Dhananjay",
        "Aryan Swanand Kulkarni", "Khushal Sanjay Diwate", "Ayush Prashant Patil",
        "Apeksha Ishtaling Parashetti", "Amar Nath Dwivedi", "Vaishnav Maruti Kaspate",
        "Kulkarni Sanchita Suhas", "Pawar Rushikesh Pramod", "Aarti Dashrath Raut",
        "Gadiya Niraj Nandlal", "Reet Jeevan Shewale", "Oswal Vidhi Hasmukh",
        "Ananya Rohidas Gawari", "Samarth Sachin Ghenand", "Tanisha Jitesh Gandhi",
        "Giri Unmesh Prakash", "Omkar Surendra Purav", "Siddhant Yogesh Pasalkar",
        "Aniket Abhay Joshi", "Desai Vedang Dipesh", "Kshiteej Abhijeet Toradmal",
        "Priyal Gulab Patil", "Radhika Sanjay Sogam", "Yash Dnyaneshwar Narale",
        "Khushi Rupareliya", "Nair Vinit Biju", "Shifa Murad Khan", "Khushi Manoj Patil",
        "Ibrahim Abdul Jalil Kache", "Pathare Tanishk Santosh", "Tamobli Nakul Atul",
        "Patil Sarthak Vitthal", "Aryan Bajirao Suryawanshi", "Shaikh Zidan Ghudusab",
        "Vyas Tanmay Navaratan", "Takawale Siddhi Sunil Vaishali", "Jaid Vedant Satish",
        "Abhinav Raj", "Bhilare Vedant", "Date Vangmayee Tushar", "Harsh Harihar Kulkarni",
        "Mote Shravani Shantanu", "Ishan Rahul Jabade", "Anirudha Sachin Thite",
        "Ankit Amol Gaware", "Maithili Mahesh Pene", "Motwani Riya Jay",
        "Archit Anil Kadam", "Sparsh Sagar Doshi", "Palak Pankaj Gadhari",
        "Mohammad Rehan Mushahid Ansari", "Pawar Prithviraj Chandrakant",
        "Yadav Samruddhi Anish Padmashree", "Rasane Arnav Manoj", "Swasti Pravin Shinde",
        "Vedant Raju Ilag", "Ganjave Tanaya Prashant", "Mann Singhvi",
        "Durvank Pankaj Borole", "Vaishnavi Prakash Jadhav", "Pratham Nanagiri",
        "Abhilasha Manoj Gandhi", "Rajarshi Ishita Sandeep", "Tejas Sachin Shelar",
        "Saarth Vipin Borole", "Masul Aryan Hilal", "Kanojia Palak Prashant",
        "Pratik Bipinkumar Mishra", "Shinde Atharva Rohidas", "Aditya Prakash Kunjir",
        "Pranav Aravindrao Suryawanshi", "Kushagri Saxena"
    ],
    "AIDS": [
        "Vedant Prakash Parab", "Gujar Yash Nilesh", "Shriya Shirish Sabnis", "Gauri Revaji Auti",
        "Biswas Aaliya Sohail", "Sanika Kiran Deshmukh", "Kshitij Vijay Shinde", "Ansh Dnyaneshwar Thakare",
        "Rutav Ritesh Mehta", "Tejas Deepak Maskar", "Shaurya Ajay Panhale", "Shaikh Mehran Majid",
        "Yash Ganesh Gadiwan", "Sreejit Majumder", "Amrute Aaryan Jitendra", "Vivaan Varun Mathur",
        "Vedika Kapoor", "Soham Sachin Vidhate", "Shravani Kiran Ruikar", "Om Vinayak Honrao",
        "Darshan Vinayak Nayak", "Manish Narayan Shinde", "Patil Vedika Dilip", "Manthan Moondra",
        "Gargi Avinash Yekhande", "Ritvik Yogesh Kamble", "Isha Gajanan Kuchekar", "Prathamesh Nilesh Tupe",
        "Aditya Prashant Bodke", "Lavya Singh Chauhan", "Toshika Mukesh Bansal", "Patil Vaibhavi Satish",
        "Saanvi Jeetendra Dhakane", "Shreyash Shammi Ranjan", "Aadi Vishal Hanumante", "Soham Nigam",
        "Rishabh Shreyans Patani", "Pranshu Singh", "Sarvesh  Rakesh Alai", "Tanish Nstrnfts Bhavsar",
        "Aryan Niranjan More", "Daksh Paul", "Isha Pashant Kale", "Harsh Sunil Gidwani",
        "Pushkar  Rakesh Patil", "Aishi Anurag Srivastava", "Anushka Nitin Ugale", "Vansh Parashar",
        "Gayatri Pravin Swami", "Samarth Mahesh Bolkotgi", "Nakshatra Kakani", "Jain Suneri Amit",
        "Shelke Yash Kishor", "Vrunda Kirtibhai Borisagar", "Zoya Yunus Sayyad", "Anaya Sharma",
        "Nema Essha", "Gaiki Lokesh Abhijit", "Ojas Rajshekhar Lature", "Ghodke Aahan Sachin",
        "Sujay Heramb Rasal", "Ajinkya Dattu Sonawane", "Manmohan Shrinivas Parge", "Shivtej Dipak Gaikwad",
        "Wagh Yashraj Nitin", "Anushka Manoj Wani", "Vidhi Rohan Rathod", "Aryan Amar Jadhav",
        "Raj Umesh Shinde", "Tanishka Rajendra Parkale", "Sakshi Kiran Talegaonkar",
        "Shashwath Chandrashekhar Shinde", "Hardik Dhanraj Chaudhary", "Drishti Rahul Rathod",
        "Nicket Shah", "Reet Kaur Bhasin", "Parth Prashant Tupe", "Vallabh Shahaji Pawar",
        "Aashka Akash Porwal", "Samuel Shadrak Chol"
    ]
};

// Build mentor credentials from environment variables
const mentorCredentials = {};
const mentorNames = [
    'Jyoti Khurpude',
    'Sanjivani Kulkarni',
    'Mrunal Fatangare',
    'Hemlata Ohal',
    'Farahhdeeba Shaikh',
    'Prerana Patil',
    'Yogesh Patil',
    'Vilas Rathod',
    'Pradeep Paygude',
    'Kajal Chavan',
    'Megha Dhotey',
    'Pallavi Nehete',
    'Nita Dongre',
    'Mrunal Aware',
    'Shilpa Shitole',
    'Vaishali Langote',
    'Sulkshana Malwade'
];

for (let i = 1; i <= 17; i++) {
    const username = process.env[`MENTOR${i}_USERNAME`];
    const password = process.env[`MENTOR${i}_PASSWORD`];
    if (username && password) {
        mentorCredentials[username] = {
            password: password,
            name: mentorNames[i - 1]
        };
    }
}

// API Endpoints

// Get all students data
app.get('/api/students', (req, res) => {
    res.json({ students: studentsData });
});

// Get mentors list
app.get('/api/mentors', (req, res) => {
    const mentorList = [];
    
    for (let i = 1; i <= 17; i++) {
        const username = process.env[`MENTOR${i}_USERNAME`];
        if (username) {
            mentorList.push({
                username: username,
                name: mentorNames[i - 1]
            });
        }
    }
    
    res.json({ mentors: mentorList });
});

// Get all teams
// Get all teams - FIXED VERSION
// Get all teams - FIXED VERSION
app.get('/api/teams', async (req, res) => {
    try {
        console.log('Fetching teams from Supabase...');
        
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }
        
        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .order('registration_date', { ascending: false });
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log(`Successfully fetched ${data ? data.length : 0} teams`);
        res.json({ teams: data || [] });
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ 
            error: 'Failed to fetch teams', 
            details: error.message 
        });
    }
});



// Save team
app.post('/api/teams', async (req, res) => {
    try {
        const teamData = req.body;
        console.log('Saving team:', teamData);
        
        const { data, error } = await supabase
            .from('teams')
            .insert([teamData])
            .select();
        
        if (error) throw error;
        
        res.json({ success: true, team: data[0] });
    } catch (error) {
        console.error('Error saving team:', error);
        res.status(500).json({ error: 'Failed to save team' });
    }
});

// Delete team
app.delete('/api/teams/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        
        const { error } = await supabase
            .from('teams')
            .delete()
            .eq('team_id', teamId);
        
        if (error) throw error;
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ error: 'Failed to delete team' });
    }
});

// Update team
app.put('/api/teams/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        const updateData = req.body;
        
        const { data, error } = await supabase
            .from('teams')
            .update(updateData)
            .eq('team_id', teamId)
            .select();
        
        if (error) throw error;
        
        res.json({ success: true, team: data[0] });
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({ error: 'Failed to update team' });
    }
});

// Get available students for a department (excluding registered ones)
app.get('/api/students/available/:department', async (req, res) => {
    try {
        const { department } = req.params;
        const { excludeTeamId } = req.query;
        
        // Get all teams
        const { data: teams, error } = await supabase
            .from('teams')
            .select('*');
        
        if (error) throw error;
        
        // Get all registered student IDs
        const registeredStudents = new Set();
        teams.forEach(team => {
            // Skip the team being edited if excludeTeamId is provided
            if (excludeTeamId && team.team_id === excludeTeamId) {
                return;
            }
            
            team.members.forEach(memberId => {
                registeredStudents.add(memberId);
            });
        });
        
        // Filter available students
        const departmentStudents = studentsData[department] || [];
        const availableStudents = departmentStudents.filter((student, index) => {
            const studentId = `${department}_${index}`;
            return !registeredStudents.has(studentId);
        });
        
        res.json({ 
            students: availableStudents,
            department: department
        });
    } catch (error) {
        console.error('Error getting available students:', error);
        res.status(500).json({ error: 'Failed to get available students' });
    }
});

// Authentication endpoints
app.post('/api/auth/admin', (req, res) => {
    const { username, password } = req.body;
    console.log('Admin login attempt:', username);
    
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid admin credentials' });
    }
});

app.post('/api/auth/hod', (req, res) => {
    const { username, password } = req.body;
    console.log('HOD login attempt:', username);
    
    if (username === process.env.HOD_USERNAME && 
        password === process.env.HOD_PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid HOD credentials' });
    }
});

app.post('/api/auth/mentor', (req, res) => {
    const { username, password } = req.body;
    console.log('Mentor login attempt:', username);
    
    const mentorData = mentorCredentials[username];
    if (mentorData && mentorData.password === password) {
        res.json({ 
            success: true, 
            name: mentorData.name,
            username: username
        });
    } else {
        res.json({ success: false, message: 'Invalid mentor credentials' });
    }
});

app.get('/test', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}/test`);
    console.log(`Students: CSE A (${studentsData['CSE A'].length}), CSE B (${studentsData['CSE B'].length}), AIDS (${studentsData['AIDS'].length})`);
});
