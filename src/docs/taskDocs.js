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
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Tạo task (người dùng hoặc admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Báo cáo tuần
 *               description:
 *                 type: string
 *                 example: Tổng hợp tiến độ các dự án
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-05-20T08:00:00Z
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-05-25T17:00:00Z
 *               assignedTo:
 *                 type: array
 *                 description: |
 *                   (Tùy chọn) **Chỉ admin** có thể nhập `assignedTo`.
 *                   Với người dùng thường, backend sẽ tự gán ID của chính họ.
 *                 items:
 *                   type: string
 *                 example: ["user1", "user2"]
 *             required:
 *               - title
 *               - startDate
 *               - dueDate
 *     responses:
 *       201:
 *         description: Task đã được tạo
 */

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Cập nhật task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 * /tasks/{id}/soft-delete:
 *   patch:
 *     tags: [Tasks]
 *     summary: Xóa mềm task (ẩn task)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task đã bị ẩn (xóa mềm)
 */

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Xóa cứng task (xóa khỏi DB)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task đã bị xóa hoàn toàn
 */
