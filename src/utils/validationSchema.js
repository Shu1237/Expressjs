import { checkSchema } from 'express-validator';



export const createTaskSchema = checkSchema({
  name: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Task name cannot be empty',
    },
    isLength: {
      options: { min: 3 },
      errorMessage: 'Task name must be at least 3 characters long',
    },
  },
  description: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Description cannot be empty',
    },
    isLength: {
      options: { min: 5 },
      errorMessage: 'Description must be at least 5 characters long',
    },
  },
  date: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Date cannot be empty',
    },
    isISO8601: {
      errorMessage: 'Invalid date format, please use YYYY-MM-DD',
    },
    custom: {
      options: (value) => {
        const today = new Date();
        const taskDate = new Date(value);
        if (taskDate < today) {
          throw new Error('Date must be in the future');
        }
        return true;
      },
      errorMessage: 'Date must be in the future',
    },
  },
  status: {
    in: ['body'],
    optional: true,
    isIn: {
      options: [['todo', 'in_progress', 'done', "cancel"]],
      errorMessage: 'Status must be one of: todo, in_progress, done',
    },
  },
});



export const createAccountSchema = checkSchema({
  username: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Username cannot be empty',
    },
    isLength: {
      options: { min: 3, max: 15 },
      errorMessage: 'Username must be between 3 and 15 characters long',
    },
    isString: {
      errorMessage: 'Username must be a string',
    },
  },
  password: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Password cannot be empty',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long',
    },
    isString: {
      errorMessage: 'Password must be a string',
    },
  },
  fullname: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Full name cannot be empty',
    },
    isString: {
      errorMessage: 'Full name must be a string',
    },
    
  },
  role: {
      in: ['body'],
      optional: true,
      isIn: {
        options: [['user', 'admin']],
        errorMessage: 'Please only choose user or admin',
      },
    }
});

export const updateAccoutSchema = checkSchema({
  fullname: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Full name cannot be empty',
    },
    isString: {
      errorMessage: 'Full name must be a string',
    },
  },
});
