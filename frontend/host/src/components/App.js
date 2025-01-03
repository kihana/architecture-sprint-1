import React, { lazy, Suspense }  from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import Main from "./Main";
import Footer from "./Footer";
import api from "../utils/api";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";

const EditProfilePopup = lazy(() => import('profile/EditProfilePopup')
//.catch(() => {
//  return { default: () => <div className='error'>Component is not available!</div> };
// })
);

const EditAvatarPopup = lazy(() => import('profile/EditAvatarPopup')
//.catch(() => {
//  return { default: () => <div className='error'>Component is not available!</div> };
// })
);

const Login = lazy(() => import('users/Login')
//.catch(() => {
//  return { default: () => <div className='error'>Component is not available!</div> };
// })
);

const Header = lazy(() => import('users/Header')
//.catch(() => {
//  return { default: () => <div className='error'>Component is not available!</div> };
// })
);

const Register = lazy(() => import('users/Register')
//.catch(() => {
//  return { default: () => <div className='error'>Component is not available!</div> };
// })
);

const PopupWithForm = lazy(() => import('shared/PopupWithForm')
//.catch(() => {
//  return { default: () => <div className='error'>Component is not available!</div> };
// })
);

const ImagePopup = lazy(() => import('cards/ImagePopup')
//.catch(() => {
//  return { default: () => <div className='error'>Component is not available!</div> };
// })
);

const AddPlacePopup = lazy(() => import('cards/AddPlacePopup')
//.catch(() => {
//  return { default: () => <div className='error'>Component is not available!</div> };
// })
);

import CardsApi from 'cards/api';
import ProfileApi from 'profile/api';
import CurrentUserContext from 'shared/CurrentUserContext';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);

  // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
  const [currentUser, setCurrentUser] = React.useState({});

  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  //В компоненты добавлены новые стейт-переменные: email — в компонент App
  const [email, setEmail] = React.useState("");

  // Запрос к API за информацией о пользователе и массиве карточек выполняется единожды, при монтировании.
  React.useEffect(() => {
    api
      .getAppInfo()
      .then(([cardData, userData]) => {
        setCurrentUser(userData);
        setCards(cardData);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(userUpdate) {
    ProfileApi
      .setUserInfo(userUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(avatarUpdate) {
    ProfileApi
      .setUserAvatar(avatarUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    CardsApi
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    CardsApi
      .removeCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newCard) {
    CardsApi
      .addCard(newCard)
      .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    // В компонент App внедрён контекст через CurrentUserContext.Provider
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Suspense fallback={<div>Loading...</div>}>
          <Header email={email} setIsLoggedIn={setIsLoggedIn} />
        </Suspense>
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={isLoggedIn}
          />
          <Route path="/signup">
            <Suspense fallback={<div>Loading...</div>}>
              <Register setTooltipStatus={setTooltipStatus} setIsInfoToolTipOpen={setIsInfoToolTipOpen} />
            </Suspense>
          </Route>
          <Route path="/signin">
            <Suspense fallback={<div>Loading...</div>}>
              <Login setTooltipStatus={setTooltipStatus} setIsInfoToolTipOpen={setIsInfoToolTipOpen} setIsLoggedIn={setIsLoggedIn}/>
            </Suspense>
          </Route>
        </Switch>
        <Footer />
        <Suspense fallback={<div>Loading...</div>}>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onUpdateUser={handleUpdateUser}
            onClose={closeAllPopups}
          />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onAddPlace={handleAddPlaceSubmit}
            onClose={closeAllPopups}
          />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onUpdateAvatar={handleUpdateAvatar}
            onClose={closeAllPopups}
          />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </Suspense>
        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
