import { checkSchema } from 'express-validator';

import { query } from 'express-validator';

export const validateUsernameQuery = [
  query('username')
    .optional()
    .isString()
    .withMessage('Username must be a string')
    .isLength({ min: 3, max: 10 })
    .withMessage('Username must be 3 to 10 characters')
];

export const createTaskSchema = checkSchema({
  title: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Task title cannot be empty',
    },
    isLength: {
      options: { min: 3 },
      errorMessage: 'Task title must be at least 3 characters long',
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

  startDate: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Start date cannot be empty',
    },
    isISO8601: {
      errorMessage: 'Invalid start date format, please use YYYY-MM-DD',
    },
    custom: {
      options: (value) => {
        const today = new Date();
        const startDate = new Date(value);
        if (startDate < today) {
          throw new Error('Start date must be in the future');
        }
        return true;
      },
    },
  },

  dueDate: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Due date cannot be empty',
    },
    isISO8601: {
      errorMessage: 'Invalid due date format, please use YYYY-MM-DD',
    },
    custom: {
      options: (value, { req }) => {
        const dueDate = new Date(value);
        const startDate = new Date(req.body.startDate);
        if (dueDate <= startDate) {
          throw new Error('Due date must be after the start date');
        }
        return true;
      },
    },
  },

  status: {
    in: ['body'],
    optional: true,
    isIn: {
      options: [['todo', 'done', 'cancel']],
      errorMessage: 'Status must be one of: todo, done',
    },
  },

  assignedTo: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'assignedTo is required',
    },
    isMongoId: {
      errorMessage: 'assignedTo must be a valid MongoDB ObjectId',
    },
    optional:true
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
