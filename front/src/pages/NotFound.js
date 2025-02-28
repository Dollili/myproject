import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'gray.100',
                padding: '20px',
                textAlign: 'center',
            }}
        >
            <h1
                style={{ fontSize: '2.5rem', color: 'red.600', marginBottom: '20px' }}
            >
                페이지를 찾을 수 없습니다.
            </h1>
            <h2
                style={{ fontSize: '1.5rem', color: 'gray.600', marginBottom: '20px' }}
            >
                Page not found.
            </h2>
            <Link to={'/'}>
                <button
                    style={{
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                    }}
                >
                    Go home
                </button>
            </Link>
        </div>
    );
};

export default NotFound;
