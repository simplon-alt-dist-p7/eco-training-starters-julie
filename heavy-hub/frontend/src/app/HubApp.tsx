// définition des routes

import { useCallback } from 'react';
import type {
  RawContentItem,
  DisplayContentItem,
  RawContentDetail,
  DisplayContentDetail,
} from '../types/content.types';

// const refreshNotifications = useCallback(async () => {
//   try {
//     const payload =
//       await fetchJson<NotificationsPayload>('/api/notifications');

//     setNotifications(decorateNotifications(payload));
//   } catch (error) {
//     console.error('Erreur de chargement des messages', error);
//   }
// }, []);
