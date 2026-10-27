import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { AIRecommendation } from '../types';
import { AlertOctagon, ArrowDownRight, Compass, Shield, Users, Radio, CloudRain, HeartPulse, Filter } from 'lucide-react';

export interface RecommendationCardProps {
  recommendations: AIRecommendation[];
  className?: string;
  onExecuteRecommendation?: (rec: AIRecommendation) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendations,
  className,
  onExecuteRecommendation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'EVACUATION', 'RESOURCES', 'SUPPLY_CHAIN', 'INFRASTRUCTURE', 'MEDICAL', 'COMMUNICATION'];

  const filteredRecommendations =
    selectedCategory === 'ALL'
      ? recommendations
      : recommendations.filter((r) => r.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'EVACUATION':
        return <Users className="h-3.5 w-3.5 text-rose-400" />;
      case 'INFRASTRUCTURE':
        return <Compass className="h-3.5 w-3.5 text-amber-400" />;
      case 'COMMUNICATION':
        return <Radio className="h-3.5 w-3.5 text-sky-400" />;
      case 'WEATHER':
        return <CloudRain className="h-3.5 w-3.5 text-cyan-400" />;
      case 'MEDICAL':
        return <HeartPulse className="h-3.5 w-3.5 text-emerald-400" />;
      case 'RESOURCES':
      case 'SUPPLY_CHAIN':
      default:
        return <Shield className="h-3.5 w-3.5 text-purple-400" />;
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'IMMEDIATE':
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH_PRIORITY':
      case 'HIGH':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-red-500/10 border border-red-500/30 text-red-400">
            <AlertOctagon className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold tracking-wide">Prioritized Action Recommendations</CardTitle>
            <p className="text-[11px] font-mono text-slate-400">Ranked by Salience Weight & Casualty Reduction Index</p>
          </div>
        </div>
        <Badge variant="outline" className="font-mono text-[10px]">
          {filteredRecommendations.length} / {recommendations.length} Actions
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          <Filter className="h-3.5 w-3.5 text-slate-400 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xs px-2 py-0.5 font-mono text-[10px] uppercase transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Recommendations List */}
        {filteredRecommendations.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-500 font-mono">No directives matching category filter.</p>
        ) : (
          filteredRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="rounded-xs border border-slate-800 bg-[#0B0F17]/90 p-3 transition-colors hover:border-slate-700 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-xs bg-slate-800/80">
                    {getCategoryIcon(rec.category)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-100">{rec.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      Origin: {rec.sourceAgent || 'DecisionEngine'} | Category: {rec.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant={getPriorityBadgeVariant(rec.priority)} className="text-[9px]">
                    {rec.priority.replace('_', ' ')}
                  </Badge>
                  {rec.impactScoreReduction && (
                    <div className="flex items-center gap-0.5 rounded-xs border border-emerald-500/30 bg-emerald-950/30 px-1.5 py-0.5 text-[9px] font-mono text-emerald-400">
                      <ArrowDownRight className="h-3 w-3" />
                      <span>-{rec.impactScoreReduction}% RISK</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-8">{rec.action}</p>

              {rec.reasoning && (
                <div className="ml-8 rounded-xs border-l-2 border-blue-500/60 bg-slate-900/40 px-2.5 py-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Justification:</span> {rec.reasoning}
                </div>
              )}

              {onExecuteRecommendation && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onExecuteRecommendation(rec)}
                    className="inline-flex items-center gap-1.5 rounded-xs border border-blue-600/40 bg-blue-600/20 px-2.5 py-1 text-[10px] font-mono uppercase text-blue-300 hover:bg-blue-600/30 transition-colors"
                  >
                    Authorize Directive
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
