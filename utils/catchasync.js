export const catchAsync = (fn) => {
  return (req, res, next) => fn(req, res, next).catch(next); //equla to : .catch(err=>next(err))
};
