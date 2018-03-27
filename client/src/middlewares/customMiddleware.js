
const customMiddleware = store => next => action => { // eslint-disable-line no-unused-vars
  // console.log("custome middleware triggered", action);
  next(action);
};

export default customMiddleware;
