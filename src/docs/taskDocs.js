/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: Quản lý công việc
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Lấy tất cả task (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /createTask:
 *   post:
 *     tags: [Tasks]
 *     summary: Tạo task (người dùng hoặc admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *               - type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                   dueDate:
 *                     type: string
 *                   assignedTo:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       201:
 *         description: Task đã được tạo
 */

/**
 * @swagger
 * /updateTask/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Cập nhật task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */



/**
 * @swagger
 * /hidedeleteTask/{id}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Xóa cứng task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Task đã bị xóa hoàn toàn
 */

/**
 * @swagger
 * /harddeleteTask/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Xóa cứng task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Task đã bị xóa hoàn toàn
 */
