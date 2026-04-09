# Mesto Backend API

Backend API для проекта Mesto на `Node.js`, `Express`, `TypeScript` и `MongoDB`.
Сервис поддерживает регистрацию и авторизацию пользователей, работу с профилем, создание карточек, удаление своих карточек и постановку/снятие лайков.

## Возможности

- регистрация и вход по `email` и `password`
- авторизация через `JWT`
- получение и обновление профиля пользователя
- создание карточек и удаление только своих карточек
- лайки и снятие лайков с карточек
- валидация входящих данных через `celebrate` / `Joi`
- логирование запросов и ошибок в файлы
- ограничение частоты запросов через `express-rate-limit`

## Стек

- `Node.js`
- `Express`
- `TypeScript`
- `MongoDB`
- `Mongoose`
- `JWT`
- `Winston`
- `ESLint`

## Структура проекта

```text
src/
  app.ts                  # точка входа приложения
  controllers/            # обработчики бизнес-логики
  routes/                 # маршруты API
  models/                 # схемы и модели Mongoose
  middlewares/            # auth, логирование, валидация, обработка ошибок
  errors/                 # кастомные классы ошибок
  utils/                  # константы
  types/express/          # расширение типов Express
```

## Требования

- `Node.js` 18+ рекомендуется
- `MongoDB` локально или удаленно
- `npm`

## Установка и запуск

1. Установить зависимости:

```bash
npm install
```

2. Создать файл `.env` в корне проекта:

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/mestodb
JWT_SECRET=dev-secret-key
```

3. Убедиться, что MongoDB запущена и доступна по `MONGO_URL`.

4. Запустить проект:

```bash
npm run dev
```

Для обычного запуска:

```bash
npm start
```

## Скрипты

- `npm run dev` - запуск в режиме разработки через `ts-node-dev`
- `npm start` - запуск приложения через `ts-node`
- `npm run build` - компиляция TypeScript в папку `dist`
- `npm run lint` - проверка кода линтером

Примечание: в текущей конфигурации `npm start` запускает приложение напрямую из `TypeScript`, а не из `dist`.

## Переменные окружения

- `PORT` - порт HTTP-сервера, по умолчанию `3000`
- `MONGO_URL` - строка подключения к MongoDB, по умолчанию `mongodb://localhost:27017/mestodb`
- `JWT_SECRET` - секрет для подписи и проверки JWT

Для production нельзя использовать значение `JWT_SECRET` по умолчанию.

## Аутентификация

После успешного входа `POST /signin` сервер возвращает JWT:

```json
{
  "token": "your-jwt-token"
}
```

Для защищенных роутов токен нужно передавать в заголовке:

```http
Authorization: Bearer <jwt-token>
```

Срок действия токена в текущей реализации: `7d`.

## Основные маршруты API

### Публичные роуты

- `POST /signup` - регистрация пользователя
- `POST /signin` - вход и получение JWT

### Защищенные роуты

#### Пользователи

- `GET /users` - получить список пользователей
- `GET /users/me` - получить текущего пользователя
- `GET /users/:userId` - получить пользователя по id
- `PATCH /users/me` - обновить `name` и `about`
- `PATCH /users/me/avatar` - обновить аватар

#### Карточки

- `GET /cards` - получить список карточек
- `POST /cards` - создать карточку
- `DELETE /cards/:cardId` - удалить свою карточку
- `PUT /cards/:cardId/likes` - поставить лайк
- `DELETE /cards/:cardId/likes` - снять лайк

## Примеры тел запросов

### Регистрация

```json
{
  "name": "Ярослава",
  "about": "Разработчик",
  "avatar": "https://example.com/avatar.png",
  "email": "user@example.com",
  "password": "strong-password"
}
```

### Вход

```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

### Обновление профиля

```json
{
  "name": "Новое имя",
  "about": "Новое описание"
}
```

### Создание карточки

```json
{
  "name": "Архыз",
  "link": "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg"
}
```

## Валидация и ограничения

- `email` проверяется как корректный email
- `userId` и `cardId` должны быть валидными `ObjectId`
- поля `name` и `about` ограничены длиной от `2` до `30`
- URL для `avatar` и `link` проверяется валидатором
- лимит запросов: `100` запросов за `15` минут на IP

## Логи

Приложение пишет логи в файлы:

- `request.log` - входящие запросы
- `error.log` - ошибки приложения

Эти файлы создаются в корне проекта во время работы сервера.

## Обработка ошибок

В проекте используются кастомные ошибки:

- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`

## Полезно знать

- пароль пользователя хэшируется через `bcryptjs`
- все роуты `/users` и `/cards` защищены middleware `auth`
- неизвестные маршруты возвращают ошибку `404`
- тесты в проекте пока не настроены