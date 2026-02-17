import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error('[JalSanchaee] ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '40px',
                    background: '#fee2e2',
                    color: '#991b1b',
                    minHeight: '100vh',
                    fontFamily: 'sans-serif'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Oops! Something went wrong.</h1>
                    <p style={{ marginBottom: '24px' }}>The application crashed. Here are some details:</p>
                    <pre style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        overflow: 'auto',
                        fontSize: '0.9rem',
                        border: '1px solid #fecaca'
                    }}>
                        {this.state.error?.toString()}
                        {'\n'}
                        {this.state.errorInfo?.componentStack}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '24px',
                            padding: '12px 24px',
                            background: '#991b1b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
