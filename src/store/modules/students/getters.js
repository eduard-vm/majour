const sortMethods = {};

export default {
  all: state => state.students,
  sort: state => sort => {
    if (sortMethods[sort]) {
      return state.students.sort(sort);
    }
    return state.all;
  },
};
