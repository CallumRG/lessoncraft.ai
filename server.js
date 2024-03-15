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

// LESSONS---------------------------------------------------------------------------------------

// Insert new Lesson Record
app.post('/createLesson', async (req, res) => {
	let { title, user_id, description, is_public, citation} = req.body;

    const query = 'INSERT INTO lessons (title, description, user_id, is_public, citation) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, description, user_id, is_public, citation], (err, results) => {
        if (err) {
            console.error('Error inserting new lesson:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({success : "New Lesson created successfully", status : 200, id: results.insertId});
    });
});

// Insert new Lesson Section Record
app.post('/createLessonSection', async (req, res) => {
	let { lessonId, title, body} = req.body;

    const query = 'INSERT INTO lesson_sections (title, body, lesson_id) VALUES (?, ?, ?)';
    db.query(query, [title, body, lessonId], (err, results) => {
        if (err) {
            console.error('Error inserting new lesson section:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({success : "New Lesson Section created successfully", status : 200});
    });
});

// Insert new Lesson Practice Question
app.post('/createLessonPracticeQuestion', async (req, res) => {
	let { question, option_a, option_b, option_c, option_d, answer, lessonId } = req.body;

    const query = 'INSERT INTO lesson_practice_questions (question, option_a, option_b, option_c, option_d, answer, lesson_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [question, option_a, option_b, option_c, option_d, answer, lessonId], (err, results) => {
        if (err) {
            console.error('Error inserting new lesson practice question:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({success : "New Lesson Practice Question created successfully", status : 200});
    });
});

// Endpoint to increment views for a lesson
app.post('/lessons/:lessonId/view', (req, res) => {
    const lessonId = req.body.lesson_id;
    const viewerId = req.body.viewer_id;
  
    // Increment view count for the lesson
    db.query('UPDATE lessons SET view_count = view_count + 1 WHERE id = ?', [lessonId], (error, results) => {
        if (error) {
            console.error('Error updating view count:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    
        // Insert view record if logged in
        if(viewerId !== ""){
            db.query('INSERT INTO views (lesson_id, viewer_id) VALUES (?, ?)', [lessonId, viewerId], (error, results) => {
                if (error) {
                console.error('Error recording view:', error);
                return res.status(500).json({ message: 'Internal server error' });
                }
                res.status(200).json({ message: 'View recorded successfully' });
            });
        }
        else{
            res.status(200).json({ message: 'View recorded successfully' });
        }
    });
});

// Get a lesson
app.post('/lesson', async (req, res) => {
    let lesson_id = req.body.lesson_id;

    const query = `SELECT * FROM lessons WHERE id=?`;

    db.query(query, [lesson_id], (err, results) => {
        if (err) {
            console.error('Error retrieving lesson:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            res.json({ lesson: results });
        } else {
            return res.status(404).json({ error: 'Lesson not found' });
        }
    });
});

// Get Lesson Sections
app.post('/lessonSections', async (req, res) => {
    let lesson_id = req.body.lesson_id;

    const query = `SELECT * FROM lesson_sections WHERE lesson_id=? ORDER BY id ASC`;

    db.query(query, [lesson_id], (err, results) => {
        if (err) {
            console.error('Error retrieving lesson sections:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            res.json({ lesson: results });
        } else {
            return res.status(404).json({ error: 'No Lesson Sections were found' });
        }
    });
});

// Get Lesson Practice Questions
app.post('/lessonPracticeQuestions', async (req, res) => {
    let lesson_id = req.body.lesson_id;

    const query = `SELECT * FROM lesson_practice_questions WHERE lesson_id=?`;

    db.query(query, [lesson_id], (err, results) => {
        if (err) {
            console.error('Error retrieving lesson practice questions:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            res.json({ lesson: results });
        } else {
            return res.status(404).json({ error: 'No Practice Questions were found for the provided lesson id' });
        }
    });
});

//search and return lessons
app.post('/searchLessons', (req, res) => {
    const { title, description, citation, name } = req.body;
  
    //data and filter by inputted fields
    const sql = `
        SELECT lessons.id, lessons.title, lessons.description, lessons.created_at, lessons.updated_at, lessons.citation, lessons.view_count, CONCAT(users.first_name, ' ', users.last_name) AS name
        FROM lessons
        INNER JOIN users ON lessons.user_id = users.id
        WHERE lessons.is_public = 1
        AND lessons.title LIKE CONCAT('%', ?, '%')
        AND lessons.description LIKE CONCAT('%', ?, '%')
        AND lessons.citation LIKE CONCAT('%', ?, '%')
        AND CONCAT(users.first_name, ' ', users.last_name) LIKE CONCAT('%', ?, '%');
    `;

    db.query(sql, [title, description, citation, name], (err, results) => {
      if (err) {
        console.error('Error fetching lessons:', err);
        res.status(500).json({ error: 'An error occurred while fetching lessons' });
        return;
      }
  
      res.json({ lessons: results });
    });
  });

// LESSON LIKES---------------------------------------------------------------------------------------------

// like actions for a lesson
app.post('/like', (req, res) => {
    const { action, user_id, lesson_id } = req.body;
  
    if (action === 'add') {
      // Add a like
      db.query('INSERT INTO likes (user_id, lesson_id) VALUES (?, ?)', [user_id, lesson_id], (error, results) => {
        if (error) {
          console.error('Error adding like:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ message: 'Like added successfully' });
      });
    } else if (action === 'remove') {
      // Remove a like
      db.query('DELETE FROM likes WHERE user_id = ? AND lesson_id = ?', [user_id, lesson_id], (error, results) => {
        if (error) {
          console.error('Error removing like:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ message: 'Like removed successfully' });
      });
    } else if (action === 'check') {
      // Check if a like exists
      db.query('SELECT * FROM likes WHERE user_id = ? AND lesson_id = ?', [user_id, lesson_id], (error, results) => {
        if (error) {
          console.error('Error checking like:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (results.length > 0) {
          res.status(200).json({ liked: true });
        } else {
          res.status(200).json({ liked: false });
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
});

// Endpoint to fetch the number of likes on a lesson
app.post('/lessonlikes', (req, res) => {
    const { lesson_id } = req.body;

    db.query('SELECT COUNT(*) AS like_count FROM likes WHERE lesson_id = ?', [lesson_id], (error, results) => {
      if (error) {
        console.error('Error fetching like count:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(200).json({ like_count: results[0].like_count });
    });
});

// ------------------------------------------------------------------------------------------------------------

// USERS LESSON DASH----------------------------------------------------------------------------

// fetch lessons created by a user
app.post('/lessons/byme', (req, res) => {
    const { user_id } = req.body;
  
    db.query('SELECT * FROM lessons WHERE user_id = ? ORDER BY id ASC', [user_id], (error, results) => {
      if (error) {
        console.error('Error fetching lessons:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(200).json(results);
    });
});

// fetch all liked lessons for a user
app.post('/lessons/liked', (req, res) => {
    const { user_id } = req.body;

    const query = 'SELECT lessons.* FROM lessons INNER JOIN likes ON lessons.id = likes.lesson_id WHERE likes.user_id = ?';
    db.query(query, [user_id], (error, results) => {
        if (error) {
            console.error('Error fetching liked lessons:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json(results);
    });
});

// ------------------------------------------------------------------------------------------------------------

// USERS--------------------------------------------------------------------------------------------------

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

app.get('/getUserDetails', async (req, res) => {
    const firebaseId = req.query.firebase_uid;

    try {
        const query = `SELECT * FROM users WHERE firebase_uid = ?`;
        db.query(query, [firebaseId], (err, result) => {
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

app.get('/getDBUserDetails', async (req, res) => {
    const userId = req.query.id;

    try {
        const query = `SELECT * FROM users WHERE id = ?`;
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

// ----------------------------------------------------------------------------------------------------------


// COURSES--------------------------------------------------------------------------------------------------

//create course, put in tables
app.post('/createCourse', async (req, res) => {
    try {

        const { courseName, description, subjects, isPublic, maxUsers, user_id } = req.body;

        // Insert data into the courses table
        const courseQuery = 'INSERT INTO courses (course_name, description, is_public, max_users, user_id) VALUES (?, ?, ?, ?, ?)';
        db.query(courseQuery, [courseName, description, isPublic, maxUsers, user_id], (courseError, courseResult) => {
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
        SELECT courses.id, courses.course_name, courses.description, courses.is_public, courses.max_users, courses.user_id, users.first_name, users.last_name, users.email, users.firebase_uid
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

//search and return courses
app.post('/searchCourses', (req, res) => {
    const { course, description, subject, instructor } = req.body;
  
    // grab data and filter by inputted fields
    const sql = `
    SELECT courses.id, courses.course_name, courses.description, GROUP_CONCAT(course_subjects.subject_name SEPARATOR ', ') AS subjects, CONCAT(users.first_name, ' ', users.last_name) AS instructor
    FROM courses
    INNER JOIN users ON courses.user_id = users.firebase_uid
    LEFT JOIN course_subjects ON course_subjects.course_id = courses.id
    WHERE courses.is_public = 1
    AND courses.course_name LIKE CONCAT('%', ?, '%')
    AND courses.description LIKE CONCAT('%', ?, '%')
    AND CONCAT(users.first_name, ' ', users.last_name) LIKE CONCAT('%', ?, '%')
    GROUP BY courses.id, courses.course_name, courses.description, CONCAT(users.first_name, ' ', users.last_name)
    HAVING GROUP_CONCAT(course_subjects.subject_name) LIKE CONCAT('%', ?, '%');
    `;

    db.query(sql, [course, description, instructor, subject], (err, results) => {
      if (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'An error occurred while fetching courses' });
        return;
      }
  
      res.json({ courses: results });
    });
  });


// ---------------------------------------------------------------------------------------------------------------------


app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
