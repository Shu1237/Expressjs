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
 * /tasks/{id}/update-status:
 *   patch:
 *     tags: [Tasks]
 *     summary: Cập nhật trạng thái của task (chỉ người tạo hoặc admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của task cần cập nhật
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             example:
 *               msg: Updated status successfully
 *       400:
 *         description: Task đã hoàn thành hoặc không hợp lệ
 *         content:
 *           application/json:
 *             example:
 *               msg: Task is already completed
 *       401:
 *         description: Không xác thực
 *       403:
 *         description: Không có quyền cập nhật task này
 *       500:
 *         description: Lỗi máy chủ nội bộ
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
