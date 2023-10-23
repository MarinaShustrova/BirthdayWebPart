## BirthdaysWebPart 

Данный репозиторий представляет собой веб-часть, разработанную для сайта SharePoint, предназначенную для отображения дней рождения сотрудников на текущую дату. Этот README файл содержит информацию о том, как настроить и использовать данную веб-часть.

### Установка и сборка проекта

```bash
1. Клонируйте репозиторий: 
git clone https://github.com/ваш_пользователь/BirthdaysWebPart.git
2. Установите зависимости:
Перейдите в каталог проекта и выполните команду для установки зависимостей:
cd BirthdaysWebPart
npm install
```

### Сборка проекта 
 Выполните следующие команды для сборки проекта:
npm i -g gulp (установка Gulp, если он еще не установлен)
gulp (запуск сборки проекта)

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CD

### Варианты сборки 
gulp clean - очистка проекта
gulp test - запуск тестов 
gulp serve - запуск локального сервера 
gulp bundle --ship - создание бандла для продакшена 
gulp package-solution --ship - создание пакета решения для разворачивания на сервере SharePoint 


