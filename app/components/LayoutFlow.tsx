'use client';
import React, { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import dagre from 'dagre';
import data from "../domain-models/fake-data/correct-employees.json";

// import { initialNodes, initialEdges } from './nodes-edges';

import '@xyflow/react/dist/style.css';
import { OrganizationChart } from '../domain-models/OrganizationChart';
import { Employee } from '../domain-models/Employee';
import { Id } from '../domain-models/Id';
import { Name } from '../domain-models/Name';
import { DFSVisitor } from '../domain-models/OrganizationChartVisitors/DFSVisitor';
import { initialNodes, initialEdges } from './nodes-edges';
import { ReactFlowVisitor } from '../domain-models/OrganizationChartVisitors/ReactFlowVisitor';


const orgStructure = new OrganizationChart();
data.forEach(d => {
  const employee = new Employee(new Id(d.id + ""), new Name(d.name), d.managerId ? new Id(d.managerId + "") : null, []);
  orgStructure.Add(employee);
});

orgStructure.IsValid;

const visitor = new ReactFlowVisitor();
visitor.filterName = "evelina";
orgStructure.Accept(visitor);

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: any, edges: any, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node:any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge:any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node:any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

console.log(visitor.initialNodes)
console.log(visitor.initialEdges)

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  visitor.initialNodes,
  visitor.initialEdges,
);

const LayoutFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params:any) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds,
        ),
      ),
    [],
  );
  const onLayout = useCallback(
    (direction:any) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
    >
      <Panel position="top-right">
        <button onClick={() => onLayout('TB')}>vertical layout</button>
        <button onClick={() => onLayout('LR')}>horizontal layout</button>
      </Panel>
    </ReactFlow>
  );
};

export default LayoutFlow;
