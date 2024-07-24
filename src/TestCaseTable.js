import React, { useState, useEffect } from 'react';
import './styles.css';

const TestCase = ({ id, name, estimateTime, module, priority, status, onStatusChange }) => (
  <tr>
    <td>{name}</td>
    <td>{estimateTime}</td>
    <td>{module}</td>
    <td>{priority}</td>
    <td>
      <select 
        value={status || 'select'} 
        onChange={(e) => onStatusChange(id, e.target.value)}
      >
        <option value="select">Select</option>
        <option value="pass">PASS</option>
        <option value="fail">FAIL</option>
      </select>
    </td>
  </tr>
);

const TestCaseTable = () => {

  const [testCases, setTestCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTestCases();
  }, []);

  const fetchTestCases = async () => {
    const response = await fetch('http://localhost:3001/api/testcases');
    const data = await response.json();
    setTestCases(data);
  };

  const handleSearch = async () => {
    const response = await fetch(`http://localhost:3001/api/testcases/search?query=${searchQuery}`);
    const data = await response.json();
    setTestCases(data);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/api/testcases/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTestCases(testCases.map(testCase => 
          testCase.id === id ? { ...testCase, status: newStatus } : testCase
        ));
      } else {
        console.error('Failed to update test case status');
      }
    } catch (error) {
      console.error('Error updating test case status:', error);
    }
  };

  return (
    <div className="test-case-container">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search issue..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>🔍</button>
      </div>
      <div className="filter-button">
        <button>Filter ▼</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Test Case Name</th>
            <th>Estimate Time</th>
            <th>Module</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((testCase) => (
            <TestCase 
              key={testCase.id} 
              {...testCase} 
              onStatusChange={handleStatusChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestCaseTable;