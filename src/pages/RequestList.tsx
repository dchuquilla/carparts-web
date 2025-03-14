import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RequestList: React.FC = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/requests')
      .then(response => {
        setRequests(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the requests!', error);
      });
  }, []);

  return (
    <div>
      <h1>Lista de Solicitudes de Repuestos</h1>
      <ul>
        {requests.map((request: any) => (
          <li key={request.id}>{request.part_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RequestList;
