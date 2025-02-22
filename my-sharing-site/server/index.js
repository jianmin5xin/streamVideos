// server/index.js
const express = require('express')
const mysql = require('mysql2/promise')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const cors = require('cors') // 确保安装 cors 包

dotenv.config()
const app = express()
app.use(express.json())

// 配置 CORS，允许来自 localhost:5173 的请求
app.use(cors({
  origin: 'http://localhost:5173', // 允许前端地址
  credentials: true // 允许携带凭证（如 cookies、authorization headers）
}))

// MySQL 连接
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sharing_site'
})

// 配置 multer 用于处理文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 上传文件的存储目录
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // 文件名
    }
});

const upload = multer({ storage: storage });

// 处理文件上传的路由
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).json({ message: '文件上传成功' });
    } else {
        res.status(400).json({ message: '文件上传失败' });
    }
});

// 注册
app.post('/api/register', async (req, res) => {
  const { email, username, password } = req.body
  try {
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email])
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '邮箱已注册' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashedPassword]
    )

    res.json({ user: { id: result.insertId, email, username }, message: '注册成功' })
  } catch (error) {
    res.status(500).json({ message: '注册失败', error: error.message })
  }
})

// 登录
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email])
  const user = users[0]

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
    res.json({ user: { id: user.id, email: user.email, username: user.username }, token })
  } else {
    res.status(401).json({ message: '登录失败' })
  }
})

// 获取用户信息
app.get('/api/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: '未提供 token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const [users] = await db.query('SELECT id, email, username FROM users WHERE id = ?', [decoded.id])
    const user = users[0]

    if (user) {
      res.json({ user })
    } else {
      res.status(404).json({ message: '用户不存在' })
    }
  } catch (error) {
    res.status(401).json({ message: '无效 token' })
  }
})

// 获取帖子接口
app.get('/api/posts', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: '未提供 token' })
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const [posts] = await db.query('SELECT * FROM posts WHERE user_id = ?', [decoded.id])
      res.json(posts)
    } catch (error) {
      res.status(401).json({ message: '无效 token 或获取帖子失败', error: error.message })
    }
  })

// 确保所有路由都支持 CORS
app.listen(3000, () => console.log('Server running on port 3000'))