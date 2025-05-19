/**
 * @swagger
 * tags:
 *   - name: Users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Lấy danh sách người dùng (chỉ Admin)
 *     description: Chỉ người dùng có quyền Admin mới truy cập
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Cập nhật thông tin người dùng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /users/{id}/soft-delete:
 *   patch:
 *     tags: [Users]
 *     summary: Xóa mềm người dùng
 *     description: Đánh dấu người dùng là đã xóa (không xóa khỏi DB)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Xóa mềm thành công
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Xóa cứng người dùng
 *     description: Xóa vĩnh viễn khỏi hệ thống (chỉ Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Đã xóa hoàn toàn người dùng
 */
