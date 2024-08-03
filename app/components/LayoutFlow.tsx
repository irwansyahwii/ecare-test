'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import dagre from 'dagre';
import { observer } from "mobx-react-lite";

import '@xyflow/react/dist/style.css';
import { OrganizationChartStore} from '../store/OrganizationChartStore';
import { action } from 'mobx';
import { useStores } from '../store/useStore';
import { Autocomplete, Button, Input, TextField } from '@mui/material';


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


export const LayoutFlow = ({orgChartStore}: {orgChartStore: OrganizationChartStore}) => {

  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  const [filterValue, setFilterValue] = useState("");

  useEffect(()=> {
    
    orgChartStore.ApplyFilter(filterValue);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      orgChartStore.visitor.initialNodes,
      orgChartStore.visitor.initialEdges,
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    
  }, [orgChartStore, setEdges, setNodes, filterValue]);
  
  const onConnect = useCallback(
    (params:any) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds,
        ),
      ),
    [setEdges],
  );
  const onLayout = useCallback(
    (direction:any) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setEdges, setNodes],
  );

  const applyFilter = (e:any, selected:any)=> {
    console.log(selected);
    if(selected){
      setFilterValue(selected.label);          
    }else{
      setFilterValue("");
    }
  }

  const [filterOptions, setFilterOptions] = useState<{id:string, label:string}[]>([]);

  useEffect(()=> {
    setFilterOptions(orgChartStore.orgStructure.FlatStructure.map(x => {
      return ({id: x.Id.Value, label: x.Name.toString()});
    }));
  }, [orgChartStore.orgStructure.FlatStructure]);

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
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          onChange={applyFilter}          
          options={filterOptions}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Filter By Employee Name..." />}
        />
        {/* <Button variant='outlined' onClick={applyFilter}>Apply Filter</Button> */}
        <Button variant='outlined' onClick={() => onLayout('TB')}>vertical layout</Button>
        <Button variant='outlined' onClick={() => onLayout('LR')}>horizontal layout</Button>
      </Panel>
    </ReactFlow>
  );
};

export const LayoutFlowClientSide = ()=>{
  const {orgChartStore} = useStores();
  return (
    <LayoutFlow orgChartStore={orgChartStore}></LayoutFlow>
  )
};
