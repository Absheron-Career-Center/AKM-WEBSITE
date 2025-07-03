import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [userSubmissions, setUserSubmissions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Strict admin check
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !['admin'].includes(userData.role)) {
            navigate('/');
            return;
        }

        const fetchUserSubmissions = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No token found');
                }

                console.log('Sending request with token:', token); // Debug log

                const response = await axios.get('http://localhost:8080/api/admin/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setUserSubmissions(response.data);
            } catch (error) {
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });

                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    navigate('/login');
                }
            }
        };
        fetchUserSubmissions();
    }, [navigate]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Panel</h1>
            <h2>User Submissions</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '20px'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Phone Number</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Address</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>E-mail</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Job Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userSubmissions.map((submission) => (
                            <tr key={submission._id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px' }}>{submission.name}</td>
                                <td style={{ padding: '12px' }}>{submission.phoneNumber}</td>
                                <td style={{ padding: '12px' }}>{submission.address}</td>
                                <td style={{ padding: '12px' }}>{submission.email}</td>
                                <td style={{ padding: '12px' }}>{submission.jobName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;