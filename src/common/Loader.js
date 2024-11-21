import React from 'react';
import SyncLoader from 'react-spinners/SyncLoader';

function LoaderDesign() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <SyncLoader color="green" />
    </div>
  );
}

export default LoaderDesign;
