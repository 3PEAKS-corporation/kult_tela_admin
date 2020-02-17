export const state = () => ({
  categories: [
    {
      id: 0,
      icon: 'mdi-apps',
      title: 'Главная',
      to: '/'
    },
    {
      id: 0,
      icon: 'mdi-forum',
      title: 'Сообщения',
      to: '/messages'
    },
    {
      id: 0,
      icon: 'mdi-format-float-left',
      title: 'Заявки',
      to: '/requests',
      roles: [0]
    },

  ]
})

export const mutations = {}

export const actions = {}

export const getters = {
  GET_CATEGORIES: state => state.categories
  
}
