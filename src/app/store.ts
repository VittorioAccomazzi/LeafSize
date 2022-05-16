import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import selectionReducer from '../pages/selection/selectionSlice';
import settingsReducer from '../pages/settings/settingSlice';
import finalizedReducer from '../pages/process/ProcessSlice';
import { enableMapSet } from 'immer';

export const store = configureStore({
  reducer: {
    selection: selectionReducer,
    settings : settingsReducer,
    finalized: finalizedReducer
  },
  // 🖐 The following line are necessary since we store FileSystemHandle and FileSystemDirectoryHandle
  // in the Redux store. These classes are not serializable by javascript right now, but they are by
  // indexDB and postmessage. So I'm wondering if this can be extended ....
  // see my question on https://github.com/WICG/file-system-access/issues/368 in order to avoid this.
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      // Ignore these action types
      ignoredActions: ['selection/setFolder','selection/setFiles'],
      // Ignore these field paths in all actions
      ignoredActionPaths: ['payload.0'],
      // Ignore these paths in the state
      ignoredPaths: ['selection.folder', 'selection.files','settings.leafVals', 'settings.pathVals'],
    }, 
  }),
});

// the following line is necessary since we are using
// sets in the redux store.
enableMapSet();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
