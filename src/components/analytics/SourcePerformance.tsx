'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Opportunity } from '@/types/opportunity';

interface SourcePerformanceProps {
  opportunities: Opportunity[];
}

/**
 * Source Performance Component
 * 
 * Analyzes and displays performance metrics by source (subreddit)
 */
export function SourcePerformance({ opportunities }: SourcePerformanceProps) {
  
  const sourceData = useMemo(() => {
    const sourceMap = new Map<string, {
      total: number;
      new: number;
      contacted: number;
      won: number;
      lost: number;
      avgScore: number;
      scores: number[];
    }>();

    opportunities.forEach(opp => {
      const source = opp.source || 'Unknown';
      
      if (!sourceMap.has(source)) {
        sourceMap.set(source, {
          total: 0,
          new: 0,
          contacted: 0,
          won: 0,
          lost: 0,
          avgScore: 0,
          scores: [],
        });
      }

      const data = sourceMap.get(source)!;
      data.total++;
      
      if (opp.status === 'new') data.new++;
      if (opp.status === 'contacted' || opp.status === 'applied') data.contacted++;
      if (opp.status === 'won') data.won++;
      if (opp.status === 'lost') data.lost++;
      
      if (opp.total_score !== null && opp.total_score !== undefined) {
        data.scores.push(opp.total_score);
      }
    });

    // Calculate averages and format data
    const chartData = Array.from(sourceMap.entries())
      .map(([source, data]) => {
        const avgScore = data.scores.length > 0
          ? data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length
          : 0;
        
        const conversionRate = data.total > 0
          ? (data.won / data.total) * 100
          : 0;

        const responseRate = data.total > 0
          ? ((data.contacted + data.won) / data.total) * 100
          : 0;

        return {
          source: source.replace('r/', ''),
          total: data.total,
          won: data.won,
          contacted: data.contacted,
          new: data.new,
          avgScore: parseFloat(avgScore.toFixed(1)),
          conversionRate: parseFloat(conversionRate.toFixed(1)),
          responseRate: parseFloat(responseRate.toFixed(1)),
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 sources

    return chartData;
  }, [opportunities]);

  if (sourceData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No source data available</p>
      </div>
    );
  }

  // Colors for bars
  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#06B6D4', '#EC4899', '#6366F1', '#14B8A6', '#F97316',
  ];

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">
          Opportunities by Source
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sourceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="source" 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="total" name="Total" fill="#3B82F6">
              {sourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">
          Source Performance Details
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Source</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Won</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Conversion</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Response</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {sourceData.map((source, index) => (
                <tr 
                  key={source.source}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="font-medium text-gray-900">
                        r/{source.source}
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900">
                    {source.total}
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="text-green-600 font-medium">
                      {source.won}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end space-x-1">
                      <span className={`font-medium ${
                        source.conversionRate > 10 
                          ? 'text-green-600' 
                          : source.conversionRate > 5
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                      }`}>
                        {source.conversionRate}%
                      </span>
                      {source.conversionRate > 10 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : source.conversionRate < 5 ? (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      ) : null}
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium ${
                      source.responseRate > 30 
                        ? 'text-green-600' 
                        : source.responseRate > 15
                        ? 'text-yellow-600'
                        : 'text-gray-600'
                    }`}>
                      {source.responseRate}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="text-gray-900 font-medium">
                      {source.avgScore.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Top Performing Source</p>
          <p className="text-xl font-bold text-gray-900">
            r/{sourceData[0]?.source}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            {sourceData[0]?.total} opportunities
          </p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm text-gray-600 mb-1">Best Conversion Rate</p>
          <p className="text-xl font-bold text-gray-900">
            {Math.max(...sourceData.map(s => s.conversionRate)).toFixed(1)}%
          </p>
          <p className="text-sm text-green-600 mt-1">
            r/{sourceData.find(s => 
              s.conversionRate === Math.max(...sourceData.map(d => d.conversionRate))
            )?.source}
          </p>
        </div>
        <div className="card bg-purple-50 border-purple-200">
          <p className="text-sm text-gray-600 mb-1">Highest Quality</p>
          <p className="text-xl font-bold text-gray-900">
            {Math.max(...sourceData.map(s => s.avgScore)).toFixed(1)}
          </p>
          <p className="text-sm text-purple-600 mt-1">
            r/{sourceData.find(s => 
              s.avgScore === Math.max(...sourceData.map(d => d.avgScore))
            )?.source}
          </p>
        </div>
      </div>
    </div>
  );
}
