import React from 'react';

const Panel = ({ children, className = '' }) => (
  <section
    className={`bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col gap-6 border border-gray-200 dark:border-gray-800 ${className}`}
    style={{ backgroundColor: 'white' }}
  >
    {children}
  </section>
);

export default Panel;
