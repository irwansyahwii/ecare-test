import { expect, test } from "vitest";
import { OrganizationChart } from "../OrganizationChart";
import data from "../fake-data/correct-employees.json";
import { Employee } from "../Employee";
import { Id } from "../Id";
import { Name } from "../Name";
import { ReactFlowVisitor } from "./ReactFlowVisitor";

test("Output the correct nodes, edges, direct report and indirect reports counts", ()=> {
  const orgStructure = new OrganizationChart();
  data.forEach((d:any) => {
    const employee = new Employee(new Id(d.id + ""), new Name(d.name), d.managerId ? new Id(d.managerId + "") : null, []);
    orgStructure.Add(employee);
  });

  orgStructure.IsValid;

  const visitor = new ReactFlowVisitor();
  orgStructure.Accept(visitor);

  const expectedNodes = [
  {
    id: '1',
    data: { label: 'raelynn (3/7)' },
    position: { x: 0, y: 0 }
  },
  { id: '2', data: { label: 'darin (3/0)' }, position: { x: 0, y: 0 } },
  {
    id: '4',
    data: { label: 'jordana (0/0)' },
    position: { x: 0, y: 0 }
  },
  {
    id: '5',
    data: { label: 'everett (0/0)' },
    position: { x: 0, y: 0 }
  },
  {
    id: '6',
    data: { label: 'bertha (0/0)' },
    position: { x: 0, y: 0 }
  },
  { id: '3', data: { label: 'kacie (3/1)' }, position: { x: 0, y: 0 } },
  { id: '7', data: { label: 'peg (0/0)' }, position: { x: 0, y: 0 } },
  { id: '8', data: { label: 'hugh (0/0)' }, position: { x: 0, y: 0 } },
  {
    id: '9',
    data: { label: 'eveleen (1/0)' },
    position: { x: 0, y: 0 }
  },
  {
    id: '10',
    data: { label: 'evelina (0/0)' },
    position: { x: 0, y: 0 }
  },
  {
    id: '41',
    data: { label: 'jordana (0/0)' },
    position: { x: 0, y: 0 }
  }
]

const expectedEdges = [
  {
    id: 'e2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    animated: true
  },
  {
    id: 'e4',
    source: '2',
    target: '4',
    type: 'smoothstep',
    animated: true
  },
  {
    id: 'e5',
    source: '2',
    target: '5',
    type: 'smoothstep',
    animated: true
  },
  {
    id: 'e6',
    source: '2',
    target: '6',
    type: 'smoothstep',
    animated: true
  },
  {
    id: 'e3',
    source: '1',
    target: '3',
    type: 'smoothstep',
    animated: true
  },
  {
    id: 'e7',
    source: '3',
    target: '7',
    type: 'smoothstep',
    animated: true
  },
  {
    id: 'e8',
    source: '3',
    target: '8',
    type: 'smoothstep',
    animated: true
  },
  {
    id: 'e9',
    source: '3',
    target: '9',
    type: 'smoothstep',
    animated: true
  },
  {
    id: 'e10',
    source: '9',
    target: '10',
    type: 'smoothstep',
    animated: true
  },
  {
    id: 'e41',
    source: '1',
    target: '41',
    type: 'smoothstep',
    animated: true
  }
]

  
  expect(visitor.initialNodes).toEqual(expectedNodes)
  expect(visitor.initialEdges).toEqual(expectedEdges)

})