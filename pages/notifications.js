import React from 'react';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import { parseCookies } from 'nookies';

function Notifications({ notifications, errorLoading }) {
  console.log(notifications);

  return <div></div>;
}

Notifications.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/notifications`, {
      headers: { Authorization: token },
    });

    return { notifications: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Notifications;
