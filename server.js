import mysql from 'mysql';
import config from './config.js';
import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import response from 'express';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
const port = process.env.PORT || 9000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));

// database connection
let db = mysql.createConnection(config);
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL database');
});
  
function queryAsync(sql) {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
        });
    });
}

// registration endpoint
app.post('/register', async (req, res) => {
	let newUser = req.body;

	// check if users exists
	var result = await queryAsync(`SELECT * FROM users WHERE email=\'${newUser.email}\'`);
	if(result.length == 0){
		const query = 'INSERT INTO users (first_name, last_name, email, firebase_uid) VALUES (?, ?, ?, ?)';
		db.query(query, [newUser.first_name, newUser.last_name, newUser.email, newUser.firebase_uid], (err, results) => {
			if (err) {
				console.error('Error inserting new user:', err);
				return res.status(500).json({ error: 'Internal Server Error' });
			}
			res.json({success : "Registration success", status : 200});
		});
	} else{
		res.status(400).json({ error: 'A user with that email already exists' });
	}
});

//create course, put in tables
app.post('/createCourse', async (req, res) => {
	console.log("call Createcourse")
    try {

        const { courseName, subjects, isPublic, maxUsers, user_id } = req.body;

        // Insert data into the courses table
        const courseQuery = 'INSERT INTO courses (course_name, is_public, max_users, user_id) VALUES (?, ?, ?, ?)';
        db.query(courseQuery, [courseName, isPublic, maxUsers, user_id], (courseError, courseResult) => {
            if (courseError) {
                console.error('Error inserting course:', courseError.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            //get courseid
            const courseId = courseResult.insertId;

            // Insert subjects into the course_subjects table
            const subjectsArray = subjects.split(',').map((subject) => [courseId, subject.trim()]);
            const subjectsQuery = 'INSERT INTO course_subjects (course_id, subject_name) VALUES ?';
            db.query(subjectsQuery, [subjectsArray], (subjectsError) => {
                if (subjectsError) {
                    console.error('Error inserting subjects:', subjectsError.message);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                // Return the courseId in the response
                res.status(200).json({ success: true, courseId });
            });
        });
    } catch (error) {
        console.error('Error creating course:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// API to add a review to the database
app.post('/api/addReview', (req, res) => {
	const { userID, movieID, reviewTitle, reviewContent, reviewScore } = req.body;

	let connection = mysql.createConnection(config);

	const sql = `INSERT INTO Review (userID, movieID, reviewTitle, reviewContent, reviewScore) 
				 VALUES (?, ?, ?, ?, ?)`;

	const data = [userID, movieID, reviewTitle, reviewContent, reviewScore];

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			console.error("Error adding review:", error.message);
			return res.status(500).json({ error: "Error adding review to the database" });
		}

		return res.status(200).json({ success: true });
	});
	connection.end();
});


app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
