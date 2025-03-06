const jsonServer = require("json-server");
const cookieParser = require("cookie-parser");
const server = jsonServer.create();
const router = jsonServer.router("./fakeDB.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(cookieParser());

// Добавляем логирование запросов
server.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Промежуточное ПО для проверки авторизации
const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ success: false, data: { message: "Не авторизован." } });
  }
  
  const user = router.db.get("users").find({ token }).value();
  if (!user) {
    return res.status(401).json({ success: false, data: { message: "Недействительный токен." } });
  }
  
  req.user = user;
  next();
};

server.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = router.db.get("users").find({ email, password }).value();
  if (user) {
    res.cookie("token", user.token, { 
      httpOnly: true,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000 // 24 часа
    });
    res.json({ success: true, data: { token: user.token } });
  } else {
    res
      .status(401)
      .json({ success: false, data: { message: "Access denied." } });
  }
});

// Добавляем маршрут для профиля
server.get("/api/profile", authMiddleware, (req, res) => {
  // Удаляем пароль из данных пользователя для безопасности
  const { password, ...userWithoutPassword } = req.user;                  
  res.json({ success: true, data: userWithoutPassword });
});

// Добавляем маршрут для автора
server.get("/api/author", authMiddleware, (req, res) => {
  console.log("Author API request received");
  // Имитация длительной операции
  const timeoutId = setTimeout(() => {
    // Проверяем, не закрыто ли соединение клиентом
    if (res.writableEnded) return;
    
    // Выбираем случайного автора из базы данных
    const authors = router.db.get("authors").value();
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    console.log("Sending author response:", randomAuthor);
    res.json({ success: true, data: randomAuthor });
  }, 1500); // Задержка в 1.5 секунды для имитации длительной операции
  
  // Обработка отключения клиента (например, при отмене запроса)
  req.on('close', () => {
    clearTimeout(timeoutId);
  });
});

// Добавляем маршрут для цитаты
server.get("/api/quote", authMiddleware, (req, res) => {
  console.log("Quote API request received with query:", req.query);
  // Имитация длительной операции
  const timeoutId = setTimeout(() => {
    // Проверяем, не закрыто ли соединение клиентом
    if (res.writableEnded) return;
    
    const { authorId } = req.query;
    
    if (!authorId) {
      return res.status(400).json({ success: false, data: { message: "Необходимо указать authorId" } });
    }
    
    // Находим цитаты автора
    const quotes = router.db.get("quotes").filter({ authorId: parseInt(authorId) }).value();
    
    if (quotes.length === 0) {
      return res.status(404).json({ success: false, data: { message: "Цитаты не найдены для данного автора" } });
    }
    
    // Выбираем случайную цитату
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    console.log("Sending quote response:", randomQuote);
    res.json({ success: true, data: randomQuote });
  }, 1500); // Задержка в 1.5 секунды для имитации длительной операции
  
  // Обработка отключения клиента (например, при отмене запроса)
  req.on('close', () => {
    clearTimeout(timeoutId);
  });
});

server.delete("/api/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ success: true, data: {} });
});

server.use(router);
server.listen(5001, () => {
  console.log("JSON Server is running on port 5001");
});
