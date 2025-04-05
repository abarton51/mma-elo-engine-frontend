'use client'

import React, { useState } from 'react';
import { getFightersByName } from '../services/apiService';
import { FighterRecord } from '../services/types';

const Fighter: React.FC = () => {
  const [fighterName, setFighterName] = useState<string>('');
  const [fighterRecords, setFighter] = useState<FighterRecord[]>([]);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const handleSearch = async (page: number = 1) => {
    setError('');
    setFighter([]);
    setCurrentPage(page);

    try {
      const skip = (page - 1) * 10;
      const limit = 10;

      const records = await getFightersByName(fighterName, {
        skip,
        limit,
        sort: 'elo_rating',
        order: 'desc',
      });

      setFighter(records.data);
      setTotalCount(records.total_count);
      setTotalPages(records.pagination.pages);
    } catch (err) {
      setError('No fighters returned.');
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handleSearch(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handleSearch(currentPage - 1);
    }
  };

  return (
    <div className="fighter-stats p-4">
      <div className="fighter-search-container">
        <h2 className="text-2xl font-bold mb-4">Search Fighter</h2>
        <input
          type="text"
          value={fighterName}
          onChange={(e) => setFighterName(e.target.value)}
          placeholder="Enter fighter name"
          className="px-3 py-2 border rounded"
        />
        <button className="ml-2 px-4 py-2 bg-slate-800 border border-lg text-emerald rounded" onClick={() => handleSearch(1)}>
          Search
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {fighterRecords.length > 0 && (
          <>
            <ul className="mt-4 space-y-2">
              {fighterRecords.map((record) => (
                <li key={record.fighter_id}>
                  <strong>{record.fighter_name}</strong>: Elo Rating –{' '}
                  {parseFloat(record.elo_rating).toFixed(1)}
                </li>
              ))}
            </ul>

            <div className="pagination mt-6 flex items-center gap-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage <= 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Fighter;
