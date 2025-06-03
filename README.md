# Preact Simple Components

Библиотека простых Preact компонентов для встраивания в любые веб-страницы без необходимости настройки сборщика.

## Использование

Подключите скомпилированный компонент на страницу:

```html
<script src="./dist/cookie/cookie.iife.js"></script>
<script>
  const cookieComponent = window.simpleComponents.cookie({
    root: '#my-container', // или HTMLElement
    props: {
      title: 'Мы используем cookies',
      description: 'Для улучшения работы сайта'
    },
    container: {
      attributes: { 'data-component': 'cookie' },
      style: { 'z-index': '9999' }
    }
  });

  // Обновление пропсов
  cookieComponent.update({ title: 'Новый заголовок' });
  
  // Размонтирование
  cookieComponent.unmount();
</script>
```

## Доступные компоненты

- **Cookie** - баннер для уведомления о cookies

## Разработка

```bash
# Установка зависимостей
pnpm install

# Запуск dev сервера
pnpm dev

# Предварительный просмотр без build
pnpm preview

# Предварительный просмотр c build
pnpm preview:build
```

## Сборка

```bash
pnpm build
```

Скомпилированные компоненты будут в папке `dist/`.
