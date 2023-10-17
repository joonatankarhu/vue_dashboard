export const state = () => ({
  data: 'Test data from VueX store'
})

export const getters = {
  getData(state) {
    return state.data
  }
}


export const actions = {
  async fetchData({ state }) {
    // make request
    const res = { data: 10 };
    state.data = res.data;
    return res.data;
  }
}