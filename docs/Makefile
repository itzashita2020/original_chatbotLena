# Makefile для Project_init
# Этот файл упрощает выполнение типичных команд и позволяет Claude Code контролировать что запускается

.PHONY: help dev build test lint typecheck security clean install audit fix-lint

# По умолчанию показать help
.DEFAULT_GOAL := help

## help: Показать это сообщение помощи
help:
	@echo "Доступные команды:"
	@echo ""
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/ /'
	@echo ""

## dev: Запустить development сервер
dev:
	@echo "🚀 Запуск development сервера..."
	npm run dev

## build: Собрать проект для production
build:
	@echo "📦 Сборка проекта..."
	npm run build

## start: Запустить production сервер (после build)
start:
	@echo "▶️  Запуск production сервера..."
	npm run start

## test: Запустить все тесты
test:
	@echo "🧪 Запуск тестов..."
	npm run test

## test-watch: Запустить тесты в watch режиме
test-watch:
	@echo "👀 Запуск тестов в watch режиме..."
	npm run test:watch

## lint: Проверить код линтером
lint:
	@echo "🔍 Проверка кода линтером..."
	npm run lint

## fix-lint: Автоматически исправить проблемы линтера
fix-lint:
	@echo "🔧 Автоматическое исправление линтера..."
	npm run lint -- --fix

## typecheck: Проверить TypeScript типы
typecheck:
	@echo "📘 Проверка TypeScript типов..."
	npm run type-check

## security: Проверить безопасность (npm audit)
security:
	@echo "🔐 Проверка безопасности..."
	npm audit
	@echo ""
	@echo "Для автоматического исправления: make security-fix"

## security-fix: Автоматически исправить уязвимости
security-fix:
	@echo "🔐 Автоматическое исправление уязвимостей..."
	npm audit fix

## audit: Полная проверка (lint + typecheck + test + security)
audit:
	@echo "🔎 Полная проверка проекта..."
	@make lint
	@make typecheck
	@make test
	@make security

## install: Установить зависимости
install:
	@echo "📥 Установка зависимостей..."
	npm install

## clean: Очистить build артефакты и node_modules
clean:
	@echo "🧹 Очистка проекта..."
	rm -rf node_modules .next dist build out
	@echo "✅ Проект очищен"

## reinstall: Переустановить все зависимости (clean + install)
reinstall: clean install
	@echo "✅ Зависимости переустановлены"

## format: Форматировать код (Prettier)
format:
	@echo "✨ Форматирование кода..."
	npm run format

## db-migrate: Запустить database миграции
db-migrate:
	@echo "🗄️  Запуск миграций БД..."
	npm run db:migrate

## db-reset: Сбросить БД и применить миграции
db-reset:
	@echo "⚠️  Сброс БД..."
	npm run db:reset

## db-seed: Заполнить БД тестовыми данными
db-seed:
	@echo "🌱 Заполнение БД тестовыми данными..."
	npm run db:seed

## pre-commit: Проверки перед коммитом (lint + typecheck)
pre-commit:
	@echo "✅ Pre-commit проверки..."
	@make lint
	@make typecheck
	@echo "✅ Готово к коммиту!"

## pre-push: Проверки перед push (audit + build)
pre-push:
	@echo "✅ Pre-push проверки..."
	@make audit
	@make build
	@echo "✅ Готово к push!"

## init: Первичная настройка проекта (для новых разработчиков)
init:
	@echo "🎉 Инициализация проекта..."
	@make install
	@cp -n .env.example .env.local || echo ".env.local уже существует"
	@echo ""
	@echo "✅ Проект инициализирован!"
	@echo ""
	@echo "Следующие шаги:"
	@echo "1. Отредактируй .env.local с нужными переменными"
	@echo "2. Запусти 'make dev' для старта development сервера"

## doctor: Диагностика окружения (проверить что всё установлено)
doctor:
	@echo "🔬 Диагностика окружения..."
	@echo ""
	@echo "Node.js версия:"
	@node --version || echo "❌ Node.js не установлен"
	@echo ""
	@echo "npm версия:"
	@npm --version || echo "❌ npm не установлен"
	@echo ""
	@echo "git версия:"
	@git --version || echo "❌ git не установлен"
	@echo ""
	@echo "gh CLI версия:"
	@gh --version || echo "⚠️  gh CLI не установлен (опционально)"
	@echo ""
	@test -f .env.local && echo "✅ .env.local существует" || echo "⚠️  .env.local не найден"
	@test -d node_modules && echo "✅ node_modules установлены" || echo "⚠️  node_modules не установлены (запусти: make install)"
