import axios from 'axios';

import { Communicator } from './Communicator';

export function remoteHTTPCaller(baseUrl = process.env.POELITE_API_URL) {
  const apiBaseUrl = baseUrl;

  if (!apiBaseUrl) {
    throw new Error('No apiBaseUrl was provided');
  }

  const authOptions: any = {
    headers: {
      Authorization: null,
    },
  };

  return {
    setToken(token: string) {
      authOptions.headers.Authorization = `Bearer ${token}`;
    },
    async get(resource: string) {
      const result = await axios.get(`${apiBaseUrl}?${resource}`, { ...authOptions });

      return result.data;
    },
  };
}

interface ResourceToEvent {

}

export function interCaller<T>(communicator: Communicator, map: T) {
  let requestedData = 0;

  return {
    setToken(token: string) {},
    async get(resource: string) {
      return requestedData;
    },
  };
}

export type Requester = ReturnType<typeof remoteHTTPCaller>;
