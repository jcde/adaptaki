import React, { useState, useEffect } from 'react'
import AppPersisted from './AppPersisted'
import Adaptaki from './components/Adaptaki'
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

const App = () => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  async function loadResourcesAsync() {
    await Promise.all([
      Font.loadAsync({
        "FontAwesome": require("./assets/fonts/FontAwesome.ttf")
      }),
    ]);
  }
  function handleLoadingError(error) {
    console.warn(error);
  }
  function handleFinishLoading(setLoadingComplete) {
    setLoadingComplete(true);
  }
  if (!isLoadingComplete) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return isLoadingComplete
      ? <AppPersisted><Adaptaki /></AppPersisted>
      : <AppLoading />;
  }
}

export default App