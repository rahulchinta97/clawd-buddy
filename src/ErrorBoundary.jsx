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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary glass-card" style={{ padding: '20px', margin: '10px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.16)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--red)'
            }}>
              ⚠️
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text)' }}>Something went wrong</h3>
              <p style={{ margin: '4px 0 0', color: 'var(--secondary)' }}>
                This component encountered an error
              </p>
            </div>
          </div>
          
          {this.props.debug && this.state.error && (
            <details style={{ 
              marginTop: '12px', 
              padding: '12px', 
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <summary style={{ cursor: 'pointer', color: 'var(--secondary)' }}>
                Error details
              </summary>
              <pre style={{ 
                marginTop: '8px', 
                fontSize: '0.8rem',
                color: 'var(--secondary)',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          
          <button
            onClick={this.handleRetry}
            className="button button-primary"
            style={{ marginTop: '16px' }}
            aria-label="Retry loading component"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;