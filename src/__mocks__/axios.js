import { testCategories, testItems } from '../testData'
export default {
  get: jest.fn((url) => { 
    if (url.indexOf('categories') > -1) {
      return Promise.resolve({ data: testCategories })
    } else if (url.indexOf('items?') > -1) {
      return Promise.resolve({ data: testItems })
    } else if (url.indexOf('items/') > -1) {
      return Promise.resolve({ data: { ...testItems[0], id: 'testID'}})
    }
  }),
  post: jest.fn((url) => {
    return Promise.resolve({ data: {...testItems[0], id: 'new_created_id'}})
  }),
  put: jest.fn((url, obj) => {
    const modifiedItem = testItems.find((item) => item.id === obj.id)
    return Promise.resolve({ data: { ...modifiedItem, ...obj }})
  }),
  delete: jest.fn((url) => {
    const id = url.match(/\w+/g)[1]
    const filteredItem = testItems.find((item) => item.id === id)
    return Promise.resolve({ data: filteredItem })
  })
};