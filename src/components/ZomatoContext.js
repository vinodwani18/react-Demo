import * as React from "react";

const ZomatoContext = React.createContext(null);

export const ZomatoContextProvider = ZomatoContext.Provider;
export const ZomatoContextConsumer = ZomatoContext.Consumer;
