/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Xác thực người dùng
 */

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng ký
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng xuất
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
