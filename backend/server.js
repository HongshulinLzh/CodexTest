const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const db = require('./db')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_please_change'

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ message: 'ok' })
})

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' })
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    db.run(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, passwordHash],
      function onInsert(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: '用户名已存在' })
          }
          return res.status(500).json({ message: '注册失败' })
        }

        return res.status(201).json({
          message: '注册成功',
          user: {
            id: this.lastID,
            username
          }
        })
      }
    )
  } catch (_error) {
    return res.status(500).json({ message: '服务器错误' })
  }
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' })
  }

  db.get(
    'SELECT id, username, password_hash FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ message: '登录失败' })
      }

      if (!user) {
        return res.status(401).json({ message: '用户名或密码错误' })
      }

      const isValid = await bcrypt.compare(password, user.password_hash)
      if (!isValid) {
        return res.status(401).json({ message: '用户名或密码错误' })
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '2h' }
      )

      return res.json({
        message: '登录成功',
        token,
        user: {
          id: user.id,
          username: user.username
        }
      })
    }
  )
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
