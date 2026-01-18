import React from 'react';


const CriteriaList = ({ criteria }) => {
  const safeCriteria = Array.isArray(criteria) ? criteria : [];
  return (
    <ul className="text-xs text-gray-600 space-y-1 mt-2">
      {safeCriteria.map(({ label, met }, i) => (
        <li key={i} className={met ? 'text-green-600' : 'text-gray-400'}>
          <span className="mr-1">{met ? '✔' : '✖'}</span>{label}
        </li>
      ))}
    </ul>
  );
};

export default CriteriaList;
