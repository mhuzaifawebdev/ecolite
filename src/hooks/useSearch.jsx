import { useState, useEffect } from 'react';

export function useSearch(data, query) {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(lowercasedQuery) ||
        item.email.toLowerCase().includes(lowercasedQuery) ||
        item.role.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, query]);

  return filteredData;
}
