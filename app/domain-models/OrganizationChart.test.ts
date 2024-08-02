import { expect, test } from "vitest";
import { ApplicationError } from "./ApplicationError";
import { Employee } from "./Employee";
import { Id } from "./Id";
import { Name } from "./Name";
import data from "./fake-data/correct-employees.json";
import faultyData from "./fake-data/faulty-employees.json";
import anotherFaultyData from "./fake-data/another-faulty-employees.json";
import { OrganizationChart } from "./OrganizationChart";

test("Load from correct-employees.json, must build the structure correcly", ()=>{
  const orgStructure = new OrganizationChart();
  data.forEach(d => {
    const employee = new Employee(new Id(d.id + ""), new Name(d.name), d.managerId ? new Id(d.managerId + "") : null, []);
    orgStructure.Add(employee);
  });



  expect(()=> orgStructure.IsValid).not.throws();

})

test("Load from faulty-employees.json, must throws error", ()=>{
  const orgStructure = new OrganizationChart();
  faultyData.forEach(d => {
    const employee = new Employee(new Id(d.id + ""), new Name(d.name), d.managerId ? new Id(d.managerId + "") : null, []);
    orgStructure.Add(employee);
  });

  
  expect(()=> {
    
    orgStructure.IsValid
    
  }).throws();
  
})

test("Load from another-faulty-employees.json, must throws error", ()=>{
  const orgStructure = new OrganizationChart();
  
  expect(()=> {
    for(let i =  0; i < anotherFaultyData.length; i++){
      const d = anotherFaultyData[i];
      const employee = new Employee(new Id(d.id + ""), new Name(d.name), d.managerId ? new Id(d.managerId + "") : null, []);
      orgStructure.Add(employee);

    }
  }).throws();

  expect(()=> orgStructure.IsValid).not.throws();


})

