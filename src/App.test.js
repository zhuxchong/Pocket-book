import React from 'react'
import mockAxios from './__mocks__/axios'
import { testCategories, testItems } from './testData'
import { mount } from 'enzyme'

import App from './App'

// https://github.com/facebook/jest/issues/2157#issuecomment-279171856
const waitForAsync = () => new Promise(resolve => setImmediate(resolve))
describe('test component init behavior', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('check App Home state with inital action', async () => {
    const wrapper = mount(<App/>)
    expect(mockAxios.get).toHaveBeenCalledTimes(2)
    await waitForAsync()
    const currentState = wrapper.instance().state
    expect(Object.keys(currentState.items).length).toEqual(testItems.length)
    expect(Object.keys(currentState.categories).length).toEqual(testCategories.length)
  })
  it('test getEditData with inital data in create mode', async () => {
    const wrapper = mount(<App/>)
    await waitForAsync()
    await wrapper.instance().actions.getEditData()
    expect(mockAxios.get).toHaveBeenCalledTimes(2)
  })
  it('test getEditData without inital data in create mode', async () => {
    const wrapper = mount(<App/>)
    await waitForAsync()
    wrapper.setState({
      categories: {},
      items: {},
    })
    await wrapper.instance().actions.getEditData()
    expect(mockAxios.get).toHaveBeenCalledTimes(3)
    expect(mockAxios.get).toHaveBeenLastCalledWith('/categories')
  })
  it('test getEditData with inital data in edit mode', async () => {
    const wrapper = mount(<App/>)
    await waitForAsync() 
    await wrapper.instance().actions.getEditData('_kly1klf4g')
    expect(mockAxios.get).toHaveBeenCalledTimes(2)
  })
  it('test getEditData with inital data in edit mode with new data', async () => {
    const wrapper = mount(<App/>)
    await waitForAsync() 
    await wrapper.instance().actions.getEditData('new_temp_id')
    expect(mockAxios.get).toHaveBeenCalledTimes(3)
    const currentState = wrapper.instance().state
    expect(currentState.items).toHaveProperty('new_temp_id')
    expect(Object.keys(currentState.items).length).toEqual(testItems.length + 1)
  })
  it('test createItem with inital data', async() => {
    const wrapper = mount(<App/>)
    await waitForAsync()
    await wrapper.instance().actions.createItem({}, 2)
    expect(mockAxios.post).toHaveBeenCalledTimes(1)
    const currentState = wrapper.instance().state
    expect(Object.keys(currentState.items).length).toEqual(testItems.length + 1)
  })
  it('test updateItem with inital data', async() => {
    const wrapper = mount(<App/>)
    await waitForAsync()
    const singleItem = testItems.find((item) => item.id === '_kly1klf4g')
    const modifiedItem = { ...singleItem, title: 'updated title' }
    await wrapper.instance().actions.updateItem(modifiedItem, 2)
    expect(mockAxios.put).toHaveBeenCalledTimes(1)
    const currentState = wrapper.instance().state
    const newItem = currentState.items['_kly1klf4g']
    expect(newItem.title).toEqual('updated title')
  })
  it('test deleteItem with inital data', async() => {
    const wrapper = mount(<App/>)
    await waitForAsync()
    await wrapper.instance().actions.deleteItem({ id: '_kly1klf4g'})
    expect(mockAxios.delete).toHaveBeenCalledTimes(1)
    const currentState = wrapper.instance().state
    expect(Object.keys(currentState.items).length).toEqual(testItems.length - 1)
    const deletedItem = currentState.items['_kly1klf4g']
    expect(deletedItem).toBeUndefined()
  })
})