import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4567'];

function Categories() {
  const { token } = useContext(AuthContext);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get('/api/analytics/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Transform for chart
        const chartData = Object.keys(res.data).map((key) => ({
          name: key,
          value: res.data[key].total
        }));

        setCategoryData(chartData);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }

    fetchCategories();
  }, [token]);

  if (!categoryData.length) return <p>Loading categories...</p>;

  return (
    <div>
      <h1>Spending by Category</h1>
      <PieChart width={400} height={400}>
        <Pie
          data={categoryData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default Categories;
