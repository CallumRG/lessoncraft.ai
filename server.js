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
            const course_id = courseResult.insertId;

            // inserts corresponding subjects and course_id
            const subjectsArray = subjects.split(',').map((subject) => [course_id, subject.trim()]);
            const subjectsQuery = 'INSERT INTO course_subjects (course_id, subject_name) VALUES ?';
            db.query(subjectsQuery, [subjectsArray], (subjectsError) => {
                if (subjectsError) {
                    console.error('Error inserting subjects:', subjectsError.message);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                // return status and course_id
                res.status(200).json({ success: true, course_id });
            });
        });
    } catch (error) {
        console.error('Error creating course:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//grab course info 
app.post('/courseInfo', async (req, res) => {
    let course_id = req.body.course_id;

    const query = `
        SELECT courses.id, courses.course_name, courses.is_public, courses.max_users, courses.user_id, users.first_name, users.last_name, users.email, users.firebase_uid
        FROM courses
        JOIN users ON courses.user_id = users.firebase_uid
        WHERE courses.id = ?;
    `;

    db.query(query, [course_id], (err, results) => {
        if (err) {
            console.error('Error retrieving course info:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // check if any rows were returned
        if (results.length > 0) {

            // send the result back to the client
            res.json({ courseInfo: results[0] });
        } else {

            // no matching course found
            return res.status(404).json({ error: 'Course not found' });
        }
    });
});

app.post('/courseFetchAdmin', async (req, res) => {
    let course_id = req.body.course_id;

    const query = `
        SELECT course_administrators.admin_id, users.first_name, users.last_name, users.email
        FROM course_administrators
        JOIN users on users.firebase_uid = course_administrators.admin_id
        WHERE course_id = ?;        
    `;

    db.query(query, [course_id], (err, results) => {
        if (err) {
            console.error('Error retrieving course admins:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // check if any rows were returned
        if (results.length > 0) {

            // send the result back to the client
            res.json({ courseAdmins: results });

        } else {

            // no admins for course found
            return res.status(404).json({ error: 'No admins' });
        }
    });
});

// delete course admin
app.post('/courseDeleteAdmin', async (req, res) => {
    let course_id = req.body.course_id;
    let admin_id = req.body.admin_id;
    let current_id = req.body.current_id;

    // check if the current_id matches the firebase_uid of the course owner
    const query1 = `
        SELECT user_id
        FROM courses
        WHERE id = ?;
    `;

    db.query(query1, [course_id], (err, results) => {
        if (err) {
            console.error('error checking course owner:', err);
            return res.status(500).json({ error: 'internal server error' });
        }

        if (results.length === 0) {
            console.error('course not found');
            return res.status(404).json({ error: 'course not found' });
        }

        const courseOwnerUid = results[0].user_id;

        if (current_id !== courseOwnerUid) {
            console.error('not course owner');
            return res.status(403).json({ error: 'forbidden: not the course owner' });
        }

        // if the current_id matches the course owner's firebase_uid, proceed with deleting the admin
        const deleteAdminQuery = `
            DELETE FROM course_administrators 
            WHERE course_id = ? AND admin_id = ?;   
        `;

        db.query(deleteAdminQuery, [course_id, admin_id], (err, results) => {
            if (err) {
                console.error('error deleting course admin:', err);
                return res.status(500).json({ error: 'internal server error' });
            }

            return res.status(200).json({ success: true });
        });
    });
});


// add course admin
app.post('/courseAddAdmin', async (req, res) => {
    let course_id = req.body.course_id;
    let newAdminEmail = req.body.newAdminEmail;
    let current_id = req.body.current_id;

    // check if the current_id matches the firebase_uid of the course owner
    const query1 = `
        SELECT user_id
        FROM courses
        WHERE id = ?;
    `;

    db.query(query1, [course_id], (err, results) => {
        if (err) {
            console.error('error checking course owner:', err);
            return res.status(500).json({ error: 'internal server error' });
        }

        if (results.length === 0) {
            console.error('course not found');
            return res.status(404).json({ error: 'course not found' });
        }

        const courseOwnerUid = results[0].user_id;

        if (current_id !== courseOwnerUid) {
            console.error('not course owner');
            return res.status(403).json({ error: 'forbidden: not the course owner' });
        }

        // proceed with adding the new admin
        // fetch the firebase_uid for the provided newAdminEmail
        const query2 = 'SELECT firebase_uid FROM users WHERE email = ?;';
        db.query(query2, [newAdminEmail], async (err, results) => {
            if (err) {
                console.error('Error fetching user ID:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length === 0) {
                // user with the provided email not found
                return res.status(404).json({ error: 'User not found' });
            }

            const admin_id = results[0].firebase_uid;

            // check if the admin already exists
            const query3 = 'SELECT * FROM course_administrators WHERE course_id = ? AND admin_id = ?;';
            db.query(query3, [course_id, admin_id], async (err, results) => {
                if (err) {
                    console.error('Error checking existing association:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                if (results.length > 0) {
                    // admin already exists
                    return res.status(400).json({ error: 'Administrator already added to the course' });
                }

                // insert the new admin
                const query4 = 'INSERT INTO course_administrators (course_id, admin_id) VALUES (?, ?);';
                db.query(query4, [course_id, admin_id], (err, results) => {
                    if (err) {
                        console.error('Error adding administrator to course:', err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    return res.status(200).json({ success: true });
                });
            });
        });
    });
});


app.post('/getUserDetails', async (req, res) => {
    const { userId } = req.body; // Assuming you're sending a user ID to identify the user

    try {
        const query = `SELECT first_name, last_name FROM users WHERE user_id = ?`;
        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (result.length > 0) {
                const userDetails = result[0];
                res.json(userDetails);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        });
    } catch (err) {
        console.error('Database error:', err);
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
