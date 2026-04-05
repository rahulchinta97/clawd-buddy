import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type = 'card', count = 1, className = '' }) => {
  const skeletons = [];
  
  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'card':
        skeletons.push(
          <div key={i} className={`skeleton skeleton-card ${className}`}>
            <div className="skeleton-header">
              <div className="skeleton-circle"></div>
              <div className="skeleton-text-group">
                <div className="skeleton-line skeleton-line-medium"></div>
                <div className="skeleton-line skeleton-line-small"></div>
              </div>
            </div>
            <div className="skeleton-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line skeleton-line-short"></div>
            </div>
          </div>
        );
        break;
        
      case 'agent':
        skeletons.push(
          <div key={i} className={`skeleton skeleton-agent ${className}`}>
            <div className="skeleton-agent-header">
              <div className="skeleton-circle skeleton-circle-medium"></div>
              <div className="skeleton-text-group">
                <div className="skeleton-line skeleton-line-medium"></div>
                <div className="skeleton-line skeleton-line-small"></div>
              </div>
            </div>
            <div className="skeleton-agent-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line skeleton-line-short"></div>
            </div>
            <div className="skeleton-agent-footer">
              <div className="skeleton-pill"></div>
              <div className="skeleton-pill"></div>
            </div>
          </div>
        );
        break;
        
      case 'meeting':
        skeletons.push(
          <div key={i} className={`skeleton skeleton-meeting ${className}`}>
            <div className="skeleton-meeting-header">
              <div className="skeleton-line skeleton-line-medium"></div>
              <div className="skeleton-line skeleton-line-small"></div>
            </div>
            <div className="skeleton-meeting-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line skeleton-line-short"></div>
            </div>
            <div className="skeleton-meeting-footer">
              <div className="skeleton-circle skeleton-circle-small"></div>
              <div className="skeleton-circle skeleton-circle-small"></div>
              <div className="skeleton-circle skeleton-circle-small"></div>
            </div>
          </div>
        );
        break;
        
      case 'chart':
        skeletons.push(
          <div key={i} className={`skeleton skeleton-chart ${className}`}>
            <div className="skeleton-chart-header">
              <div className="skeleton-line skeleton-line-medium"></div>
              <div className="skeleton-line skeleton-line-small"></div>
            </div>
            <div className="skeleton-chart-content">
              <div className="skeleton-bar skeleton-bar-1"></div>
              <div className="skeleton-bar skeleton-bar-2"></div>
              <div className="skeleton-bar skeleton-bar-3"></div>
              <div className="skeleton-bar skeleton-bar-4"></div>
              <div className="skeleton-bar skeleton-bar-5"></div>
            </div>
          </div>
        );
        break;
        
      case 'metric':
        skeletons.push(
          <div key={i} className={`skeleton skeleton-metric ${className}`}>
            <div className="skeleton-metric-icon"></div>
            <div className="skeleton-metric-content">
              <div className="skeleton-line skeleton-line-large"></div>
              <div className="skeleton-line skeleton-line-small"></div>
            </div>
          </div>
        );
        break;
        
      default:
        skeletons.push(
          <div key={i} className={`skeleton ${className}`}>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line skeleton-line-short"></div>
          </div>
        );
    }
  }
  
  return <>{skeletons}</>;
};

export default Skeleton;