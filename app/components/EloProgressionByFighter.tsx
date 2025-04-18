'use client'

import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { getEloProgressionByFighter } from '../services/apiService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps
} from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { FighterProgression, EloRecord, FighterDropdown, FighterEloPaginationResponse } from '../services/types';

const RESULTS_PER_PAGE = 5;

const EloProgressionByFighter: React.FC = () => {
  const [fighterName, setFighterName] = useState<string>('');
  const [fightersData, setFightersData] = useState<FighterProgression[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFighter, setSelectedFighter] = useState<string>('all');
  const [uniqueFighters, setUniqueFighters] = useState<FighterDropdown[]>([]);
  const [originalData, setOriginalData] = useState<FighterProgression[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [openTables, setOpenTables] = useState<{ [key: number]: boolean }>({});

  const toggleTable = (fighterId: number) => {
    setOpenTables((prev) => ({
      ...prev,
      [fighterId]: !prev[fighterId],
    }));
  };

  const handleSearch = async (page: number = 1) => {
    const skip = (page - 1) * RESULTS_PER_PAGE;

    if (!fighterName.trim()) {
      setError('Please enter a fighter name');
      return;
    }

    setError('');
    setFightersData([]);
    setLoading(true);

    try {
      const response: FighterEloPaginationResponse = await getEloProgressionByFighter(fighterName, {
        skip,
        limit: RESULTS_PER_PAGE,
        sort: 'asc',
      });

      setFightersData(response.data);
      setOriginalData(response.data);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.pages);


      const fighters = response.data.map((fighter) => ({
        id: fighter.fighter_id,
        name: fighter.fighter_name
      }));
      setUniqueFighters(fighters);
      setSelectedFighter('all');
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`No records found for "${fighterName}"`);
      } else {
        setError('Error fetching fighter Elo records');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(1);
    }
  };

  const handleFighterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedFighterId = e.target.value;
    setSelectedFighter(selectedFighterId);
    if (selectedFighterId === 'all') {
      setFightersData(originalData);
    } else {
      const filteredData = originalData.filter(
        (f) => f.fighter_id === parseInt(selectedFighterId)
      );
      setFightersData(filteredData);
    }
  };

  const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as EloRecord & { elo: number; fighter_name: string };
      return (
        <div className="ccustom-tooltip bg-neutral-800 text-white p-3 border border-gray-600 rounded shadow-lg">
          <p className="font-semibold">{data.fighter_name}</p>
          <p>Fight: {data.fight_number + 1}</p>
          <p>Elo Rating: {data.elo.toFixed(1)}</p>
          {data.event_name && <p>Event: {data.event_name}</p>}
          {data.event_date && <p>Date: {new Date(data.event_date).toLocaleDateString()}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="elo-records p-4">
      <div className="fighter-search-container">
        <h2 className="text-2xl font-bold mb-4">Fighter Elo Rating Progression</h2>
        <div className="search-controls">
          <input
            type="text"
            value={fighterName}
            onChange={(e) => setFighterName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter fighter name"
            className="px-3 py-2 border rounded"
          />
          {fightersData.length > 0 && (
            <select
              className="ml-2 px-3 py-2 bg-zinc-900 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-stone-500"
              value={selectedFighter}
              onChange={handleFighterChange}
            >
              <option value="all">All Fighters</option>
              {uniqueFighters.map((fighter) => (
                <option key={fighter.id} value={fighter.id}>
                  {fighter.name}
                </option>
              ))}
            </select>
          )}
          <button
            className="hover:text-sky-200 dark:hover:text-sky-200 ml-2 px-4 py-2 bg-slate-800 border border-lg text-stone rounded"
            onClick={() => handleSearch(1)}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {fightersData.map((fighter) => (
        <div key={fighter.fighter_id} className="mb-8">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{fighter.fighter_name}</h3>
            <p className="text-gray-600">Total Fights: {fighter.total_fights}</p>
          </div>

          <div className="p-4 rounded-lg shadow bg-neutral-200 dark:bg-neutral-900">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={[
                  {
                    elo: 1000,
                    fight_number: 0,
                    fighter_name: fighter.fighter_name,
                    event_name: 'Initial Rating',
                    event_date: null,
                    elo_record_id: -1
                  },
                  ...fighter.elo_progression.map((record) => ({
                    ...record,
                    elo: parseFloat(record.elo_rating),
                    fight_number: record.fight_number
                  }))
                ]}
                margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid stroke="#4B5563" strokeDasharray="3 3" />
                <XAxis
                  dataKey="fight_number"
                  tick={{ fill: '#E5E7EB' }}
                  label={{ value: 'Fight Number', position: 'insideBottom', offset: -5, fill: '#E5E7EB' }}
                  stroke="#E5E7EB"
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fill: '#E5E7EB' }}
                  label={{ value: 'Elo Rating', angle: -90, position: 'insideLeft', fill: '#E5E7EB' }}
                  stroke="#E5E7EB"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#E5E7EB' }} />
                <Line
                  type="monotone"
                  dataKey="elo"
                  name="Elo Rating"
                  stroke="#1D4ED8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <button
            onClick={() => toggleTable(fighter.fighter_id)}
            className="mt-4 text-sm text-stone-300 hover:text-emerald-100 underline"
          >
            {openTables[fighter.fighter_id] ? 'Hide Elo Progression Table' : 'Show Elo Progression Table'}
          </button>

          {openTables[fighter.fighter_id] && (
            <div className="mt-4 overflow-x-auto max-h-[300px] overflow-y-auto border border-slate-700 rounded-lg">
              <table className="min-w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-2 py-1">Fight #</th>
                    <th className="px-2 py-1">Elo Rating</th>
                    <th className="px-2 py-1">Event</th>
                    <th className="px-2 py-1">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {fighter.elo_progression.map((record) => (
                    <tr key={record.elo_record_id} className="border-b">
                      <td
                        className="px-2 py-1 text-center bg-zinc-900"
                      >
                        {record.fight_number}
                      </td>
                      <td className="px-2 py-1 text-center bg-zinc-900">
                        {parseFloat(record.elo_rating).toFixed(1)}
                      </td>
                      <td className="px-2 py-1 bg-zinc-900">{record.event_name || '-'}</td>
                      <td className="px-2 py-1 bg-zinc-900">
                        {record.event_date
                          ? new Date(record.event_date).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            onClick={() => handleSearch(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handleSearch(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EloProgressionByFighter;
