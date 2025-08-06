import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
// No specific CSS import needed here, as index.css/main.css is imported globally

// Main App Component
const App = () => {
  // State to manage user authentication status (token and user role)
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  // State to manage the current view (e.g., 'login', 'students', 'add-edit-student')
  const [currentView, setCurrentView] = useState('login');
  // State to hold student data
  const [students, setStudents] = useState([]);
  // State to hold the student being edited (null for new student)
  const [editingStudent, setEditingStudent] = useState(null);
  // State for loading indicators
  const [isLoading, setIsLoading] = useState(false);
  // State for messages (e.g., success, error)
  const [message, setMessage] = useState({ type: '', text: '' });

  // Simulate API base URL (replace with your actual backend URL)
  const API_BASE_URL = 'http://localhost:5000/api';

  // Function to handle user logout (moved up for useCallback dependency)
  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setToken(null);
    setUserRole(null);
    setStudents([]); // Clear student data on logout
    setCurrentView('login');
    setMessage({ type: 'success', text: 'Logged out successfully.' });
  }, [setToken, setUserRole, setStudents, setCurrentView, setMessage]); // Dependencies for handleLogout

  // Function to fetch students from the backend (wrapped in useCallback)
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      console.log('Fetching students from:', `${API_BASE_URL}/students`);
      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Send token for authentication
        },
      });

      console.log('Fetch students response status:', response.status);
      const data = await response.json();
      console.log('Fetch students response data:', data);

      if (response.ok) {
        setStudents(data);
        setMessage({ type: 'success', text: 'Students loaded.' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to fetch students.' });
        if (response.status === 401 || response.status === 403) {
          handleLogout(); // Log out if unauthorized or forbidden
        }
      }
    } catch (error) {
      console.error('Fetch students error:', error);
      setMessage({ type: 'error', text: 'Network error fetching students.' });
    } finally {
      setIsLoading(false);
    }
  }, [token, handleLogout, setStudents, setIsLoading, setMessage]); // Dependencies for fetchStudents

  // Effect to check authentication on component mount and token change
  useEffect(() => {
    if (token && userRole) {
      setCurrentView('students');
      fetchStudents(); // Fetch students if authenticated
    } else {
      setCurrentView('login');
    }
  }, [token, userRole, fetchStudents]); // Added fetchStudents to dependency array

  // Function to handle user login
  const handleLogin = async (username, password) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      console.log('\n--- LOGIN ATTEMPT ---');
      console.log('Frontend sending login request to:', `${API_BASE_URL}/auth/login`);
      console.log('Username entered:', username);
      console.log('Password entered (plain-text):', password); // For debugging only! Remove in production.

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status from backend:', response.status);
      const data = await response.json();
      console.log('Login response data from backend:', data);

      if (response.ok) {
        // Store token and role in localStorage and state
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.role);
        setToken(data.token);
        setUserRole(data.role);
        setMessage({ type: 'success', text: 'Login successful!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Login failed.' });
      }
    } catch (error) {
      console.error('Login error (frontend network issue):', error);
      setMessage({ type: 'error', text: 'Network error during login. Check if backend is running.' });
    } finally {
      setIsLoading(false);
    }
  };


  // Function to handle adding or updating a student
  const handleSaveStudent = async (studentData) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    const method = studentData.id ? 'PUT' : 'POST';
    const url = studentData.id ? `${API_BASE_URL}/students/${studentData.id}` : `${API_BASE_URL}/students`;

    try {
      console.log(`${method} student to:`, url, 'with data:', studentData);
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });

      console.log('Save student response status:', response.status);
      const data = await response.json();
      console.log('Save student response data:', data);

      if (response.ok) {
        setMessage({ type: 'success', text: `Student ${studentData.id ? 'updated' : 'added'} successfully!` });
        setCurrentView('students'); // Go back to student list
        fetchStudents(); // Refresh student list
      } else {
        setMessage({ type: 'error', text: data.message || `Failed to ${studentData.id ? 'update' : 'add'} student.` });
      }
    } catch (error) {
      console.error('Save student error:', error);
      setMessage({ type: 'error', text: 'Network error saving student.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle deleting a student
  const handleDeleteStudent = async (studentId) => {
    // Confirmation dialog
    // IMPORTANT: In a real application, replace window.confirm with a custom modal UI
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      console.log('Deleting student:', `${API_BASE_URL}/students/${studentId}`);
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Delete student response status:', response.status);
      const data = await response.json();
      console.log('Delete student response data:', data);

      if (response.ok) {
        setMessage({ type: 'success', text: 'Student deleted successfully!' });
        fetchStudents(); // Refresh student list
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete student.' });
      }
    } catch (error) {
      console.error('Delete student error:', error);
      setMessage({ type: 'error', text: 'Network error deleting student.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Render different views based on currentView state
  const renderView = () => {
    if (!token) {
      return <Login onLogin={handleLogin} isLoading={isLoading} message={message} />;
    }

    switch (currentView) {
      case 'students':
        return (
          <StudentList
            students={students}
            userRole={userRole}
            onAdd={() => { setEditingStudent(null); setCurrentView('add-edit-student'); }}
            onEdit={(student) => { setEditingStudent(student); setCurrentView('add-edit-student'); }}
            onDelete={handleDeleteStudent}
            onLogout={handleLogout}
            isLoading={isLoading}
            message={message}
            fetchStudents={fetchStudents} // Pass fetchStudents to allow re-fetching
          />
        );
      case 'add-edit-student':
        return (
          <AddEditStudent
            student={editingStudent}
            onSave={handleSaveStudent}
            onCancel={() => { setEditingStudent(null); setCurrentView('students'); }}
            isLoading={isLoading}
            message={message}
          />
        );
      default:
        return <Login onLogin={handleLogin} isLoading={isLoading} message={message} />;
    }
  };

  return (
    <div className="app-container">
      <div className="main-card">
        <h1 className="main-title">
          Student Database Management System
        </h1>
        {/* Message display area */}
        {message.text && (
          <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
            {message.text}
          </div>
        )}
        {renderView()}
      </div>
    </div>
  );
};

// Login Component
const Login = ({ onLogin, isLoading, message }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="login-card">
      <h2 className="section-title">Login</h2>
      <form onSubmit={handleSubmit} className="form-layout">
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username:
          </label>
          <input
            type="text"
            id="username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="button primary-button"
          disabled={isLoading}
        >
          {isLoading ? 'Logging In...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

// StudentList Component
const StudentList = ({ students, userRole, onAdd, onEdit, onDelete, onLogout, isLoading, message, fetchStudents }) => {
  // Effect to re-fetch students if the message indicates a change (e.g., after add/edit/delete)
  useEffect(() => {
    if (message.type === 'success' && (message.text.includes('added') || message.text.includes('updated') || message.text.includes('deleted'))) {
      fetchStudents();
    }
  }, [message, fetchStudents]);

  return (
    <div>
      <div className="list-header">
        <h2 className="section-title">Student List</h2>
        <div className="button-group">
          {/* Only allow 'admin' or 'teacher' to add students */}
          {(userRole === 'admin' || userRole === 'teacher') && (
            <button
              onClick={onAdd}
              className="button success-button"
            >
              Add Student
            </button>
          )}
          <button
            onClick={onLogout}
            className="button danger-button"
          >
            Logout
          </button>
        </div>
      </div>

      {isLoading && <div className="loading-message">Loading students...</div>}

      {!isLoading && students.length === 0 && (
        <div className="no-data-message">No students found.</div>
      )}

      {!isLoading && students.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th className="table-cell header-cell">ID</th>
                <th className="table-cell header-cell">Name</th>
                <th className="table-cell header-cell">Email</th>
                <th className="table-cell header-cell">Major</th>
                <th className="table-cell header-cell">GPA</th>
                <th className="table-cell header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {students.map((student) => (
                <tr key={student.id} className="table-row">
                  <td className="table-cell">{student.id}</td>
                  <td className="table-cell">{student.name}</td>
                  <td className="table-cell">{student.email}</td>
                  <td className="table-cell">{student.major}</td>
                  <td className="table-cell">{student.gpa}</td>
                  <td className="table-cell action-buttons">
                    <div className="button-group">
                      {/* Only allow 'admin' or 'teacher' to edit */}
                      {(userRole === 'admin' || userRole === 'teacher') && (
                        <button
                          onClick={() => onEdit(student)}
                          className="button info-button"
                        >
                          Edit
                        </button>
                      )}
                      {/* Only allow 'admin' to delete */}
                      {userRole === 'admin' && (
                        <button
                          onClick={() => onDelete(student.id)}
                          className="button danger-button"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// AddEditStudent Component
const AddEditStudent = ({ student, onSave, onCancel, isLoading, message }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: '',
    gpa: '',
  });

  // Populate form data if editing an existing student
  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({ name: '', email: '', major: '', gpa: '' }); // Clear form for new student
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="form-card">
      <h2 className="section-title">
        {student ? 'Edit Student Record' : 'Add New Student Record'}
      </h2>
      <form onSubmit={handleSubmit} className="form-layout">
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="input-field"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="major">
            Major:
          </label>
          <input
            type="text"
            id="major"
            name="major"
            className="input-field"
            value={formData.major}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="gpa">
            GPA:
          </label>
          <input
            type="number"
            id="gpa"
            name="gpa"
            step="0.01"
            min="0"
            max="4"
            className="input-field"
            value={formData.gpa}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="button-group form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="button secondary-button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button primary-button"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (student ? 'Update Record' : 'Add Record')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;

