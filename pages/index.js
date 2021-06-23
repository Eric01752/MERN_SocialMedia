import React, { useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';

function Index({ user, userFollowStats }) {
  useEffect(() => {
    document.title = `Welcome, ${user.name.split(' ')[0]}`;
  }, []);

  return <div>Homepage</div>;
}

export default Index;
