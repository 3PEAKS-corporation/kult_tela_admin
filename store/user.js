export const state = () => ({
  user: null
});

export const mutations = {
  SET_USER(state, payload) {
    state.user = payload;
  }
};

export const actions = {
  SET_USER({ commit }, payload) {
    commit("SET_USER", payload);
  }
};

export const getters = {
  GET_USER(state) {
    return state.user;
  }
};
