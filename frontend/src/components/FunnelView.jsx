import { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';

const STEPS = ['welcome', 'use_case', 'first_task', 'conversion'];
const STEP_LABELS = ['Welcome', 'Use Case', 'First Task', 'Conversion'];
const BAR_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'];

export default function FunnelView({ events }) {
  const svgRef = useRef();

  const funnelData = useMemo(() => {
    const reached = {};
    const converted = {};
    STEPS.forEach((_, i) => {
      reached[i + 1] = 0;
      converted[i + 1] = 0;
    });

    const userSteps = {};
    for (const e of events) {
      if (!userSteps[e.user_number]) userSteps[e.user_number] = [];
      userSteps[e.user_number].push(e);
    }

    for (const evts of Object.values(userSteps)) {
      for (const e of evts) {
        reached[e.step] = (reached[e.step] || 0) + 1;
        if (e.converted) converted[e.step] = (converted[e.step] || 0) + 1;
      }
    }

    return STEPS.map((name, i) => ({
      step: i + 1,
      name,
      label: STEP_LABELS[i],
      reached: reached[i + 1] || 0,
      converted: converted[i + 1] || 0,
    }));
  }, [events]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 250;
    const height = 160;
    const margin = { top: 18, right: 8, bottom: 20, left: 8 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const maxReached = Math.max(1, d3.max(funnelData, (d) => d.reached));
    const barWidth = innerW / funnelData.length;

    funnelData.forEach((d, i) => {
      const barH = (d.reached / maxReached) * innerH;
      const x = i * barWidth + barWidth * 0.12;
      const w = barWidth * 0.76;

      // Bar background
      g.append('rect')
        .attr('x', x).attr('y', innerH - barH)
        .attr('width', w).attr('height', barH)
        .attr('fill', BAR_COLORS[i]).attr('rx', 3).attr('opacity', 0.85);

      // Count on top
      g.append('text')
        .attr('x', x + w / 2).attr('y', innerH - barH - 4)
        .attr('text-anchor', 'middle')
        .attr('fill', '#e2e8f0').attr('font-size', 11).attr('font-weight', 700)
        .text(d.reached || '');

      // Conversion rate inside bar
      if (d.reached > 0) {
        const rate = ((d.converted / d.reached) * 100).toFixed(0);
        g.append('text')
          .attr('x', x + w / 2).attr('y', innerH - 4)
          .attr('text-anchor', 'middle')
          .attr('fill', 'rgba(255,255,255,0.7)').attr('font-size', 9)
          .text(`${rate}%`);
      }

      // Label below
      g.append('text')
        .attr('x', x + w / 2).attr('y', innerH + 13)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b').attr('font-size', 8)
        .text(d.label);

      // Flow connector
      if (i < funnelData.length - 1) {
        const nextD = funnelData[i + 1];
        const nextBarH = (nextD.reached / maxReached) * innerH;
        const nextX = (i + 1) * barWidth + barWidth * 0.12;

        const path = d3.path();
        path.moveTo(x + w, innerH - barH * 0.5);
        path.bezierCurveTo(
          x + w + barWidth * 0.12, innerH - barH * 0.5,
          nextX - barWidth * 0.12, innerH - nextBarH * 0.5,
          nextX, innerH - nextBarH * 0.5
        );
        g.append('path')
          .attr('d', path.toString())
          .attr('fill', 'none')
          .attr('stroke', BAR_COLORS[i])
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.3);
      }
    });
  }, [funnelData]);

  return <svg ref={svgRef} className="w-full" style={{ height: 160 }} />;
}
