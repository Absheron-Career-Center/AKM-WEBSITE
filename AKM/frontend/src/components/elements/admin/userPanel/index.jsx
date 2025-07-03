import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserPanel = () => {
    const [userData, setUserData] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        jobs: [],
        email: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newJob, setNewJob] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
const fetchUserData = async () => {
    try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            navigate('/login');
            return;
        }

        const response = await axios.get('http://localhost:8080/api/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('API Response:', response.data); // Debug log

        const data = response.data.user || response.data; // Handle both response formats
        
        if (!data) {
            throw new Error('No user data received');
        }

        // Set all user data fields with proper fallbacks
        setUserData({
            name: data.name || '',
            phoneNumber: data.phoneNumber || '',
            address: data.address || '',
            email: data.email || '',
            jobs: data.jobName ? 
                data.jobName.split(',').map(job => job.trim()).filter(job => job) : 
                [],
            _id: data._id || data.id || ''
        });
        
        setLoading(false);
    } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            navigate('/login');
        } else {
            setError(error.response?.data?.message || 'Failed to load user data');
        }
        setLoading(false);
    }
};

        fetchUserData();
    }, [navigate]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleJobChange = (e) => {
        setNewJob(e.target.value);
    };

    const handleAddJob = () => {
        if (newJob.trim()) {
            setUserData(prev => ({
                ...prev,
                jobs: [...prev.jobs, newJob.trim()]
            }));
            setNewJob('');
        }
    };

    const handleRemoveJob = (index) => {
        setUserData(prev => ({
            ...prev,
            jobs: prev.jobs.filter((_, i) => i !== index)
        }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const dataToSend = {
            name: userData.name,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
            jobName: userData.jobs.join(', '),
            email: userData.email
        };

        // Make sure userData._id exists
        if (!userData._id) {
            throw new Error('User ID is missing');
        }

        const response = await axios.put(
            `http://localhost:8080/api/users/${userData._id}`,
            dataToSend,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Update response:', response.data); // Debug log

        // Update local state with the returned data
        const updatedData = response.data.user || response.data;
        setUserData(prev => ({
            ...prev,
            ...updatedData,
            jobs: updatedData.jobName ? 
                updatedData.jobName.split(',').map(job => job.trim()).filter(job => job) : 
                []
        }));

        // Update local storage
        const updatedUser = {
            ...JSON.parse(localStorage.getItem('userData')),
            ...updatedData
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));

        setSuccess('Profile updated successfully!');
        setIsEditing(false);
    } catch (error) {
        console.error('Error updating user data:', error);
        setError(error.response?.data?.message || 
               error.message || 
               'Failed to update profile. Please try again.');
    }
};

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading your profile...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>My Profile</h1>
            
            {error && (
                <div style={{ 
                    color: 'white', 
                    backgroundColor: '#e74c3c',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '15px'
                }}>
                    {error}
                </div>
            )}
            
            {success && (
                <div style={{ 
                    color: 'white', 
                    backgroundColor: '#2ecc71',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '15px'
                }}>
                    {success}
                </div>
            )}

            {isEditing ? (
                <form onSubmit={handleSubmit} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            required
                        />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            required
                            disabled // Typically shouldn't allow email changes
                        />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number:</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={userData.phoneNumber}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            required
                            pattern="[0-9]{10}"
                            title="Please enter a 10-digit phone number"
                        />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={userData.address}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            required
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Jobs:</label>
                        <div style={{ marginBottom: '10px' }}>
                            {userData.jobs.map((job, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '5px'
                                }}>
                                    <span style={{ flexGrow: 1 }}>{job}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveJob(index)}
                                        style={{
                                            background: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '5px 10px',
                                            marginLeft: '10px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                value={newJob}
                                onChange={handleJobChange}
                                placeholder="Enter a new job"
                                style={{ 
                                    flexGrow: 1, 
                                    padding: '10px', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '4px' 
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAddJob}
                                style={{
                                    background: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '10px 15px',
                                    cursor: 'pointer'
                                }}
                            >
                                Add Job
                            </button>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button 
                            type="button" 
                            onClick={() => setIsEditing(false)}
                            style={{
                                padding: '10px 20px',
                                background: '#95a5a6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                background: '#2ecc71',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    <div style={{ 
                        marginBottom: '20px', 
                        padding: '20px', 
                        border: '1px solid #ddd', 
                        borderRadius: '5px',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <h2 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            Personal Information
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '15px' }}>
                            <strong>Name:</strong> <span>{userData.name}</span>
                            <strong>Email:</strong> <span>{userData.email}</span>
                            <strong>Phone:</strong> <span>{userData.phoneNumber}</span>
                            <strong>Address:</strong> <span>{userData.address}</span>
                        </div>
                        
                        <h3 style={{ margin: '15px 0 10px 0', color: '#2c3e50' }}>My Jobs:</h3>
                        {userData.jobs.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {userData.jobs.map((job, index) => (
                                    <li key={index} style={{ 
                                        padding: '8px', 
                                        marginBottom: '5px', 
                                        backgroundColor: '#ecf0f1',
                                        borderRadius: '4px'
                                    }}>
                                        {job}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#7f8c8d' }}>No jobs added yet</p>
                        )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button 
                            onClick={() => setIsEditing(true)}
                            style={{
                                padding: '10px 20px',
                                background: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPanel;