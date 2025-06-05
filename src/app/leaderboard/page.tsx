'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getLeaderboardData, type LeaderboardUser } from './actions'; // Import the server action and type

const LeaderboardPage = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof LeaderboardUser | 'rank'; direction: 'ascending' | 'descending' }>(
    { key: 'totalBalance', direction: 'descending' }
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getLeaderboardData();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
        // Optionally, set an error state here to display to the user
        setUsers([]); // Clear users or set to an error state representation
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key !== 'rank') { // Rank is based on the sorted position, not a sortable key itself
      sortableUsers.sort((a, b) => {
        // Ensure a[sortConfig.key] and b[sortConfig.key] are not null/undefined before comparison
        // For string keys like 'name', ensure they are treated as strings for comparison.
        // For numeric keys like 'totalBalance' or 'dailyBonus', ensure they are numbers.
        const valA = a[sortConfig.key as keyof LeaderboardUser];
        const valB = b[sortConfig.key as keyof LeaderboardUser];

        let comparison = 0;
        if (valA === null || valA === undefined) comparison = 1; // nulls/undefined go to the end
        else if (valB === null || valB === undefined) comparison = -1;
        else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        }
        
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    // If sorting by totalBalance (desc), and then by dailyBonus (desc) as a tie-breaker for the initial state or when totalBalance is the key
    if (sortConfig.key === 'totalBalance' && sortConfig.direction === 'descending') {
        sortableUsers.sort((a, b) => {
            if (b.totalBalance !== a.totalBalance) {
                return b.totalBalance - a.totalBalance;
            }
            return b.dailyBonus - a.dailyBonus; // Secondary sort by dailyBonus descending
        });
    }
     // If sorting by dailyBonus (desc), and then by totalBalance (desc) as a tie-breaker
    else if (sortConfig.key === 'dailyBonus' && sortConfig.direction === 'descending') {
        sortableUsers.sort((a, b) => {
            if (b.dailyBonus !== a.dailyBonus) {
                return b.dailyBonus - a.dailyBonus;
            }
            return b.totalBalance - a.totalBalance; // Secondary sort by totalBalance descending
        });
    }

    return sortableUsers;
  }, [users, sortConfig]);

  const requestSort = (key: keyof LeaderboardUser | 'rank') => {
    if (key === 'rank') return; // Cannot sort by rank directly as it's derived
    let direction: 'ascending' | 'descending' = 'descending'; // Default to descending for new columns
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof LeaderboardUser | 'rank') => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'descending' ? ' ▼' : ' ▲';
    }
    return ''; // No indicator if not the sort column
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4 text-center">Loading leaderboard...</div>;
  }

  if (!users.length) {
    return <div className="container mx-auto py-8 px-4 text-center">No users found for the leaderboard.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Leaderboard</h1>
      
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                onClick={() => requestSort('rank')} // Rank column is not directly sortable by click
              >
                Rank {getSortIndicator('rank')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                onClick={() => requestSort('name')}
              >
                User {getSortIndicator('name')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                onClick={() => requestSort('totalBalance')}
              >
                Total Balance {getSortIndicator('totalBalance')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                onClick={() => requestSort('dailyBonus')}
              >
                Daily Bonus {getSortIndicator('dailyBonus')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {sortedUsers.map((user, index) => (
              <tr key={user.id} className={index < 3 ? 'bg-yellow-100 dark:bg-yellow-900' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {index + 1}
                  {/* Crowns for top 3 based on the current primary sort key and direction */}
                  {/* This logic assumes primary sort determines "top" */}
                  { (sortConfig.key === 'totalBalance' || sortConfig.key === 'dailyBonus') && index < 3 && ' 👑'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.name || 'N/A'} {/* Display N/A if name is null */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ${user.totalBalance.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ${user.dailyBonus.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-lg mt-12 text-gray-600 dark:text-gray-400">
        🏆 Coming soon: Rewards for the leaders! 🏆
      </p>
    </div>
  );
};

export default LeaderboardPage; 