import { expect, test } from 'vitest'
import { Id } from './Id'
import { ApplicationError } from './ApplicationError'


test('Value is required', ()=> {
  expect(()=> new Id(undefined as any)).toThrow(new ApplicationError("Id's value is required"));
  expect(()=> new Id("")).toThrow(new ApplicationError("Id's value is required"));
})