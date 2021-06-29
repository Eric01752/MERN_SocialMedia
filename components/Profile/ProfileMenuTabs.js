import React from 'react';
import { Menu } from 'semantic-ui-react';

function ProfileMenuTabs({
  activeItem,
  handleItemClick,
  followersLength,
  followingLength,
  ownAccount,
  loggedUserFollowStats,
}) {
  return (
    <>
      <Menu pointing secondary>
        <Menu.Item
          name='Profile'
          active={activeItem === 'profile'}
          onClick={() => handleItemClick('profile')}
        />

        {ownAccount ? (
          <>
            <Menu.Item
              name={`${
                loggedUserFollowStats.followers.length > 0
                  ? loggedUserFollowStats.followers.length
                  : 0
              } Followers`}
              active={activeItem === 'followers'}
              onClick={() => handleItemClick('followers')}
            />

            <Menu.Item
              name={`${
                loggedUserFollowStats.following.length > 0
                  ? loggedUserFollowStats.following.length
                  : 0
              } Following`}
              active={activeItem === 'following'}
              onClick={() => handleItemClick('following')}
            />
          </>
        ) : (
          <>
            <Menu.Item
              name={`${followersLength} Followers`}
              active={activeItem === 'followers'}
              onClick={() => handleItemClick('followers')}
            />

            <Menu.Item
              name={`${followingLength} Following`}
              active={activeItem === 'following'}
              onClick={() => handleItemClick('following')}
            />
          </>
        )}

        {ownAccount && (
          <>
            <Menu.Item
              name='Update Profile'
              active={activeItem === 'updateProfile'}
              onClick={() => handleItemClick('updateProfile')}
            />

            <Menu.Item
              name='Settings'
              active={activeItem === 'settings'}
              onClick={() => handleItemClick('settings')}
            />
          </>
        )}
      </Menu>
    </>
  );
}

export default ProfileMenuTabs;
