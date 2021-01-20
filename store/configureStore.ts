import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  const composedEnhancers = composeWithDevTools();//...enhancers);
  let store = createStore(persistedReducer, undefined/*preloadedState*/, composedEnhancers)
  let persistor = persistStore(store)

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept(() => {
      // This fetch the new state of the above reducers.
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(
        persistReducer(persistConfig, nextRootReducer)
      )
    })
  }//*/

  return { store, persistor }
}