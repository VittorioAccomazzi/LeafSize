import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import selectionReducer from '../pages/selection/selectionSlice';
import settingsReducer from '../pages/settings/settingSlice'

export const store = configureStore({
  reducer: {
    selection : selectionReducer,
    settings : settingsReducer
  },
  // 🖐 The following line are necessary since we store FileSystemHandle and FileSystemDirectoryHandle
  // in teh Redux store. These classes are not serializable by javascript right now, but they are by
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
      ignoredPaths: ['selection.folder', 'selection.files'],
    }, 
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
