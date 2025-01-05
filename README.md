# Yandex Practicum (sprint 1)
## Уровень 1. Проектирование
Я выбрал Webpack Module Federation так, как пример работы с Webpack Module Federation был расмотрен в демо-проекте к заданию. Сделал демо-проект, подход показался достаточно удобным и гибким. Опыта в разработки веб-продуктов нету, сравнивать особо не с чем, поэтому остановился на Webpack.

## Уровень 2. Планирование изменений
Следующие отдельные логические части выделил в отдельные микрофронты, чтобы можно было их развивать независимо и добавлять мощности только на тот функционал, который находится под нагрузкой:

**host** - главное приложение, которое содержит каркасные компонеты и перенаправляет запросы в соотвествующие логические блоки (ремоуты)

**users** - отвечает за регистрацию, аутентификацию и выход из приложения.
Соответственно содержит:
- экспортируемые компоненты: Login, Register и Header.
- api: auth
- стили: auth-form, login, header

**cards** - отвечает за работу с фотографиями: добавление, удаление, лайки и отображение в отдельном окне.
Соответственно содержит:
- экспортируемые компоненты: AddPlacePopup, Card и ImagePopup.
- api - из монолита вынесены соответствующие api: getCardList, addCard, removeCard и changeLikeCardStatus
- стили: card

**profile** - отвечает за работу с профилем пользователя: редактирование профиля и аватара.
Соответственно содержит:
- экспортируемые компоненты: EditAvatarPopup, EditProfilePopup.
- api - из монолита вынесены соответствующие api: getUserInfo, setUserInfo и setUserAvatar
- стили: profile

**shared** - содержит общий компонент PopupWithForm и контекст CurrentUserContext. Они используются в users, profile, cards, host.

Ссылка на задание 2: https://github.com/kihana/architecture-sprint-1/blob/sprint_1/sprint1_task2.drawio