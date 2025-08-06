// src/controllers/studentController.js
const pool = require('../config/db');

exports.getAllStudents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error fetching students.' });
  }
};

exports.getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    res.status(500).json({ message: 'Server error fetching student.' });
  }
};

exports.addStudent = async (req, res) => {
  const { name, email, major, gpa } = req.body;
  if (!name || !email || !major || !gpa) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const [result] = await pool.query('INSERT INTO students (name, email, major, gpa) VALUES (?, ?, ?, ?)', [name, email, major, gpa]);
    res.status(201).json({ id: result.insertId, message: 'Student added successfully.' });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Server error adding student.' });
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, major, gpa } = req.body;
  if (!name || !email || !major || !gpa) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const [result] = await pool.query('UPDATE students SET name = ?, email = ?, major = ?, gpa = ? WHERE id = ?', [name, email, major, gpa, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json({ message: 'Student updated successfully.' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error updating student.' });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error deleting student.' });
  }
};